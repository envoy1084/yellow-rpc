/** biome-ignore-all assist/source/useSortedKeys: safe */
import { Schema } from "effect";

import { AddressSchema, BigIntFromString, HexSchema } from "./common";

export const AppSessionSchema = Schema.Struct({
  // Unique Identifier for the App Session
  id: Schema.String,
  // App Session Id
  appSessionId: HexSchema,
  // User Address
  ownerAddress: AddressSchema,
  // Asset (ytest.usd, eth, usdc, etc)
  asset: Schema.String,
  // Admin Balance in atomic units
  adminBalance: BigIntFromString,
  // User Balance in atomic units
  userBalance: BigIntFromString,
  // Pending Settlement in atomic units
  pendingSettlement: BigIntFromString,
  // Session Status ()
  status: Schema.Literal(
    "open",
    "closed",
    "challenged",
    "resizing",
    "inactive",
    "invalid",
  ),
  // App Session Version to track updates
  version: Schema.NumberFromString,
  // Session Keys for Operations
  userSessionKey: AddressSchema,
  userEncSessionPrivateKey: Schema.String,
  adminSessionKey: AddressSchema,
  adminEncSessionPrivateKey: Schema.String,
  // JWT for Admin Re-authentication
  encAdminJwt: Schema.String,
  // Timestamps
  createdAt: Schema.DateFromString,
  updatedAt: Schema.DateFromString,
  // Session Keys may expire, we can rotate those when needed
  expiresAt: Schema.DateFromString,
});

export type AppSession = typeof AppSessionSchema.Type;
export type AppSessionE = typeof AppSessionSchema.Encoded;
