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

export const Unauthorized = Schema.Struct({
  error: Schema.Literal("Unauthorized"),
  message: Schema.String,
});

export const PaymentRequired = Schema.Struct({
  error: Schema.Literal("PaymentRequired"),
  message: Schema.String,
});

export const RpcError = Schema.Struct({
  error: Schema.Literal("RpcError"),
  message: Schema.String,
});
