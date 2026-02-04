import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";

import { PrepareApiKeyRequestSchema } from "./dto";

export const apiKeysGroup = HttpApiGroup.make("apiKeys").add(
  HttpApiEndpoint.post("prepareApiKey", "/api-key/prepare").setPayload(
    PrepareApiKeyRequestSchema,
  ),
);
