import { Schema } from "effect";

export const UserSchema = Schema.Struct({
  apiKeys: Schema.Array(Schema.String),
  createdAt: Schema.Date,
  id: Schema.String,
  updatedAt: Schema.Date,
  walletAddress: Schema.String.pipe(
    Schema.pattern(/^0x[a-fA-F0-9]{40}$/),
  ).annotations({
    message: () => "Invalid wallet address",
  }),
});

export type User = typeof UserSchema.Type;
