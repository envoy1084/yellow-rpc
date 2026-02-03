import { Schema } from "effect";
import { DateFromString } from "effect/Schema";

export const UserSchema = Schema.Struct({
  createdAt: DateFromString,
  id: Schema.String,
  updatedAt: DateFromString,
  walletAddress: Schema.String.pipe(
    Schema.pattern(/^0x[a-fA-F0-9]{40}$/),
  ).annotations({
    message: () => "Invalid wallet address",
  }),
});

export type User = typeof UserSchema.Type;
