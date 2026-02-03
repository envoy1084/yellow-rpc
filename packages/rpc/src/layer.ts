/** biome-ignore-all lint/style/useNamingConvention: <safe> */
import { type RpcMessage, RpcSerialization } from "@effect/rpc";
import { parseAnyRPCResponse, RPCMethod } from "@erc7824/nitrolite";
import { Layer, Schema } from "effect";

/**
 * Nitro Wire Format
 * Compact format: [requestId, method, params, timestamp]
 */
export const NitroWireFormat = Schema.Tuple(
  Schema.Union(Schema.Number, Schema.String),
  Schema.String,
  Schema.Any,
  Schema.Number,
);

export const NitroWireResponseFormat = Schema.Struct({
  res: NitroWireFormat,
  sig: Schema.Array(Schema.String),
});

export type NitroWireFormat = typeof NitroWireFormat.Type;
export type NitroWireResponseFormat = typeof NitroWireResponseFormat.Type;

const inflight = new Map<number, string>();

export const layerNitroRpc = Layer.succeed(
  RpcSerialization.RpcSerialization,
  RpcSerialization.RpcSerialization.of({
    contentType: "application/json",
    includesFraming: false,
    unsafeMake: () => {
      const decoder = new TextDecoder();
      return {
        decode: (data) => {
          const response =
            typeof data === "string" ? data : decoder.decode(data);

          const parsed = parseAnyRPCResponse(response);

          const nitroId = parsed.requestId;
          const method = parsed.method;

          if (nitroId == null || nitroId === 0) {
            return [];
          }

          const requestId = inflight.get(nitroId);
          if (!requestId) {
            return [];
          }

          if (method === RPCMethod.Error) {
            inflight.delete(nitroId);

            return [
              {
                _tag: "Exit",
                exit: {
                  _tag: "Failure",
                  cause: {
                    _tag: "Fail",
                    error: parsed.params.error,
                  },
                },
                requestId,
              } satisfies RpcMessage.FromServerEncoded,
            ];
          }

          inflight.delete(nitroId);
          return [
            {
              _tag: "Exit",
              exit: {
                _tag: "Success",
                value: parsed.params,
              },
              requestId,
            } satisfies RpcMessage.FromServerEncoded,
          ];
        },
        // Client -> Server
        encode: (res: unknown) => {
          const message = res as RpcMessage.FromClientEncoded;
          if (message._tag !== "Request") return;
          const nitroId = Math.floor(Math.random() * 1e9);
          const method = message.tag;
          const payload = message.payload;
          const data = [nitroId, method, payload, Date.now()];
          inflight.set(nitroId, message.id);
          const encoded = JSON.stringify({
            req: data,
            sig: [],
          });
          return encoded;
        },
      };
    },
  }),
);
