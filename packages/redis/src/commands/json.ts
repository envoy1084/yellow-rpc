// JSON Commands
//
// JSON.ARRAPPEND - Append one or more JSON values into the array at path after the last element in it.
// JSON.ARRINDEX - Returns the index of the first occurrence of a JSON scalar value in the array at path
// JSON.ARRINSERT - Inserts the JSON scalar(s) value at the specified index in the array at path
// JSON.ARRLEN - Returns the length of the array at path
// JSON.ARRPOP - Removes and returns the element at the specified index in the array at path
// JSON.ARRTRIM - Trims the array at path to contain only the specified inclusive range of indices from start to stop
// JSON.CLEAR - Clears all values from an array or an object and sets numeric values to `0`
// JSON.DEBUG - Debugging container command // TODO: Not Supported
// JSON.DEBUG MEMORY - Reports the size in bytes of a key
// JSON.DEL - Deletes a value
// JSON.FORGET - Deletes a value
// JSON.GET - Gets the value at one or more paths in JSON serialized form
// JSON.MERGE - Merges a given JSON value into matching paths. Consequently, JSON values at matching paths are updated, deleted, or expanded with new children
// JSON.MGET - Returns the values at a path from one or more keys
// JSON.MSET - Sets or updates the JSON value of one or more keys
// JSON.NUMINCRBY - Increments the numeric value at path by a value
// JSON.NUMMULTBY - Multiplies the numeric value at path by a value
// JSON.OBJKEYS - Returns the JSON keys of the object at path
// JSON.OBJLEN - Returns the number of keys of the object at path
// JSON.RESP - Returns the JSON value at path in Redis Serialization Protocol (RESP) // TODO: Not Supported
// JSON.SET - Sets or updates the JSON value at a path
// JSON.STRAPPEND - Appends a string to a JSON string value at path
// JSON.STRLEN - Returns the length of the JSON String at path in key
// JSON.TOGGLE - Toggles a boolean value
// JSON.TYPE - Returns the type of the JSON value at path

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisJsonShape = {
  arrAppend: Effectify<RedisClientType["json"]["arrAppend"]>;
  arrIndex: Effectify<RedisClientType["json"]["arrIndex"]>;
  arrInsert: Effectify<RedisClientType["json"]["arrInsert"]>;
  arrLen: Effectify<RedisClientType["json"]["arrLen"]>;
  arrPop: Effectify<RedisClientType["json"]["arrPop"]>;
  arrTrim: Effectify<RedisClientType["json"]["arrTrim"]>;
  clear: Effectify<RedisClientType["json"]["clear"]>;
  //   debug: Effectify<RedisClientType["json"]["debug"]>; // TODO: Not Supported
  debugMemory: Effectify<RedisClientType["json"]["debugMemory"]>;
  del: Effectify<RedisClientType["json"]["del"]>;
  forget: Effectify<RedisClientType["json"]["forget"]>;
  get: Effectify<RedisClientType["json"]["get"]>;
  merge: Effectify<RedisClientType["json"]["merge"]>;
  mGet: Effectify<RedisClientType["json"]["mGet"]>;
  mSet: Effectify<RedisClientType["json"]["mSet"]>;
  numIncrBy: Effectify<RedisClientType["json"]["numIncrBy"]>;
  numMultBy: Effectify<RedisClientType["json"]["numMultBy"]>;
  objKeys: Effectify<RedisClientType["json"]["objKeys"]>;
  objLen: Effectify<RedisClientType["json"]["objLen"]>;
  //   resp: Effectify<RedisClientType["json"]["resp"]>; // TODO: Not Supported
  set: Effectify<RedisClientType["json"]["set"]>;
  strAppend: Effectify<RedisClientType["json"]["strAppend"]>;
  strLen: Effectify<RedisClientType["json"]["strLen"]>;
  toggle: Effectify<RedisClientType["json"]["toggle"]>;
  type: Effectify<RedisClientType["json"]["type"]>;
};

export const makeRedisJson = (c: RedisClientType): RedisJsonShape => ({
  arrAppend: effectify(c.json.arrAppend.bind(c)),
  arrIndex: effectify(c.json.arrIndex.bind(c)),
  arrInsert: effectify(c.json.arrInsert.bind(c)),
  arrLen: effectify(c.json.arrLen.bind(c)),
  arrPop: effectify(c.json.arrPop.bind(c)),
  arrTrim: effectify(c.json.arrTrim.bind(c)),
  clear: effectify(c.json.clear.bind(c)),
  //   debug: effectify(c.json.debug.bind(c)), // TODO: Not Supported
  debugMemory: effectify(c.json.debugMemory.bind(c)),
  del: effectify(c.json.del.bind(c)),
  forget: effectify(c.json.forget.bind(c)),
  get: effectify(c.json.get.bind(c)),
  merge: effectify(c.json.merge.bind(c)),
  mGet: effectify(c.json.mGet.bind(c)),
  mSet: effectify(c.json.mSet.bind(c)),
  numIncrBy: effectify(c.json.numIncrBy.bind(c)),
  numMultBy: effectify(c.json.numMultBy.bind(c)),
  objKeys: effectify(c.json.objKeys.bind(c)),
  objLen: effectify(c.json.objLen.bind(c)),
  //   resp: effectify(c.json.resp.bind(c)), // TODO: Not Supported
  set: effectify(c.json.set.bind(c)),
  strAppend: effectify(c.json.strAppend.bind(c)),
  strLen: effectify(c.json.strLen.bind(c)),
  toggle: effectify(c.json.toggle.bind(c)),
  type: effectify(c.json.type.bind(c)),
});
