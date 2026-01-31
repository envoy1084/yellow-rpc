// Bitmap Commands
//
// BITCOUNT - Counts the number of set bits (population counting) in a string.
// BITFIELD - Performs arbitrary bitfield integer operations on strings.
// BITFIELD_RO - Performs arbitrary read-only bitfield integer operations on strings.
// BITOP - Performs bitwise operations on multiple strings, and stores the result.
// BITPOS - Finds the first set (1) or clear (0) bit in a string.
// GETBIT - Returns a bit value by offset.
// SETBIT - Sets or clears the bit at offset of the string value. Creates the key if it doesn't exist.

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisBitmapShape = {
  bitCount: Effectify<RedisClientType["bitCount"]>;
  bitField: Effectify<RedisClientType["bitField"]>;
  bitFieldRo: Effectify<RedisClientType["bitFieldRo"]>;
  bitOp: Effectify<RedisClientType["bitOp"]>;
  bitPos: Effectify<RedisClientType["bitPos"]>;
  getBit: Effectify<RedisClientType["getBit"]>;
  setBit: Effectify<RedisClientType["setBit"]>;
};

export const makeRedisBitmap = (c: RedisClientType): RedisBitmapShape => ({
  bitCount: effectify(c.bitCount),
  bitField: effectify(c.bitField),
  bitFieldRo: effectify(c.bitFieldRo),
  bitOp: effectify(c.bitOp),
  bitPos: effectify(c.bitPos),
  getBit: effectify(c.getBit),
  setBit: effectify(c.setBit),
});
