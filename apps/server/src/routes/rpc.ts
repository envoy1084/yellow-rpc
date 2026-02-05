import {
  HttpApiBuilder,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { api, JsonRpcResponse } from "@yellow-rpc/api";
import { Effect, Redacted, Schema } from "effect";

import { Env } from "@/env";
import { getAlchemyUrl } from "@/helpers";

export const RpcLive = HttpApiBuilder.group(api, "rpc", (handlers) =>
  handlers.handle("execute", ({ payload }) =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      const env = yield* Env;

      // Step 1: Charge the user
      // TODO: Implement this

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
      }).pipe(
        Effect.catchAll((e) =>
          Effect.succeed({
            error: "RpcError",
            message: e.toString(),
          }),
        ),
      );

      return Schema.decodeUnknownSync(JsonRpcResponse)(res);
    }),
  ),
);

export const RpcTest = RpcLive;
