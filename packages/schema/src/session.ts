/** biome-ignore-all assist/source/useSortedKeys: safe */
import { Schema } from "effect";

import { AddressSchema } from "./common";

export const AppSessionSchema = Schema.Struct({
  // App Session Id
  id: Schema.String,
  // User Address
  ownerAddress: AddressSchema,
  // Asset (ytest.usd, eth, usdc, etc)
  asset: Schema.String,
  // Admin Balance
  adminBalance: Schema.NumberFromString,
  // User Balance
  userBalance: Schema.NumberFromString,
  // Pending Settlements
  pendingSettlement: Schema.NumberFromString,
  // Session Status ()
  status: Schema.Literal("open", "closed", "challenged", "inactive"),
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
