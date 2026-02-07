import { HttpApiBuilder } from "@effect/platform";
import { api } from "@yellow-rpc/api";

import { activateAppSessionHandler } from "./activate";
import { confirmDepositFundsMessageHandler } from "./confirm-deposit";
import { getAppSessionHandler } from "./get";
import { prepareAppSessionHandler } from "./prepare";
import { prepareDepositFundsHandler } from "./prepare-deposit";

export const SessionLive = HttpApiBuilder.group(api, "session", (handlers) =>
  handlers
    .handle("prepare", ({ payload }) => prepareAppSessionHandler(payload))
    .handle("activate", ({ payload }) => activateAppSessionHandler(payload))
    .handle("getSession", ({ payload }) => getAppSessionHandler(payload))
    .handle("prepareDeposit", ({ payload }) =>
      prepareDepositFundsHandler(payload),
    )
    .handle("confirmDeposit", ({ payload }) =>
      confirmDepositFundsMessageHandler(payload),
    ),
);
