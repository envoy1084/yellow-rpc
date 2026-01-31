import { Schema } from "effect";

export const SupportedChainSchema = Schema.Union(
  Schema.Literal("ethereum"),
  Schema.Literal("sepolia"),
  Schema.Literal("base_sepolia"),
  Schema.Literal("base"),
);

export type SupportedChain = typeof SupportedChainSchema.Type;

export const ApiKeySchema = Schema.Struct({
  // Chain the API Key is for
  chain: SupportedChainSchema,
  // Reference to the channel created for this API Key
  channelId: Schema.String,
  // CreatedAt timestamp
  createdAt: Schema.DateFromString,
  // Primary Key
  id: Schema.String,
  // The hashed key
  key: Schema.String,
  // Name for the API Key
  name: Schema.String,
  // Start characters to show in frontend
  start: Schema.String,
  // UpdatedAt timestamp
  updatedAt: Schema.DateFromString,
  // Reference to Owner
  userId: Schema.String,
});

export type ApiKey = typeof ApiKeySchema.Type;
