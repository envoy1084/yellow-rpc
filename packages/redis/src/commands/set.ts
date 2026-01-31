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
  sAdd: effectify(c.sAdd.bind(c)),
  sCard: effectify(c.sCard.bind(c)),
  sDiff: effectify(c.sDiff.bind(c)),
  sDiffStore: effectify(c.sDiffStore.bind(c)),
  sInter: effectify(c.sInter.bind(c)),
  sInterCard: effectify(c.sInterCard.bind(c)),
  sInterStore: effectify(c.sInterStore.bind(c)),
  sIsMember: effectify(c.sIsMember.bind(c)),
  sMembers: effectify(c.sMembers.bind(c)),
  sMove: effectify(c.sMove.bind(c)),
  smIsMember: effectify(c.smIsMember.bind(c)),
  sPop: effectify(c.sPop.bind(c)),
  sRandMember: effectify(c.sRandMember.bind(c)),
  sRem: effectify(c.sRem.bind(c)),
  sScan: effectify(c.sScan.bind(c)),
  sUnion: effectify(c.sUnion.bind(c)),
  sUnionStore: effectify(c.sUnionStore.bind(c)),
});
