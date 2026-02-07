import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";

import {
  ApiKeyCreationFailed,
  ApiKeyNotFound,
  AppSessionNotFound,
  CreateApiKeyRequestSchema,
  CreateApiKeyResponseSchema,
  DeleteApiKeyRequestSchema,
  DeleteApiKeyResponseSchema,
  ListApiKeysRequestSchema,
  ListApiKeysResponseSchema,
} from "./dto";

export const apiKeysGroup = HttpApiGroup.make("apiKey")
  .add(
    HttpApiEndpoint.post("create", "/api-key/create")
      .setPayload(CreateApiKeyRequestSchema)
      .addSuccess(CreateApiKeyResponseSchema)
      .addError(ApiKeyCreationFailed, { status: 500 })
      .addError(AppSessionNotFound, { status: 404 }),
  )
  .add(
    HttpApiEndpoint.del("delete", "/api-key/delete")
      .setPayload(DeleteApiKeyRequestSchema)
      .addSuccess(DeleteApiKeyResponseSchema)
      .addError(ApiKeyNotFound, { status: 404 }),
  )
  .add(
    HttpApiEndpoint.get("listApiKeys", "/api-key/list")
      .setPayload(ListApiKeysRequestSchema)
      .addSuccess(ListApiKeysResponseSchema),
  );
