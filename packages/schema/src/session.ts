import { Schema } from "effect";

export const AppSessionSchema = Schema.Struct({
  // Admin Balance
  adminBalance: Schema.Number,
  // Asset
  asset: Schema.String,
  // Timestamps
  createdAt: Schema.DateFromString,
  // App Session Id
  id: Schema.String,
  // Pending Settlements
  pendingSettlement: Schema.Number,
  // Hashed Session Private Key
  sessionPrivateKey: Schema.String,
  // Session Public Key
  sessionPublicKey: Schema.String,
  // status
  status: Schema.Literal("open", "closed", "challenged", "inactive"),
  updatedAt: Schema.DateFromString,
  // User Balance
  userBalance: Schema.Number,
  version: Schema.Number,
});

export type AppSession = typeof AppSessionSchema.Type;
