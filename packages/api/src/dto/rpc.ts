import { Schema } from "effect";

export const JsonRpcRequest = Schema.Struct({
  id: Schema.Union(Schema.String, Schema.Number),
  jsonrpc: Schema.Literal("2.0"),
  method: Schema.String,
  params: Schema.optional(Schema.Unknown),
});

export const JsonRpcResponse = Schema.Struct({
  error: Schema.optional(Schema.Unknown),
  id: Schema.Union(Schema.String, Schema.Number),
  jsonrpc: Schema.Literal("2.0"),
  result: Schema.optional(Schema.Unknown),
});

export class InvalidApiKey extends Schema.TaggedError<InvalidApiKey>()(
  "InvalidApiKey",
  {},
) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  {},
) {}

export class PaymentRequired extends Schema.TaggedError<PaymentRequired>()(
  "PaymentRequired",
  {},
) {}

export class RpcError extends Schema.TaggedError<RpcError>()("RpcError", {}) {}

export type JsonRpcRequest = typeof JsonRpcRequest.Type;
export type JsonRpcResponse = typeof JsonRpcResponse.Type;
