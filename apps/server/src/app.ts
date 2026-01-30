import { DatabaseLive } from "@yellow-rpc/database";
import { Layer } from "effect";

import { EnvLive, EnvTest } from "./env";
import { HttpLive } from "./router";

export const YellowRpcLive = HttpLive.pipe(
  Layer.provideMerge(EnvLive),
  Layer.provideMerge(DatabaseLive),
);
export const YellowRpcTest = HttpLive.pipe(
  Layer.provideMerge(EnvTest),
  Layer.provideMerge(DatabaseLive),
);
