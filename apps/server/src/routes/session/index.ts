import { HttpApiBuilder } from "@effect/platform";
import { api } from "@yellow-rpc/api";

import { activateAppSessionHandler } from "./activate";
import { depositFundsHandler } from "./deposit";
import { getAppSessionHandler } from "./get";
import { prepareAppSessionHandler } from "./prepare";
import { withdrawFundsHandler } from "./withdraw";

export const SessionLive = HttpApiBuilder.group(api, "session", (handlers) =>
  handlers
    .handle("prepare", ({ payload }) => prepareAppSessionHandler(payload))
    .handle("activate", ({ payload }) => activateAppSessionHandler(payload))
    .handle("getSession", ({ payload }) => getAppSessionHandler(payload))
    .handle("deposit", ({ payload }) => depositFundsHandler(payload))
    .handle("withdraw", ({ payload }) => withdrawFundsHandler(payload)),
);
