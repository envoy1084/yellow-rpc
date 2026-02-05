import { HttpApiBuilder } from "@effect/platform";
import { api } from "@yellow-rpc/api";

import { activateKeyHandler } from "./activate";
import { listApiKeysHandler } from "./list";
import { prepareApiKeyHandler } from "./prepare";

export const ApiKeyLive = HttpApiBuilder.group(api, "apiKey", (handlers) =>
  handlers
    .handle("prepareApiKey", ({ payload }) => prepareApiKeyHandler(payload))
    .handle("activateApiKey", ({ payload }) => activateKeyHandler(payload))
    .handle("listApiKeys", ({ payload }) => listApiKeysHandler(payload)),
);

export const ApiKeyTest = ApiKeyLive;
