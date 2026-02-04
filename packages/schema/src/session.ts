import { Schema } from "effect";

export const AppSessionSchema = Schema.Struct({
  // Admin Balance
  adminBalance: Schema.Number,
  // Asset Address
  assetAddress: Schema.String,
  // App Session Id
  id: Schema.String,
  // Pending Settlements
  pendingSettlements: Schema.Number,
  // Hashed Session Private Key
  sessionPrivateKey: Schema.String,
  // Session Public Key
  sessionPublicKey: Schema.String,
  // status
  status: Schema.Literal("open", "closed", "challenged"),
  // User Balance
  userBalance: Schema.Number,
});

export type AppSession = typeof AppSessionSchema.Type;
