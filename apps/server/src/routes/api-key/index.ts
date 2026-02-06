import { HttpApiBuilder } from "@effect/platform";
import { api } from "@yellow-rpc/api";

import { createApiKeyHandler } from "./create";
import { listApiKeysHandler } from "./list";

export const ApiKeyLive = HttpApiBuilder.group(api, "apiKey", (handlers) =>
  handlers
    .handle("create", ({ payload }) => createApiKeyHandler(payload))
    .handle("listApiKeys", ({ payload }) => listApiKeysHandler(payload)),
);

export const ApiKeyTest = ApiKeyLive;
