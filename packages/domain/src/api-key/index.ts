import { RedisCore, type RedisError } from "@envoy1084/effect-redis";
import { type ApiKey, ApiKeySchema } from "@yellow-rpc/schema";
import { Context, Effect, Layer, Option, Schema } from "effect";

export class ApiKeyRepository extends Context.Tag("ApiKeyRepository")<
  ApiKeyRepository,
  {
    getApiKey: (id: string) => Effect.Effect<Option.Option<ApiKey>, RedisError>;
    createApiKey: (
      walletAddress: string,
      data: ApiKey,
    ) => Effect.Effect<void, RedisError>;
    updateApiKey: (
      id: string,
      changes: Partial<ApiKey>,
    ) => Effect.Effect<void, RedisError>;
    deleteApiKey: (
      id: string,
      walletAddress: string,
    ) => Effect.Effect<void, RedisError>;
    listApiKeys: (walletAddress: string) => Effect.Effect<ApiKey[], RedisError>;
    getApiKeyByHash: (
      hash: string,
    ) => Effect.Effect<Option.Option<ApiKey>, RedisError>;
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
          const key = `${suffix}:${data.id}`;
          const arrKey = `api_keys:${walletAddress}`;
          const encoded = Schema.encodeSync(ApiKeySchema)(data);
          const reverseKey = `api_key_reverse:${data.hashedKey}`;
          yield* redis.multi((tx) =>
            Effect.gen(function* () {
              // Add Api Key
              yield* tx.hSet(key, encoded);
              // Add Api Key to List
              yield* tx.sAdd(arrKey, data.id);
              // Add Reverse Lookup
              yield* tx.set(reverseKey, data.id);
            }),
          );
        }),
      deleteApiKey: (id, walletAddress) =>
        Effect.gen(function* () {
          const key = `${suffix}:${id}`;
          const arrKey = `api_keys:${walletAddress}`;

          yield* redis.pipeline((tx) =>
            Effect.gen(function* () {
              // Remove Api Key
              yield* tx.del(key);
              // Remove Api Key from List
              yield* tx.sRem(arrKey, id);
              // Remove Reverse Lookup
              yield* tx.del(`api_key_reverse:${id}`);
            }),
          );
        }),
      getApiKey: (id) =>
        Effect.gen(function* () {
          const key = `${suffix}:${id}`;
          const res = yield* redis.hGetAll(key);
          return Schema.decodeUnknownOption(ApiKeySchema)(res);
        }),
      getApiKeyByHash: (hash: string) =>
        Effect.gen(function* () {
          const reverseKey = `api_key_reverse:${hash}`;
          const id = yield* redis.get(reverseKey);
          if (!id) return Option.none();
          const key = `${suffix}:${id}`;
          const res = yield* redis.hGetAll(key);
          return Option.some(Schema.decodeUnknownSync(ApiKeySchema)(res));
        }),
      listApiKeys: (walletAddress) =>
        Effect.gen(function* () {
          const arrKey = `api_keys:${walletAddress}`;
          const ids = yield* redis.sMembers(arrKey);

          if (ids.length === 0) return [];

          const [_, res] = yield* redis.pipeline((tx) =>
            Effect.gen(function* () {
              for (const id of ids) {
                yield* tx.hGetAll(`api_key:${id}`);
              }
            }),
          );

          const keys = res.map((k) =>
            Schema.decodeUnknownSync(ApiKeySchema)(k),
          );
          return keys;
        }),
      updateApiKey: (id, changes) =>
        Effect.gen(function* () {
          const key = `${suffix}:${id}`;
          const keyExists = yield* redis.exists(key);
          if (keyExists === 0) return;

          // Filter out undefined values
          const encodedChanges = Object.fromEntries(
            Object.entries({
              ...changes,
              createdAt: changes.createdAt?.toISOString(),
              updatedAt: new Date().toISOString(),
            }).filter(([_, v]) => v !== undefined),
          ) as Record<string, string>;
          yield* redis.hSet(key, encodedChanges);
        }),
    });
  }),
);
