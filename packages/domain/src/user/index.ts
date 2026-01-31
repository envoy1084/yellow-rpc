import { RedisCore, type RedisError } from "@yellow-rpc/redis";
import { Context, Effect, Layer, type Option, Schema } from "effect";
import merge from "lodash.merge";

import { toMutable } from "@/common";

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
          yield* redis.json.set(key, "$", toMutable(user));
        }),
      getUser: (walletAddress) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}`;
          const res = yield* redis.json.get(key);
          return Schema.decodeUnknownOption(UserSchema)(res);
        }),
      updateUser: (walletAddress, changes) =>
        Effect.gen(function* () {
          const key = `${suffix}:${walletAddress}`;
          const res = yield* redis.json.get(key);
          const user = Schema.decodeUnknownOption(UserSchema)(res);
          const newUser = merge(user, changes);
          yield* redis.json.set(key, "$", toMutable(newUser));
        }),
    });
  }),
);
