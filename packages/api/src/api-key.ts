import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";

import {
  ActivateApiKeyRequestSchema,
  ActivateApiKeyResponseSchema,
  ListApiKeysRequestSchema,
  ListApiKeysResponseSchema,
  PrepareApiKeyRequestSchema,
  PrepareApiKeyResponseSchema,
} from "./dto";

export const apiKeysGroup = HttpApiGroup.make("apiKey")
  .add(
    HttpApiEndpoint.post("prepareApiKey", "/api-key/prepare")
      .setPayload(PrepareApiKeyRequestSchema)
      .addSuccess(PrepareApiKeyResponseSchema),
  )
  .add(
    HttpApiEndpoint.post("activateApiKey", "/api-key/activate")
      .setPayload(ActivateApiKeyRequestSchema)
      .addSuccess(ActivateApiKeyResponseSchema),
  )
  .add(
    HttpApiEndpoint.post("listApiKeys", "/api-key/list")
      .setPayload(ListApiKeysRequestSchema)
      .addSuccess(ListApiKeysResponseSchema),
  );
