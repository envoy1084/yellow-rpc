import { HttpApiBuilder } from "@effect/platform";
import { api } from "@yellow-rpc/api";

import { activateAppSessionHandler } from "./activate";
import { getAppSessionHandler } from "./get";
import { prepareAppSessionHandler } from "./prepare";

export const SessionLive = HttpApiBuilder.group(api, "session", (handlers) =>
  handlers
    .handle("prepare", ({ payload }) => prepareAppSessionHandler(payload))
    .handle("activate", ({ payload }) => activateAppSessionHandler(payload))
    .handle("getSession", ({ payload }) => getAppSessionHandler(payload)),
);
