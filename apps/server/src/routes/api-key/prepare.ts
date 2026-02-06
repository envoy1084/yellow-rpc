import { HttpApiDecodeError } from "@effect/platform/HttpApiError";
import type { PrepareApiKeyRequest } from "@yellow-rpc/api";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import { encryptAesGcm } from "@yellow-rpc/domain/helpers";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { Effect, Redacted } from "effect";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { Env } from "@/env";

export const prepareApiKeyHandler = (data: PrepareApiKeyRequest) =>
  Effect.gen(function* () {
    // Step 1: Create new API Key with pending status
    const apiKeyRepo = yield* ApiKeyRepository;

    const apiKeyId = crypto.randomUUID();
    yield* Effect.log("Creating API Key: ", apiKeyId);
    yield* apiKeyRepo.createApiKey(data.walletAddress, {
      appSessionId: "", // This will be populated once api key is activated
      chain: data.chain,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
      id: apiKeyId,
      key: "", // This will be populated once api key is activated
      name: data.name,
      ownerAddress: data.walletAddress,
      start: "", // This will be populated once api key is activated
      status: "inactive",
      updatedAt: new Date(),
    });
    yield* Effect.log("Created API Key", apiKeyId);

    // Step 2: Create new AppSession with pending status
    const appSessionRepo = yield* AppSessionRepository;

    yield* Effect.log("Creating App Session");
    const sessionPrivateKey = generatePrivateKey();
    const sessionPublicKey = privateKeyToAccount(sessionPrivateKey).address;
    const env = yield* Env;
    const encSessionPrivateKey = encryptAesGcm({
      masterKey: Redacted.value(env.masterKey),
      text: sessionPrivateKey,
    });
    yield* appSessionRepo.createAppSession(apiKeyId, {
      adminBalance: 0,
      asset: "ytest.usd",
      createdAt: new Date(),
      id: "", // This will be populated once api key is activated
      pendingSettlement: 0,
      sessionPrivateKey: encSessionPrivateKey,
      sessionPublicKey,
      status: "inactive",
      updatedAt: new Date(),
      userBalance: data.initialBalance,
      version: 1,
    });
    yield* Effect.log("Created App Session", sessionPublicKey);

    yield* Effect.log("Generating Auth Message");
    const authParams = JSON.stringify({
      address: data.walletAddress as `0x${string}`,
      allowances: [
        { amount: data.initialBalance.toString(), asset: "ytest.usd" },
      ],
      application: `yellow-rpc-${apiKeyId}`,
      expires_at: Math.floor(data.expiresAt.getTime() / 1000),
      scope: "yellow-rpc.com",
      session_key: sessionPublicKey,
    });
    yield* Effect.log("Message Generated", authParams);

    return {
      apiKeyId,
      authParams,
    };
  }).pipe(
    Effect.catchAll((e) =>
      Effect.fail(
        new HttpApiDecodeError({
          issues: [],
          message: e.message,
        }),
      ),
    ),
  );
