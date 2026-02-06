import {
  ApiKeyCreationFailed,
  AppSessionNotFound,
  type CreateApiKeyRequest,
} from "@yellow-rpc/api";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { Effect, Option } from "effect";

import { Hasher, KeyGenerator } from "@/layers";

export const createApiKeyHandler = (data: CreateApiKeyRequest) =>
  Effect.gen(function* () {
    const appSessionRepo = yield* AppSessionRepository;
    const apiKeyRepo = yield* ApiKeyRepository;
    const keyGenerator = yield* KeyGenerator;
    const hasher = yield* Hasher;

    // Step 1: Lookup AppSession
    const appSessionRes = yield* appSessionRepo
      .getAppSession(data.ownerAddress)
      .pipe(
        Effect.catchTag("RedisError", () =>
          Effect.fail(new AppSessionNotFound()),
        ),
      );

    if (Option.isNone(appSessionRes)) {
      return yield* Effect.fail(new AppSessionNotFound());
    }

    const appSession = appSessionRes.value;

    const apiKey = yield* keyGenerator.generateKey("yellow_rpc_", 32);
    const maskedKey = apiKey.slice(0, 16);
    const hashedKey = yield* hasher.hash(apiKey);

    // Create Api Key
    yield* apiKeyRepo
      .createApiKey(data.ownerAddress, {
        appSessionId: appSession.appSessionId,
        chain: data.chain,
        createdAt: new Date(),
        expiresAt: data.expiresAt,
        hashedKey: hashedKey,
        id: crypto.randomUUID(),
        lastUsedAt: new Date(),
        maskedKey: maskedKey,
        name: data.name,
        ownerAddress: data.ownerAddress,
        status: "active",
        updatedAt: new Date(),
      })
      .pipe(
        Effect.catchAll((e) =>
          Effect.fail(
            new ApiKeyCreationFailed({
              message: e.message,
            }),
          ),
        ),
      );

    return { apiKey };
  });
