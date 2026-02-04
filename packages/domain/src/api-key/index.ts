import { RedisCore, type RedisError } from "@envoy1084/effect-redis";
import {
  type ApiKey,
  ApiKeySchema,
  type CreateApiKeyRequest,
} from "@yellow-rpc/schema";
import { Context, Effect, Layer, type Option, Schema } from "effect";

export class ApiKeyRepository extends Context.Tag("ApiKeyRepository")<
  ApiKeyRepository,
  {
    getApiKey: (
      walletAddress: string,
      id: string,
    ) => Effect.Effect<Option.Option<ApiKey>, RedisError>;
    createApiKey: (
      walletAddress: string,
      data: CreateApiKeyRequest,
    ) => Effect.Effect<void, RedisError>;
    updateApiKey: (
      walletAddress: string,
      id: string,
      changes: Partial<ApiKey>,
    ) => Effect.Effect<void, RedisError>;
    deleteApiKey: (
      id: string,
      walletAddress: string,
    ) => Effect.Effect<void, RedisError>;
  }
>() {}

export const ApiKeyRepositoryLive = Layer.effect(
  ApiKeyRepository,
  Effect.gen(function* () {
    const redis = yield* RedisCore;
    const suffix = "api_key";

    return ApiKeyRepository.of({
      createApiKey: (walletAddress, data) =>
        Effect.gen(function* () {
          const apiKey: ApiKey = {
            ...data,
            appSessionId: undefined,
            createdAt: new Date(),
            id: "", // TODO: Generate a unique id
            key: "", // TODO: Generate a unique key
            ownerAddress: walletAddress,
            start: "", // TODO: Generate a unique start
            status: "inactive",
            updatedAt: new Date(),
          };
          const key = `${suffix}:${walletAddress}:${apiKey.id}`;
          const arrKey = `user:${walletAddress}:api_keys`;
          yield* redis.sAdd(arrKey, apiKey.id);
          const encoded = Schema.encodeSync(ApiKeySchema)(apiKey);
          yield* redis.hSet(key, encoded);
        }),
      deleteApiKey: (id, walletAddress) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}:${id}`;
          const arrKey = `user:${walletAddress}:api_keys`;
          yield* redis.sRem(arrKey, id);
          yield* redis.del(key);
        }),
      getApiKey: (id, walletAddress) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}:${id}`;
          const res = yield* redis.json.get(key);
          return Schema.decodeUnknownOption(ApiKeySchema)(res);
        }),
      updateApiKey: (id, walletAddress, changes) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}:${id}`;
          const keyExists = yield* redis.exists(key);
          if (keyExists === 0) return;

          // Filter out undefined values
          const encodedChanges = Object.fromEntries(
            Object.entries({
              ...changes,
              createdAt: changes.updatedAt?.toISOString(),
              updatedAt: new Date().toISOString(),
            }).filter(([_, v]) => v !== undefined),
          ) as Record<string, string>;
          yield* redis.hSet(key, encodedChanges);
        }),
    });
  }),
);
