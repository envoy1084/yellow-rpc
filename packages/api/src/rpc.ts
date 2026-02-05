import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

import {
  InvalidApiKey,
  JsonRpcRequest,
  JsonRpcResponse,
  PaymentRequired,
  RpcError,
  Unauthorized,
} from "./dto/rpc";

export const rpcGroup = HttpApiGroup.make("rpc").add(
  HttpApiEndpoint.post("execute", "/rpc")
    .setHeaders(
      Schema.Struct({
        "x-api-key": Schema.String,
      }),
    )
    .setPayload(JsonRpcRequest)
    .addSuccess(JsonRpcResponse)
    .addError(Unauthorized, { status: 401 })
    .addError(PaymentRequired, { status: 402 })
    .addError(RpcError, { status: 500 })
    .addError(InvalidApiKey, { status: 400 }),
);
