import { Schema } from "effect";
import { DateFromString } from "effect/Schema";

export const SupportedChainSchema = Schema.Union(
  Schema.Literal("ethereum"),
  Schema.Literal("base"),
  Schema.Literal("optimism"),
);

export type SupportedChain = typeof SupportedChainSchema.Type;

export const ApiKeySchema = Schema.Struct({
  // Reference to the App Session created for this API Key
  appSessionId: Schema.optional(Schema.String),
  // Chain the API Key is for
  chain: SupportedChainSchema.annotations({
    message: () => "Chain is Required",
  }),
  // CreatedAt timestamp
  createdAt: DateFromString,
  // ExpiresAt timestamp
  expiresAt: DateFromString.pipe(
    Schema.greaterThanDate(new Date(), {
      message: () => "Expiry Date must be greater than current date",
    }),
  ),
  // Primary Key
  id: Schema.String,
  // The hashed key
  key: Schema.String,
  // Name for the API Key
  name: Schema.NonEmptyString.annotations({
    message: () => "Name is Required",
  }),
  // Reference to Owner
  ownerAddress: Schema.String,
  // Start characters to show in frontend
  start: Schema.String,
  // Status of the API Key
  status: Schema.Literal("active", "expired", "inactive"),
  // UpdatedAt timestamp
  updatedAt: DateFromString,
});

export type ApiKey = typeof ApiKeySchema.Type;

export const CreateApiKeyRequestSchema = ApiKeySchema.pick(
  "chain",
  "name",
  "expiresAt",
);

export type CreateApiKeyRequest = typeof CreateApiKeyRequestSchema.Type;
