import { ApiKeySchema, CreateApiKeyRequestSchema } from "@yellow-rpc/schema";
import { Schema } from "effect";

export const PrepareApiKeyRequestSchema = CreateApiKeyRequestSchema.pipe(
  Schema.extend(
    Schema.Struct({
      initialBalance: Schema.NumberFromString.annotations({
        message: () => "Initial Balance is Required",
      }).pipe(
        Schema.greaterThan(0, {
          message: () => "Initial Balance must be greater than 0",
        }),
      ),
      walletAddress: Schema.String.annotations({
        message: () => "Wallet Address is Required",
      }),
    }),
  ),
);

export const PrepareApiKeyResponseSchema = Schema.Struct({
  apiKeyId: Schema.String,
  authParams: Schema.String,
});

export const ActivateApiKeyRequestSchema = Schema.Struct({
  apiKeyId: Schema.String,
  signature: Schema.String,
  walletAddress: Schema.String,
});

export const ActivateApiKeyResponseSchema = Schema.Struct({
  apiKey: Schema.String,
});

export const ListApiKeysRequestSchema = Schema.Struct({
  walletAddress: Schema.String,
});
export const ListApiKeysResponseSchema = Schema.Array(ApiKeySchema);

export type PrepareApiKeyRequest = typeof PrepareApiKeyRequestSchema.Type;
export type PrepareApiKeyRequestEncoded =
  typeof PrepareApiKeyRequestSchema.Encoded;
export type PrepareApiKeyResponse = typeof PrepareApiKeyResponseSchema.Type;

export type ActivateApiKeyResponse = typeof ActivateApiKeyResponseSchema.Type;
export type ActivateApiKeyRequest = typeof ActivateApiKeyRequestSchema.Type;

export type ListApiKeysRequest = typeof ListApiKeysRequestSchema.Type;
export type ListApiKeysResponse = typeof ListApiKeysResponseSchema.Type;
