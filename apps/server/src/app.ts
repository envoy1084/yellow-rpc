import { Layer } from "effect";

import { EnvLive, EnvTest } from "./env";
import { HttpLive } from "./router";

export const YellowRpcLive = HttpLive.pipe(Layer.provideMerge(EnvLive));
export const YellowRpcTest = HttpLive.pipe(Layer.provideMerge(EnvTest));
