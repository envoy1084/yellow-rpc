import { HttpApiDecodeError } from "@effect/platform/HttpApiError";
import type { ActivateApiKeyRequest } from "@yellow-rpc/api";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import {
  createRandomStringGenerator,
  keyHasher,
} from "@yellow-rpc/domain/helpers";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { Effect } from "effect";

export const activateKeyHandler = (data: ActivateApiKeyRequest) =>
  Effect.gen(function* () {
    // Step 1: Verify the signature
    data.signature; // TODO: Implement this

    // Step 2: Create a new App Session (admin)
    // TODO: Implement this
    const appSessionId = "";

    // Step 3: Create a new API Key, update status to active
    const apiKeyRepo = yield* ApiKeyRepository;

    const apiKey = `yellow_rpc_${createRandomStringGenerator("a-z", "A-Z", "0-9")(10)}`;
    const hashed = keyHasher(apiKey);

    yield* apiKeyRepo.updateApiKey(data.apiKeyId, data.walletAddress, {
      appSessionId,
      key: hashed,
      start: apiKey.slice(0, 16),
      status: "active",
    });

    // Step 5: Update the App Session (admin)
    const appSessionRepo = yield* AppSessionRepository;
    yield* appSessionRepo.updateAppSession(data.apiKeyId, {
      id: appSessionId,
      status: "open",
    });

    return {
      apiKey,
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
