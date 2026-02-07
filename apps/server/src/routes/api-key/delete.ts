import { ApiKeyNotFound, type DeleteApiKeyRequest } from "@yellow-rpc/api";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import { Effect } from "effect";

export const deleteApiKeyHandler = (data: DeleteApiKeyRequest) =>
  Effect.gen(function* () {
    const apiKeyRepo = yield* ApiKeyRepository;

    yield* apiKeyRepo
      .deleteApiKey(data.id, data.walletAddress)
      .pipe(Effect.catchAll(() => Effect.fail(new ApiKeyNotFound())));

    return { success: true };
  });
