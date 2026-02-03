import { NodeSocket } from "@effect/platform-node";
import { runMain } from "@effect/platform-node/NodeRuntime";
import { RpcClient } from "@effect/rpc";
import { Effect, Layer } from "effect";

import { layerNitroRpc } from "./layer";
import { NitroRpc } from "./rpc"; // Your RPC Group definitions

const protocol = RpcClient.layerProtocolSocket({
  retryTransientErrors: false,
}).pipe(
  Layer.provide(
    NodeSocket.layerWebSocket("wss://clearnet-sandbox.yellow.com/ws"),
  ),
  Layer.provide(layerNitroRpc),
);

const program = Effect.gen(function* () {
  const client = yield* RpcClient.make(NitroRpc);
  yield* Effect.log("Getting Assets...");
  const assets = yield* client.get_assets({});
  yield* Effect.log("Assets: ", assets);
});

program.pipe(Effect.provide(protocol), Effect.scoped, runMain);
