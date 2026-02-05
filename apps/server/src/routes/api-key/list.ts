import { HttpApiDecodeError } from "@effect/platform/HttpApiError";
import type { ListApiKeysRequest } from "@yellow-rpc/api";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import { Effect } from "effect";
export const listApiKeysHandler = (payload: ListApiKeysRequest) =>
  Effect.gen(function* () {
    const apiKeyRepo = yield* ApiKeyRepository;

    const apiKeys = yield* apiKeyRepo.listApiKeys(payload.walletAddress);

    return apiKeys;
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
