import {
  HttpApiBuilder,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import {
  api,
  type JsonRpcRequest,
  JsonRpcResponse,
  RpcError,
} from "@yellow-rpc/api";
import { Effect, Redacted, Schema } from "effect";

import { Env } from "@/env";
import { getAlchemyUrl } from "@/helpers";
import { Settlement } from "@/layers";

const rpcHandler = (payload: JsonRpcRequest, apiKey: string) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const env = yield* Env;
    const settlement = yield* Settlement;

    // Step 1: Charge the user
    yield* settlement.chargeApiKey(apiKey);

    // Step 2: Proxy the request to the node
    const res = yield* Effect.gen(function* () {
      const url = getAlchemyUrl(
        "ethereum",
        Redacted.value(env.alchemyApiToken),
      );
      const upstreamRequest = yield* HttpClientRequest.post(url).pipe(
        HttpClientRequest.bodyJson(payload),
      );

      const response = yield* client.execute(upstreamRequest).pipe();
      const json = yield* response.json;

      return json;
    }).pipe(Effect.catchAll(() => Effect.fail(new RpcError())));

    return Schema.decodeUnknownSync(JsonRpcResponse)(res);
  });

export const RpcLive = HttpApiBuilder.group(api, "rpc", (handlers) =>
  handlers.handle("execute", ({ payload, headers }) =>
    rpcHandler(payload, headers["x-api-key"]),
  ),
);

export const RpcTest = RpcLive;
