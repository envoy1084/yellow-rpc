import { FetchHttpClient } from "@effect/platform";
import { ConfigProvider, Layer, ManagedRuntime } from "effect";

import { YellowRpcHttpClientLive } from "@/layers";

const EnvProvider = Layer.setConfigProvider(
  ConfigProvider.fromJson(import.meta.env),
);

const MainLayerLive = Layer.mergeAll(YellowRpcHttpClientLive).pipe(
  Layer.provideMerge(FetchHttpClient.layer),
  Layer.provide(EnvProvider),
);

export const RuntimeClient = ManagedRuntime.make(MainLayerLive);
