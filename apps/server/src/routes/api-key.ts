import { HttpApiBuilder } from "@effect/platform";
import { HttpApiDecodeError } from "@effect/platform/HttpApiError";
import {
  type AuthRequestParams,
  createAuthRequestMessage,
} from "@erc7824/nitrolite";
import { api, type PrepareApiKeyRequest } from "@yellow-rpc/api";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { Effect } from "effect";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const prepareApiKeyHandler = (data: PrepareApiKeyRequest) =>
  Effect.gen(function* () {
    // Step 1: Create new API Key with pending status
    const apiKeyRepo = yield* ApiKeyRepository;

    const apiKeyId = crypto.randomUUID();
    yield* apiKeyRepo.createApiKey(data.walletAddress, {
      appSessionId: undefined,
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

    // Step 2: Create new AppSession with pending status
    const appSessionRepo = yield* AppSessionRepository;

    const sessionPrivateKey = generatePrivateKey();
    const sessionPublicKey = privateKeyToAccount(sessionPrivateKey).address;
    yield* appSessionRepo.createAppSession(apiKeyId, {
      adminBalance: 0,
      assetAddress: "", // This will be populated once api key is activated
      createdAt: new Date(),
      id: "", // This will be populated once api key is activated
      pendingSettlement: 0,
      sessionPrivateKey,
      sessionPublicKey,
      status: "inactive",
      updatedAt: new Date(),
      userBalance: 0,
    });

    const authMessage = yield* Effect.promise(() =>
      createAuthRequestMessage({
        address: data.walletAddress as `0x${string}`,
        allowances: [
          { amount: data.initialBalance.toString(), asset: "ytest.usd" },
        ],
        application: "YellowRPC",
        expires_at: BigInt(Math.floor(data.expiresAt.getTime() / 1000)),
        scope: "yellow-rpc.com",
        session_key: sessionPublicKey,
      }),
    );

    return {
      apiKeyId,
      authMessage,
    };
  }).pipe(
    Effect.catchTag("RedisError", (e) =>
      Effect.fail(
        new HttpApiDecodeError({
          issues: [],
          message: e.message,
        }),
      ),
    ),
  );

export const ApiKeyLive = HttpApiBuilder.group(api, "apiKey", (handlers) =>
  handlers.handle("prepareApiKey", ({ payload }) =>
    prepareApiKeyHandler(payload),
  ),
);

export const ApiKeyTest = ApiKeyLive;
