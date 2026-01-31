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
// ⏳ Transaction commands
// ✅ Scripting commands
// ⏳ Connection commands
// ⏳ Server commands
// ⏳ Cluster commands
// ⏳ Generic commands

import { makeRedisBitmap, type RedisBitmapShape } from "./commands/bitmap";
import { makeRedisHash, type RedisHashShape } from "./commands/hash";
import { makeRedisJson, type RedisJsonShape } from "./commands/json";
import { makeRedisList, type RedisListShape } from "./commands/list";
import {
  makeRedisScripting,
  type RedisScriptingShape,
} from "./commands/scripting";
import { makeRedisSet, type RedisSetShape } from "./commands/set";
import {
  makeRedisSortedSet,
  type RedisSortedSetShape,
} from "./commands/sorted-set";
import { makeRedisString, type RedisStringShape } from "./commands/string";
import { RedisConnection } from "./connection";

export type RedisCoreShape = {
  string: RedisStringShape;
  hash: RedisHashShape;
  list: RedisListShape;
  set: RedisSetShape;
  sortedSet: RedisSortedSetShape;
  bitmap: RedisBitmapShape;
  scripting: RedisScriptingShape;
  json: RedisJsonShape;
};

export const makeRedisCore = (c: RedisClientType): RedisCoreShape => ({
  bitmap: makeRedisBitmap(c),
  hash: makeRedisHash(c),
  json: makeRedisJson(c),
  list: makeRedisList(c),
  scripting: makeRedisScripting(c),
  set: makeRedisSet(c),
  sortedSet: makeRedisSortedSet(c),
  string: makeRedisString(c),
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
