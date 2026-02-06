import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";

import {
  ApiKeyCreationFailed,
  AppSessionNotFound,
  CreateApiKeyRequestSchema,
  CreateApiKeyResponseSchema,
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
    HttpApiEndpoint.post("listApiKeys", "/api-key/list")
      .setPayload(ListApiKeysRequestSchema)
      .addSuccess(ListApiKeysResponseSchema),
  );
