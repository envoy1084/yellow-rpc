import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

import { ApiKeyNotFound } from "./dto";
import {
  InsufficientBalance,
  JsonRpcRequest,
  JsonRpcResponse,
  PaymentFailed,
  RpcError,
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
    .addError(ApiKeyNotFound, { status: 404 })
    .addError(RpcError, { status: 500 })
    .addError(InsufficientBalance, { status: 402 })
    .addError(PaymentFailed, { status: 400 }),
);
