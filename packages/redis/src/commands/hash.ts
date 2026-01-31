// Hash Commands
//
// HDEL - Deletes one or more fields and their values from a hash. Deletes the hash if no fields remain.
// HEXISTS - Determines whether a field exists in a hash.
// HEXPIRE - Set expiry for hash field using relative time to expire (seconds)
// HEXPIREAT - Set expiry for hash field using an absolute Unix timestamp (seconds)
// HEXPIRETIME - Returns the expiration time of a hash field as a Unix timestamp, in seconds.
// HGET - Returns the value of a field in a hash.
// HGETALL - Returns all fields and values in a hash.
// HGETDEL - Returns the value of a field and deletes it from the hash.
// HGETEX - Get the value of one or more fields of a given hash key, and optionally set their expiration.
// HINCRBY - Increments the integer value of a field in a hash by a number. Uses 0 as initial value if the field doesn't exist.
// HINCRBYFLOAT - Increments the floating point value of a field by a number. Uses 0 as initial value if the field doesn't exist.
// HKEYS - Returns all fields in a hash.
// HLEN - Returns the number of fields in a hash.
// HMGET - Returns the values of all fields in a hash.
// HMSET - Sets the values of multiple fields. // TODO: Not Supported
// HPERSIST - Removes the expiration time for each specified field
// HPEXPIRE - Set expiry for hash field using relative time to expire (milliseconds)
// HPEXPIREAT - Set expiry for hash field using an absolute Unix timestamp (milliseconds)
// HPEXPIRETIME - Returns the expiration time of a hash field as a Unix timestamp, in msec.
// HPTTL - Returns the TTL in milliseconds of a hash field.
// HRANDFIELD - Returns one or more random fields from a hash.
// HSCAN - Iterates over fields and values of a hash.
// HSET - Creates or modifies the value of a field in a hash.
// HSETEX - Set the value of one or more fields of a given hash key, and optionally set their expiration.
// HSETNX - Sets the value of a field in a hash only when the field doesn't exist.
// HSTRLEN - Returns the length of the value of a field.
// HTTL - Returns the TTL in seconds of a hash field.
// HVALS - Returns all values in a hash.

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisHashShape = {
  hDel: Effectify<RedisClientType["hDel"]>;
  hExists: Effectify<RedisClientType["hExists"]>;
  hExpire: Effectify<RedisClientType["hExpire"]>;
  hExpireAt: Effectify<RedisClientType["hExpireAt"]>;
  hExpireTime: Effectify<RedisClientType["hExpireTime"]>;
  hGet: Effectify<RedisClientType["hGet"]>;
  hGetAll: Effectify<RedisClientType["hGetAll"]>;
  hGetDel: Effectify<RedisClientType["hGetDel"]>;
  hGetEx: Effectify<RedisClientType["hGetEx"]>;
  hIncrBy: Effectify<RedisClientType["hIncrBy"]>;
  hIncrByFloat: Effectify<RedisClientType["hIncrByFloat"]>;
  hKeys: Effectify<RedisClientType["hKeys"]>;
  hLen: Effectify<RedisClientType["hLen"]>;
  hmGet: Effectify<RedisClientType["hmGet"]>;
  //   hmSet: Effectify<RedisClientType['hmSet']>; // Not Supported
  hPersist: Effectify<RedisClientType["hPersist"]>;
  hpExpire: Effectify<RedisClientType["hpExpire"]>;
  hpExpireAt: Effectify<RedisClientType["hpExpireAt"]>;
  hpExpireTime: Effectify<RedisClientType["hpExpireTime"]>;
  hpTTL: Effectify<RedisClientType["hpTTL"]>;
  hRandField: Effectify<RedisClientType["hRandField"]>;
  hScan: Effectify<RedisClientType["hScan"]>;
  hSet: Effectify<RedisClientType["hSet"]>;
  hSetEx: Effectify<RedisClientType["hSetEx"]>;
  hSetNX: Effectify<RedisClientType["hSetNX"]>;
  hStrLen: Effectify<RedisClientType["hStrLen"]>;
  hTTL: Effectify<RedisClientType["hTTL"]>;
  hVals: Effectify<RedisClientType["hVals"]>;
};

export const makeRedisHash = (c: RedisClientType): RedisHashShape => ({
  hDel: effectify(c.hDel),
  hExists: effectify(c.hExists),
  hExpire: effectify(c.hExpire),
  hExpireAt: effectify(c.hExpireAt),
  hExpireTime: effectify(c.hExpireTime),
  hGet: effectify(c.hGet),
  hGetAll: effectify(c.hGetAll),
  hGetDel: effectify(c.hGetDel),
  hGetEx: effectify(c.hGetEx),
  hIncrBy: effectify(c.hIncrBy),
  hIncrByFloat: effectify(c.hIncrByFloat),
  hKeys: effectify(c.hKeys),
  hLen: effectify(c.hLen),
  hmGet: effectify(c.hmGet),
  //   hmSet: effectify(c.hmSet), // Not Supported
  hPersist: effectify(c.hPersist),
  hpExpire: effectify(c.hpExpire),
  hpExpireAt: effectify(c.hpExpireAt),
  hpExpireTime: effectify(c.hpExpireTime),
  hpTTL: effectify(c.hpTTL),
  hRandField: effectify(c.hRandField),
  hScan: effectify(c.hScan),
  hSet: effectify(c.hSet),
  hSetEx: effectify(c.hSetEx),
  hSetNX: effectify(c.hSetNX),
  hStrLen: effectify(c.hStrLen),
  hTTL: effectify(c.hTTL),
  hVals: effectify(c.hVals),
});
