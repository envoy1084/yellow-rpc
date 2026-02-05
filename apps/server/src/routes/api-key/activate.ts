import { HttpApiDecodeError } from "@effect/platform/HttpApiError";
import { RPCProtocolVersion } from "@erc7824/nitrolite";
import type { ActivateApiKeyRequest } from "@yellow-rpc/api";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import {
  createRandomStringGenerator,
  keyHasher,
} from "@yellow-rpc/domain/helpers";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { YellowClient } from "@yellow-rpc/rpc";
import { Data, Effect, Option } from "effect";
import type { Address } from "viem";

import { Env } from "@/env";
import { Admin } from "@/layers";

class AppSessionError extends Data.TaggedError("AppSessionError")<{
  message?: string;
}> {}

export const activateKeyHandler = (data: ActivateApiKeyRequest) =>
  Effect.gen(function* () {
    const env = yield* Env;
    const admin = yield* Admin;
    const apiKeyRepo = yield* ApiKeyRepository;
    const appSessionRepo = yield* AppSessionRepository;

    const appSession = yield* appSessionRepo.getAppSession(data.apiKeyId);

    if (Option.isNone(appSession)) {
      return yield* Effect.fail(
        new AppSessionError({
          message: "App Session not found",
        }),
      );
    }

    // Step 1: Verify the signature
    // TODO: Implement this

    // Step 2: Create a new App Session (admin)
    const res = yield* Effect.promise(async () => {
      const sdk = new YellowClient({
        url: env.clearNodeRpcUrl,
      });

      await sdk.connect();
      const session = await sdk.authenticate(admin.walletClient, {
        allowances: [],
        application: `yellow-rpc-${data.apiKeyId}`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        scope: "yellow-rpc.",
      });

      const res = await sdk.createAppSession(session.signer, {
        allocations: [
          {
            amount: appSession.value.userBalance.toString(),
            asset: "ytest.usd",
            participant: data.walletAddress as Address,
          },
        ],
        definition: {
          application: `yellow-rpc-${data.apiKeyId}`,
          challenge: 0, // No challenge period
          nonce: Date.now(), // Unique session identifier
          participants: [
            env.adminAddress as Address,
            data.walletAddress as Address,
          ],
          protocol: RPCProtocolVersion.NitroRPC_0_4,
          quorum: 2, // Requires unanimous agreement
          weights: [1, 1], // Equal voting power
        },
      });

      return res.params;
    });
    const appSessionId = res.appSessionId;

    // Step 3: Create a new API Key, update status to active
    const apiKey = `yellow_rpc_${createRandomStringGenerator("a-z", "A-Z", "0-9")(10)}`;
    const hashed = keyHasher(apiKey);

    yield* apiKeyRepo.updateApiKey(data.apiKeyId, data.walletAddress, {
      appSessionId,
      key: hashed,
      start: apiKey.slice(0, 16),
      status: "active",
    });

    // Step 5: Update the App Session (admin)
    yield* appSessionRepo.updateAppSession(data.apiKeyId, {
      id: appSessionId,
      status: "open",
    });

    return {
      apiKey,
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
