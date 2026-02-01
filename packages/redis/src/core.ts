// core/index.ts

import { Context, Effect, Layer } from "effect";
import type { RedisClientType } from "redis";

// Redis Commands Reference
//
// ✅ String commands
// ✅ Hash commands
// ✅ List commands
// ✅ Set commands
// ✅ Sorted set commands
// ⏳ Stream commands
// ✅ Bitmap commands
// ⏳ HyperLogLog commands
// ⏳ Geospatial commands
// ✅ JSON commands
// ⏳ Search commands
// ⏳ Time series commands
// ⏳ Vector set commands
// ⏳ Pub/Sub commands
// ✅ Transaction commands (Pipeline and Multi)
// ✅ Scripting commands
// ⏳ Connection commands
// ⏳ Server commands
// ⏳ Cluster commands
// ✅ Generic commands

// Commands
import * as bitMap from "./commands/bitmap";
import * as generic from "./commands/generic";
import * as hash from "./commands/hash";
import * as json from "./commands/json";
import * as list from "./commands/list";
import * as scripting from "./commands/scripting";
import * as set from "./commands/set";
import * as sortedSet from "./commands/sorted-set";
import * as string from "./commands/string";
// Connection
import { RedisConnection } from "./connection";
// Errors
import { RedisError } from "./errors";

export type RedisTxShape = {
  string: string.RedisStringQueue;
  hash: hash.RedisHashQueue;
  list: list.RedisListQueue;
  set: set.RedisSetQueue;
  sortedSet: sortedSet.RedisSortedSetQueue;
  bitmap: bitMap.RedisBitmapQueue;
  scripting: scripting.RedisScriptingQueue;
  json: json.RedisJsonQueue;
  generic: generic.RedisGenericQueue;
};

export type RedisCoreShape = {
  string: string.RedisStringAsync;
  hash: hash.RedisHashAsync;
  list: list.RedisListAsync;
  set: set.RedisSetAsync;
  sortedSet: sortedSet.RedisSortedSetAsync;
  bitmap: bitMap.RedisBitmapAsync;
  scripting: scripting.RedisScriptingAsync;
  json: json.RedisJsonAsync;
  generic: generic.RedisGenericAsync;
  multi<A>(
    program: (tx: RedisTxShape) => Effect.Effect<A, RedisError>,
  ): Effect.Effect<
    readonly [result: A, exec: ReadonlyArray<unknown> | null],
    RedisError
  >;
  pipeline<A>(
    program: (tx: RedisTxShape) => Effect.Effect<A, RedisError>,
  ): Effect.Effect<
    readonly [result: A, exec: ReadonlyArray<unknown>],
    RedisError
  >;
};

// biome-ignore lint/suspicious/noExplicitAny: safe
const makeRedisTx = (c: any): RedisTxShape => ({
  bitmap: bitMap.makeRedisBitmapQueue(c),
  generic: generic.makeRedisGenericQueue(c),
  hash: hash.makeRedisHashQueue(c),
  json: json.makeRedisJsonQueue(c),
  list: list.makeRedisListQueue(c),
  scripting: scripting.makeRedisScriptingQueue(c),
  set: set.makeRedisSetQueue(c),
  sortedSet: sortedSet.makeRedisSortedSetQueue(c),
  string: string.makeRedisStringQueue(c),
});

const makeRedisCore = (c: RedisClientType): RedisCoreShape => ({
  bitmap: bitMap.makeRedisBitmap(c),
  generic: generic.makeRedisGeneric(c),
  hash: hash.makeRedisHash(c),
  json: json.makeRedisJson(c),
  list: list.makeRedisList(c),
  multi: <A>(program: (tx: RedisTxShape) => Effect.Effect<A, RedisError>) =>
    Effect.gen(function* () {
      const txClient = c.multi();
      const txApi = makeRedisTx(txClient);

      const programResult = yield* program(txApi);

      const execResult = yield* Effect.tryPromise({
        catch: (e) => new RedisError({ cause: e }),
        try: () => txClient.exec(),
      });

      return [programResult, execResult] as const;
    }),
  pipeline: <A>(program: (tx: RedisTxShape) => Effect.Effect<A, RedisError>) =>
    Effect.gen(function* () {
      const txClient = c.multi();
      const txApi = makeRedisTx(txClient);

      const programResult = yield* program(txApi);

      const execResult = yield* Effect.tryPromise({
        catch: (e) => new RedisError({ cause: e }),
        try: () => txClient.execAsPipeline(),
      });

      return [programResult, execResult] as const;
    }),

  scripting: scripting.makeRedisScripting(c),
  set: set.makeRedisSet(c),
  sortedSet: sortedSet.makeRedisSortedSet(c),
  string: string.makeRedisString(c),
});

export class RedisCore extends Context.Tag("RedisCore")<
  RedisCore,
  RedisCoreShape
>() {}

export const RedisCoreLive = Layer.effect(
  RedisCore,
  Effect.gen(function* () {
    const { client } = yield* RedisConnection;

    return makeRedisCore(client);
  }),
);
