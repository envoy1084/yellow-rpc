import { HttpApiBuilder } from "@effect/platform";
import { api } from "@yellow-rpc/api";

import { createApiKeyHandler } from "./create";
import { deleteApiKeyHandler } from "./delete";
import { listApiKeysHandler } from "./list";

export const ApiKeyLive = HttpApiBuilder.group(api, "apiKey", (handlers) =>
  handlers
    .handle("create", ({ payload }) => createApiKeyHandler(payload))
    .handle("listApiKeys", ({ payload }) => listApiKeysHandler(payload))
    .handle("delete", ({ payload }) => deleteApiKeyHandler(payload)),
);

export const ApiKeyTest = ApiKeyLive;
