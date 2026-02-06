/** biome-ignore-all assist/source/useSortedKeys:safe */
import { Schema } from "effect";
import { DateFromString } from "effect/Schema";

import { AddressSchema } from "./common";

export const SupportedChainSchema = Schema.Union(
  Schema.Literal("ethereum"),
  Schema.Literal("base"),
  Schema.Literal("optimism"),
);

export type SupportedChain = typeof SupportedChainSchema.Type;

export const ApiKeySchema = Schema.Struct({
  // Identifiers
  id: Schema.String,
  ownerAddress: AddressSchema,
  // App Session to charge for this Key
  appSessionId: Schema.String,
  // Hashed Key
  hashedKey: Schema.String,
  // Masked Key to show in frontend
  maskedKey: Schema.String,
  // Configuration for the Key
  name: Schema.NonEmptyString.annotations({
    message: () => "Name is Required",
  }),
  chain: SupportedChainSchema.annotations({
    message: () => "Chain is Required",
  }),
  // Key Status
  status: Schema.Literal("active", "expired"),
  // Timestamps
  createdAt: DateFromString,
  updatedAt: DateFromString,
  lastUsedAt: DateFromString,
  // ExpiresAt timestamp
  expiresAt: DateFromString.pipe(
    Schema.greaterThanDate(new Date(), {
      message: () => "Expiry Date must be greater than current date",
    }),
  ),
});

export type ApiKey = typeof ApiKeySchema.Type;

export const CreateApiKeyRequestSchema = ApiKeySchema.pick(
  "chain",
  "name",
  "expiresAt",
);

export type CreateApiKeyRequest = typeof CreateApiKeyRequestSchema.Type;
