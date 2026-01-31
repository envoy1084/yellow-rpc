// String Commands
//
// APPEND - Appends a string to the value of a key. Creates the key if it doesn't exist.
// DECR - Decrements the integer value of a key by one. Uses 0 as initial value if the key doesn't exist.
// DECRBY - Decrements a number from the integer value of a key. Uses 0 as initial value if the key doesn't exist.
// DELEX - Conditionally removes the specified key based on value or hash digest comparison. ⭐ New in 8.4
// DIGEST - Returns the hash digest of a string value as a hexadecimal string. ⭐ New in 8.4
// GET - Returns the string value of a key.
// GETDEL - Returns the string value of a key after deleting the key.
// GETEX - Returns the string value of a key after setting its expiration time.
// GETRANGE - Returns a substring of the string stored at a key.
// GETSET - Returns the previous string value of a key after setting it to a new value.
// INCR - Increments the integer value of a key by one. Uses 0 as initial value if the key doesn't exist.
// INCRBY - Increments the integer value of a key by a number. Uses 0 as initial value if the key doesn't exist.
// INCRBYFLOAT - Increment the floating point value of a key by a number. Uses 0 as initial value if the key doesn't exist.
// LCS - Finds the longest common substring.
// MGET - Atomically returns the string values of one or more keys.
// MSET - Atomically creates or modifies the string values of one or more keys.
// MSETEX - Atomically sets multiple string keys with a shared expiration in a single operation. ⭐ New in 8.4
// MSETNX - Atomically modifies the string values of one or more keys only when all keys don't exist.
// PSETEX - Sets both string value and expiration time in milliseconds of a key. The key is created if it doesn't exist.
// SET - Sets the string value of a key, ignoring its type. The key is created if it doesn't exist.
// SETEX - Sets the string value and expiration time of a key. Creates the key if it doesn't exist.
// SETNX - Set the string value of a key only when the key doesn't exist.
// SETRANGE - Overwrites a part of a string value with another by an offset. Creates the key if it doesn't exist.
// STRLEN - Returns the length of a string value.
// SUBSTR - Returns a substring from a string value.

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisStringShape = {
  append: Effectify<RedisClientType["append"]>;
  decr: Effectify<RedisClientType["decr"]>;
  decrBy: Effectify<RedisClientType["decrBy"]>;
  delEx: Effectify<RedisClientType["delEx"]>;
  digest: Effectify<RedisClientType["digest"]>;
  get: Effectify<RedisClientType["get"]>;
  getDel: Effectify<RedisClientType["getDel"]>;
  getEx: Effectify<RedisClientType["getEx"]>;
  getRange: Effectify<RedisClientType["getRange"]>;
  getSet: Effectify<RedisClientType["getSet"]>;
  incr: Effectify<RedisClientType["incr"]>;
  incrBy: Effectify<RedisClientType["incrBy"]>;
  incrByFloat: Effectify<RedisClientType["incrByFloat"]>;
  lcs: Effectify<RedisClientType["lcs"]>;
  mGet: Effectify<RedisClientType["mGet"]>;
  mSet: Effectify<RedisClientType["mSet"]>;
  mSetEx: Effectify<RedisClientType["mSetEx"]>;
  mSetNX: Effectify<RedisClientType["mSetNX"]>;
  pSetEx: Effectify<RedisClientType["pSetEx"]>;
  set: Effectify<RedisClientType["set"]>;
  setEx: Effectify<RedisClientType["setEx"]>;
  setNX: Effectify<RedisClientType["setNX"]>;
  setRange: Effectify<RedisClientType["setRange"]>;
  strLen: Effectify<RedisClientType["strLen"]>;
};

export const makeRedisString = (c: RedisClientType): RedisStringShape => ({
  append: effectify(c.append.bind(c)),
  decr: effectify(c.decr.bind(c)),
  decrBy: effectify(c.decrBy.bind(c)),
  delEx: effectify(c.delEx.bind(c)),
  digest: effectify(c.digest.bind(c)),
  get: effectify(c.get.bind(c)),
  getDel: effectify(c.getDel.bind(c)),
  getEx: effectify(c.getEx.bind(c)),
  getRange: effectify(c.getRange.bind(c)),
  getSet: effectify(c.getSet.bind(c)),
  incr: effectify(c.incr.bind(c)),
  incrBy: effectify(c.incrBy.bind(c)),
  incrByFloat: effectify(c.incrByFloat.bind(c)),
  lcs: effectify(c.lcs.bind(c)),
  mGet: effectify(c.mGet.bind(c)),
  mSet: effectify(c.mSet.bind(c)),
  mSetEx: effectify(c.mSetEx.bind(c)),
  mSetNX: effectify(c.mSetNX.bind(c)),
  pSetEx: effectify(c.pSetEx.bind(c)),
  set: effectify(c.set.bind(c)),
  setEx: effectify(c.setEx.bind(c)),
  setNX: effectify(c.setNX.bind(c)),
  setRange: effectify(c.setRange.bind(c)),
  strLen: effectify(c.strLen.bind(c)),
});
