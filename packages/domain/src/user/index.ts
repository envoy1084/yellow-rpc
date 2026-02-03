import { RedisCore, type RedisError } from "@envoy1084/effect-redis";
import { Context, Effect, Layer, Option, Schema } from "effect";
import merge from "lodash.merge";

import { type User, UserSchema } from "./schema";

export class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  {
    getUser: (
      walletAddress: string,
    ) => Effect.Effect<Option.Option<User>, RedisError>;
    createUser: (user: User) => Effect.Effect<void, RedisError>;
    updateUser: (
      walletAddress: string,
      changes: Partial<User>,
    ) => Effect.Effect<void, RedisError>;
  }
>() {}

export const UserRepositoryLive = Layer.effect(
  UserRepository,
  Effect.gen(function* () {
    const redis = yield* RedisCore;

    const suffix = "user";

    return UserRepository.of({
      createUser: (user) =>
        Effect.gen(function* () {
          const key = `${suffix}:${user.walletAddress}`;
          const value = Schema.encodeSync(UserSchema)(user);
          yield* redis.hSet(key, value);
        }),
      getUser: (walletAddress) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}`;
          const res = yield* redis.hGetAll(key);
          return Schema.decodeUnknownOption(UserSchema)(res);
        }),
      updateUser: (walletAddress, changes) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}`;
          const res = yield* redis.get(key);
          const user = Schema.decodeUnknownOption(UserSchema)(res);
          if (Option.isNone(user)) return;
          const newUser = Schema.encodeSync(UserSchema)(
            merge(user.value, changes),
          );
          yield* redis.hSet(key, newUser);
        }),
    });
  }),
);
