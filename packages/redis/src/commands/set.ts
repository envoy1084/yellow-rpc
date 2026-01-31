// Set commands operate on unordered collections of unique strings.

// SADD - Adds one or more members to a set. Creates the key if it doesn't exist.
// SCARD - Returns the number of members in a set.
// SDIFF - Returns the difference of multiple sets.
// SDIFFSTORE - Stores the difference of multiple sets in a key.
// SINTER - Returns the intersect of multiple sets.
// SINTERCARD - Returns the number of members of the intersect of multiple sets.
// SINTERSTORE - Stores the intersect of multiple sets in a key.
// SISMEMBER - Determines whether a member belongs to a set.
// SMEMBERS - Returns all members of a set.
// SMISMEMBER - Determines whether multiple members belong to a set.
// SMOVE - Moves a member from one set to another.
// SPOP - Returns one or more random members from a set after removing them. Deletes the set if the last member was popped.
// SRANDMEMBER - Get one or multiple random members from a set
// SREM - Removes one or more members from a set. Deletes the set if the last member was removed.
// SSCAN - Iterates over members of a set.
// SUNION - Returns the union of multiple sets.
// SUNIONSTORE - Stores the union of multiple sets in a key.

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisSetShape = {
  sAdd: Effectify<RedisClientType["sAdd"]>;
  sCard: Effectify<RedisClientType["sCard"]>;
  sDiff: Effectify<RedisClientType["sDiff"]>;
  sDiffStore: Effectify<RedisClientType["sDiffStore"]>;
  sInter: Effectify<RedisClientType["sInter"]>;
  sInterCard: Effectify<RedisClientType["sInterCard"]>;
  sInterStore: Effectify<RedisClientType["sInterStore"]>;
  sIsMember: Effectify<RedisClientType["sIsMember"]>;
  sMembers: Effectify<RedisClientType["sMembers"]>;
  smIsMember: Effectify<RedisClientType["smIsMember"]>;
  sMove: Effectify<RedisClientType["sMove"]>;
  sPop: Effectify<RedisClientType["sPop"]>;
  sRandMember: Effectify<RedisClientType["sRandMember"]>;
  sRem: Effectify<RedisClientType["sRem"]>;
  sScan: Effectify<RedisClientType["sScan"]>;
  sUnion: Effectify<RedisClientType["sUnion"]>;
  sUnionStore: Effectify<RedisClientType["sUnionStore"]>;
};

export const makeRedisSet = (c: RedisClientType): RedisSetShape => ({
  sAdd: effectify(c.sAdd),
  sCard: effectify(c.sCard),
  sDiff: effectify(c.sDiff),
  sDiffStore: effectify(c.sDiffStore),
  sInter: effectify(c.sInter),
  sInterCard: effectify(c.sInterCard),
  sInterStore: effectify(c.sInterStore),
  sIsMember: effectify(c.sIsMember),
  sMembers: effectify(c.sMembers),
  sMove: effectify(c.sMove),
  smIsMember: effectify(c.smIsMember),
  sPop: effectify(c.sPop),
  sRandMember: effectify(c.sRandMember),
  sRem: effectify(c.sRem),
  sScan: effectify(c.sScan),
  sUnion: effectify(c.sUnion),
  sUnionStore: effectify(c.sUnionStore),
});
