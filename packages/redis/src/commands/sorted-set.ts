// Sorted set commands operate on sets of unique strings ordered by a score.

// BZMPOP - Removes and returns a member by score from one or more sorted sets. Blocks until a member is available otherwise. Deletes the sorted set if the last element was popped.
// BZPOPMAX - Removes and returns the member with the highest score from one or more sorted sets. Blocks until a member available otherwise. Deletes the sorted set if the last element was popped.
// BZPOPMIN - Removes and returns the member with the lowest score from one or more sorted sets. Blocks until a member is available otherwise. Deletes the sorted set if the last element was popped.
// ZADD - Adds one or more members to a sorted set, or updates their scores. Creates the key if it doesn't exist.
// ZCARD - Returns the number of members in a sorted set.
// ZCOUNT - Returns the count of members in a sorted set that have scores within a range.
// ZDIFF - Returns the difference between multiple sorted sets.
// ZDIFFSTORE - Stores the difference of multiple sorted sets in a key.
// ZINCRBY - Increments the score of a member in a sorted set.
// ZINTER - Returns the intersect of multiple sorted sets.
// ZINTERCARD - Returns the number of members of the intersect of multiple sorted sets.
// ZINTERSTORE - Stores the intersect of multiple sorted sets in a key.
// ZLEXCOUNT - Returns the number of members in a sorted set within a lexicographical range.
// ZMPOP - Returns the highest- or lowest-scoring members from one or more sorted sets after removing them. Deletes the sorted set if the last member was popped.
// ZMSCORE - Returns the score of one or more members in a sorted set.
// ZPOPMAX - Returns the highest-scoring members from a sorted set after removing them. Deletes the sorted set if the last member was popped.
// ZPOPMIN - Returns the lowest-scoring members from a sorted set after removing them. Deletes the sorted set if the last member was popped.
// ZRANDMEMBER - Returns one or more random members from a sorted set.
// ZRANGE - Returns members in a sorted set within a range of indexes.
// ZRANGEBYLEX - Returns members in a sorted set within a lexicographical range.
// ZRANGEBYSCORE - Returns members in a sorted set within a range of scores.
// ZRANGESTORE - Stores a range of members from sorted set in a key.
// ZRANK - Returns the index of a member in a sorted set ordered by ascending scores.
// ZREM - Removes one or more members from a sorted set. Deletes the sorted set if all members were removed.
// ZREMRANGEBYLEX - Removes members in a sorted set within a lexicographical range. Deletes the sorted set if all members were removed.
// ZREMRANGEBYRANK - Removes members in a sorted set within a range of indexes. Deletes the sorted set if all members were removed.
// ZREMRANGEBYSCORE - Removes members in a sorted set within a range of scores. Deletes the sorted set if all members were removed.
// ZREVRANGE - Returns members in a sorted set within a range of indexes in reverse order.
// ZREVRANGEBYLEX - Returns members in a sorted set within a lexicographical range in reverse order.
// ZREVRANGEBYSCORE - Returns members in a sorted set within a range of scores in reverse order.
// ZREVRANK - Returns the index of a member in a sorted set ordered by descending scores.
// ZSCAN - Iterates over members and scores of a sorted set.
// ZSCORE - Returns the score of a member in a sorted set.
// ZUNION - Returns the union of multiple sorted sets.
// ZUNIONSTORE - Stores the union of multiple sorted sets in a key.

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisSortedSetShape = {
  zAdd: Effectify<RedisClientType["zAdd"]>;
  zCard: Effectify<RedisClientType["zCard"]>;
  zCount: Effectify<RedisClientType["zCount"]>;
  zDiff: Effectify<RedisClientType["zDiff"]>;
  zDiffStore: Effectify<RedisClientType["zDiffStore"]>;
  zIncrBy: Effectify<RedisClientType["zIncrBy"]>;
  zInter: Effectify<RedisClientType["zInter"]>;
  zInterCard: Effectify<RedisClientType["zInterCard"]>;
  zInterStore: Effectify<RedisClientType["zInterStore"]>;
  zLexCount: Effectify<RedisClientType["zLexCount"]>;
  zmPop: Effectify<RedisClientType["zmPop"]>;
  zmScore: Effectify<RedisClientType["zmScore"]>;
  zPopMax: Effectify<RedisClientType["zPopMax"]>;
  zPopMin: Effectify<RedisClientType["zPopMin"]>;
  zRandMember: Effectify<RedisClientType["zRandMember"]>;
  zRange: Effectify<RedisClientType["zRange"]>;
  zRangeByLex: Effectify<RedisClientType["zRangeByLex"]>;
  zRangeByScore: Effectify<RedisClientType["zRangeByScore"]>;
  zRangeStore: Effectify<RedisClientType["zRangeStore"]>;
  zRank: Effectify<RedisClientType["zRank"]>;
  zRem: Effectify<RedisClientType["zRem"]>;
  zRemRangeByLex: Effectify<RedisClientType["zRemRangeByLex"]>;
  zRemRangeByRank: Effectify<RedisClientType["zRemRangeByRank"]>;
  zRemRangeByScore: Effectify<RedisClientType["zRemRangeByScore"]>;
  //   zRevRange: Effectify<RedisClientType["zRevRange"]>; // TODO: Not Supported
  //   zRevRangeByLex: Effectify<RedisClientType["zRevRangeByLex"]>; // TODO: Not Supported
  //   zRevRangeByScore: Effectify<RedisClientType["zRevRangeByScore"]>; // TODO: Not Supported
  zRevRank: Effectify<RedisClientType["zRevRank"]>;
  zScan: Effectify<RedisClientType["zScan"]>;
  zScore: Effectify<RedisClientType["zScore"]>;
  zUnion: Effectify<RedisClientType["zUnion"]>;
  zUnionStore: Effectify<RedisClientType["zUnionStore"]>;
};

export const makeRedisSortedSet = (
  c: RedisClientType,
): RedisSortedSetShape => ({
  zAdd: effectify(c.zAdd.bind(c)),
  zCard: effectify(c.zCard.bind(c)),
  zCount: effectify(c.zCount.bind(c)),
  zDiff: effectify(c.zDiff.bind(c)),
  zDiffStore: effectify(c.zDiffStore.bind(c)),
  zIncrBy: effectify(c.zIncrBy.bind(c)),
  zInter: effectify(c.zInter.bind(c)),
  zInterCard: effectify(c.zInterCard.bind(c)),
  zInterStore: effectify(c.zInterStore.bind(c)),
  zLexCount: effectify(c.zLexCount.bind(c)),
  zmPop: effectify(c.zmPop.bind(c)),
  zmScore: effectify(c.zmScore.bind(c)),
  zPopMax: effectify(c.zPopMax.bind(c)),
  zPopMin: effectify(c.zPopMin.bind(c)),
  zRandMember: effectify(c.zRandMember.bind(c)),
  zRange: effectify(c.zRange.bind(c)),
  zRangeByLex: effectify(c.zRangeByLex.bind(c)),
  zRangeByScore: effectify(c.zRangeByScore.bind(c)),
  zRangeStore: effectify(c.zRangeStore.bind(c)),
  zRank: effectify(c.zRank.bind(c)),
  zRem: effectify(c.zRem.bind(c)),
  zRemRangeByLex: effectify(c.zRemRangeByLex.bind(c)),
  zRemRangeByRank: effectify(c.zRemRangeByRank.bind(c)),
  zRemRangeByScore: effectify(c.zRemRangeByScore.bind(c)),
  //   zRevRange: effectify(c.zRevRange.bind(c)), // TODO: Not Supported
  //   zRevRangeByLex: effectify(c.zRevRangeByLex.bind(c)), // TODO: Not Supported
  //   zRevRangeByScore: effectify(c.zRevRangeByScore.bind(c)), // TODO: Not Supported
  zRevRank: effectify(c.zRevRank.bind(c)),
  zScan: effectify(c.zScan.bind(c)),
  zScore: effectify(c.zScore.bind(c)),
  zUnion: effectify(c.zUnion.bind(c)),
  zUnionStore: effectify(c.zUnionStore.bind(c)),
});
