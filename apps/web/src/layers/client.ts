import { HttpApiClient } from "@effect/platform";
import { api } from "@yellow-rpc/api";
import { Config, Context, Effect, Layer } from "effect";

type YellowRpcHttpClientType = Effect.Effect.Success<ReturnType<typeof make>>;

const make = (baseUrl: string) => HttpApiClient.make(api, { baseUrl });

export class YellowRpcHttpClient extends Context.Tag("YellowRpcHttpClient")<
  YellowRpcHttpClient,
  YellowRpcHttpClientType
>() {}

export const YellowRpcHttpClientLive = Layer.effect(
  YellowRpcHttpClient,
  Effect.gen(function* () {
    const baseUrl = yield* Config.string("VITE_YELLOW_RPC_BASE_URL");
    console.log("Base URL: ", baseUrl);
    const client = yield* make(baseUrl);
    return YellowRpcHttpClient.of(client);
  }),
);
