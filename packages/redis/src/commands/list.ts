// List commands operate on lists of strings, ordered by insertion order.

// BLMOVE - Pops an element from a list, pushes it to another list and returns it. Blocks until an element is available otherwise. Deletes the list if the last element was moved.
// BLMPOP - Pops the first element from one of multiple lists. Blocks until an element is available otherwise. Deletes the list if the last element was popped.
// BLPOP - Removes and returns the first element in a list. Blocks until an element is available otherwise. Deletes the list if the last element was popped.
// BRPOP - Removes and returns the last element in a list. Blocks until an element is available otherwise. Deletes the list if the last element was popped.
// BRPOPLPUSH - Pops an element from a list, pushes it to another list and returns it. Block until an element is available otherwise. Deletes the list if the last element was popped.
// LINDEX - Returns an element from a list by its index.
// LINSERT - Inserts an element before or after another element in a list.
// LLEN - Returns the length of a list.
// LMOVE - Returns an element after popping it from one list and pushing it to another. Deletes the list if the last element was moved.
// LMPOP - Returns multiple elements from a list after removing them. Deletes the list if the last element was popped.
// LPOP - Returns the first elements in a list after removing it. Deletes the list if the last element was popped.
// LPOS - Returns the index of matching elements in a list.
// LPUSH - Prepends one or more elements to a list. Creates the key if it doesn't exist.
// LPUSHX - Prepends one or more elements to a list only when the list exists.
// LRANGE - Returns a range of elements from a list.
// LREM - Removes elements from a list. Deletes the list if the last element was removed.
// LSET - Sets the value of an element in a list by its index.
// LTRIM - Removes elements from both ends a list. Deletes the list if all elements were trimmed.
// RPOP - Returns and removes the last elements of a list. Deletes the list if the last element was popped.
// RPOPLPUSH - Returns the last element of a list after removing and pushing it to another list. Deletes the list if the last element was popped.
// RPUSH - Appends one or more elements to a list. Creates the key if it doesn't exist.
// RPUSHX - Appends an element to a list only when the list exists.

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisListShape = {
  blMove: Effectify<RedisClientType["blMove"]>;
  blmPop: Effectify<RedisClientType["blmPop"]>;
  blPop: Effectify<RedisClientType["blPop"]>;
  brPop: Effectify<RedisClientType["brPop"]>;
  brPopLPush: Effectify<RedisClientType["brPopLPush"]>;
  lIndex: Effectify<RedisClientType["lIndex"]>;
  lInsert: Effectify<RedisClientType["lInsert"]>;
  lLen: Effectify<RedisClientType["lLen"]>;
  lMove: Effectify<RedisClientType["lMove"]>;
  lPop: Effectify<RedisClientType["lPop"]>;
  lPos: Effectify<RedisClientType["lPos"]>;
  lPush: Effectify<RedisClientType["lPush"]>;
  lPushX: Effectify<RedisClientType["lPushX"]>;
  lRange: Effectify<RedisClientType["lRange"]>;
  lRem: Effectify<RedisClientType["lRem"]>;
  lSet: Effectify<RedisClientType["lSet"]>;
  lTrim: Effectify<RedisClientType["lTrim"]>;
  rPop: Effectify<RedisClientType["rPop"]>;
  rPopLPush: Effectify<RedisClientType["rPopLPush"]>;
  rPush: Effectify<RedisClientType["rPush"]>;
  rPushX: Effectify<RedisClientType["rPushX"]>;
};

export const makeRedisList = (c: RedisClientType): RedisListShape => ({
  blMove: effectify(c.blMove.bind(c)),
  blmPop: effectify(c.blmPop.bind(c)),
  blPop: effectify(c.blPop.bind(c)),
  brPop: effectify(c.brPop.bind(c)),
  brPopLPush: effectify(c.brPopLPush.bind(c)),
  lIndex: effectify(c.lIndex.bind(c)),
  lInsert: effectify(c.lInsert.bind(c)),
  lLen: effectify(c.lLen.bind(c)),
  lMove: effectify(c.lMove.bind(c)),
  lPop: effectify(c.lPop.bind(c)),
  lPos: effectify(c.lPos.bind(c)),
  lPush: effectify(c.lPush.bind(c)),
  lPushX: effectify(c.lPushX.bind(c)),
  lRange: effectify(c.lRange.bind(c)),
  lRem: effectify(c.lRem.bind(c)),
  lSet: effectify(c.lSet.bind(c)),
  lTrim: effectify(c.lTrim.bind(c)),
  rPop: effectify(c.rPop.bind(c)),
  rPopLPush: effectify(c.rPopLPush.bind(c)),
  rPush: effectify(c.rPush.bind(c)),
  rPushX: effectify(c.rPushX.bind(c)),
});
