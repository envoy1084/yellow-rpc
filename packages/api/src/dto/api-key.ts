import { ApiKeySchema } from "@yellow-rpc/schema";
import { Schema } from "effect";

export const ListApiKeysRequestSchema = Schema.Struct({
  walletAddress: Schema.String,
});
export const ListApiKeysResponseSchema = Schema.Array(ApiKeySchema);

export const CreateApiKeyRequestSchema = ApiKeySchema.pick(
  "chain",
  "expiresAt",
  "ownerAddress",
  "name",
);

export const CreateApiKeyResponseSchema = Schema.Struct({
  apiKey: Schema.String,
});
export type CreateApiKeyRequest = typeof CreateApiKeyRequestSchema.Type;
export type CreateApiKeyResponse = typeof CreateApiKeyResponseSchema.Type;
export type ListApiKeysRequest = typeof ListApiKeysRequestSchema.Type;
export type ListApiKeysResponse = typeof ListApiKeysResponseSchema.Type;

export class ApiKeyCreationFailed extends Schema.TaggedError<ApiKeyCreationFailed>()(
  "ApiKeyCreationFailed",
  {
    message: Schema.String,
  },
) {}
