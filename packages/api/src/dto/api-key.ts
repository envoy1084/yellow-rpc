import { CreateApiKeyRequestSchema } from "@yellow-rpc/schema";
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

export type PrepareApiKeyRequest = typeof PrepareApiKeyRequestSchema.Type;
export type PrepareApiKeyRequestEncoded =
  typeof PrepareApiKeyRequestSchema.Encoded;

export const PrepareApiKeyResponseSchema = Schema.Struct({
  apiKeyId: Schema.String,
  authMessage: Schema.String,
});

export type PrepareApiKeyResponse = typeof PrepareApiKeyResponseSchema.Type;
