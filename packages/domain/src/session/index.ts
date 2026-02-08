import { RedisCore, type RedisError } from "@envoy1084/effect-redis";
import { type AppSession, AppSessionSchema } from "@yellow-rpc/schema";
import { Context, Effect, Layer, Option, Schema } from "effect";

export class AppSessionRepository extends Context.Tag("AppSessionRepository")<
  AppSessionRepository,
  {
    getAppSession: (
      walletAddress: string,
    ) => Effect.Effect<Option.Option<AppSession>, RedisError>;
    createAppSession: (
      walletAddress: string,
      data: AppSession,
    ) => Effect.Effect<void, RedisError>;
    updateAppSession: (
      walletAddress: string,
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
      createAppSession: (walletAddress, data) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}`;
          const encoded = Schema.encodeSync(AppSessionSchema)(data);
          yield* redis.hSet(key, encoded);
        }),
      getAppSession: (walletAddress) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}`;
          const res = yield* redis.hGetAll(key);
          if (Object.keys(res).length === 0) return Option.none();
          const r = Schema.decodeUnknownSync(AppSessionSchema)(res);
          return Option.some(r);
        }),
      updateAppSession: (walletAddress, changes) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}`;
          const keyExists = yield* redis.exists(key);
          if (keyExists === 0) return;

          // Filter out undefined values
          const encodedChanges = Object.fromEntries(
            Object.entries({
              ...changes,
              adminBalance:
                changes.adminBalance !== undefined
                  ? changes.adminBalance.toString()
                  : undefined,
              createdAt: changes.createdAt?.toISOString(),
              pendingSettlement:
                changes.pendingSettlement !== undefined
                  ? changes.pendingSettlement.toString()
                  : undefined,
              updatedAt: new Date().toISOString(),
              userBalance:
                changes.userBalance !== undefined
                  ? changes.userBalance.toString()
                  : undefined,
            }).filter(([_, v]) => v !== undefined),
          ) as Record<string, string>;
          yield* redis.hSet(key, encodedChanges);
        }),
    });
  }),
);
