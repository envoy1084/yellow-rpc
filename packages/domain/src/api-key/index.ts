import { RedisCore, type RedisError } from "@yellow-rpc/redis";
import { Context, Effect, Layer, type Option, Schema } from "effect";
import merge from "lodash.merge";

import { toMutable } from "@/common";

import { type ApiKey, ApiKeySchema } from "./schema";

export class ApiKeyRepository extends Context.Tag("ApiKeyRepository")<
  ApiKeyRepository,
  {
    getApiKey: (id: string) => Effect.Effect<Option.Option<ApiKey>, RedisError>;
    createApiKey: (data: ApiKey) => Effect.Effect<void, RedisError>;
    updateApiKey: (
      id: string,
      changes: Partial<ApiKey>,
    ) => Effect.Effect<void, RedisError>;
    deleteApiKey: (id: string) => Effect.Effect<void, RedisError>;
  }
>() {}

export const ApiKeyRepositoryLive = Layer.effect(
  ApiKeyRepository,
  Effect.gen(function* () {
    const redis = yield* RedisCore;
    const suffix = "api_key";

    return ApiKeyRepository.of({
      createApiKey: (data) =>
        Effect.gen(function* () {
          const key = `${suffix}:${data.id}`;
          yield* redis.json.set(key, "$", toMutable(key));
        }),
      deleteApiKey: (id) =>
        Effect.gen(function* () {
          const key = `${suffix}:${id}`;
          yield* redis.json.del(key);
        }),
      getApiKey: (id) =>
        Effect.gen(function* () {
          const key = `${suffix}:${id}`;
          const res = yield* redis.json.get(key);
          return Schema.decodeUnknownOption(ApiKeySchema)(res);
        }),
      updateApiKey: (id, changes) =>
        Effect.gen(function* () {
          const key = `${suffix}:${id}`;
          const res = yield* redis.json.get(key);
          const apiKey = Schema.decodeUnknownOption(ApiKeySchema)(res);
          const newApiKey = merge(apiKey, changes);
          yield* redis.json.set(key, "$", toMutable(newApiKey));
        }),
    });
  }),
);
