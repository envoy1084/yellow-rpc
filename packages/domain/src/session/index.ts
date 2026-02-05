import { RedisCore, type RedisError } from "@envoy1084/effect-redis";
import { type AppSession, AppSessionSchema } from "@yellow-rpc/schema";
import { Context, Effect, Layer, type Option, Schema } from "effect";

export class AppSessionRepository extends Context.Tag("AppSessionRepository")<
  AppSessionRepository,
  {
    getAppSession: (
      apiKeyId: string,
    ) => Effect.Effect<Option.Option<AppSession>, RedisError>;
    createAppSession: (
      apiKeyId: string,
      data: AppSession,
    ) => Effect.Effect<void, RedisError>;
    updateAppSession: (
      apiKeyId: string,
      changes: Partial<AppSession>,
    ) => Effect.Effect<void, RedisError>;
  }
>() {}

export const AppSessionRepositoryLive = Layer.effect(
  AppSessionRepository,
  Effect.gen(function* () {
    const redis = yield* RedisCore;
    const suffix = "app_session";

    return AppSessionRepository.of({
      createAppSession: (apiKeyId, data) =>
        Effect.gen(function* () {
          const key = `${suffix}:${apiKeyId}`;
          const encoded = Schema.encodeSync(AppSessionSchema)(data);
          yield* redis.hSet(key, encoded);
        }),
      getAppSession: (apiKeyId) =>
        Effect.gen(function* () {
          const key = `${suffix}:${apiKeyId}`;
          const res = yield* redis.hGetAll(key);
          return Schema.decodeUnknownOption(AppSessionSchema)(res);
        }),
      updateAppSession: (apiKeyId, changes) =>
        Effect.gen(function* () {
          const key = `${suffix}:${apiKeyId}`;
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
