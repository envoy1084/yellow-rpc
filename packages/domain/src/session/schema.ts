import { Schema } from "effect";

export const SupportedChainSchema = Schema.Union(
  Schema.Literal("ethereum"),
  Schema.Literal("sepolia"),
  Schema.Literal("base_sepolia"),
  Schema.Literal("base"),
);

export type SupportedChain = typeof SupportedChainSchema.Type;

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
  // User Balance
  userBalance: Schema.Number,
});

export type AppSession = typeof AppSessionSchema.Type;
