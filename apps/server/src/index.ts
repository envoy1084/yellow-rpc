import "dotenv/config";

import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";

import { YellowRpcLive } from "./app";

Layer.launch(YellowRpcLive).pipe(NodeRuntime.runMain);
