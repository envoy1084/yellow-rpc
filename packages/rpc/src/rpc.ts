import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";

const AssetSchema = Schema.Struct({
  // chain_id: Schema.Number,
  decimals: Schema.Number,
  symbol: Schema.String,
  token: Schema.String,
});

export class NitroRpc extends RpcGroup.make(
  Rpc.make("get_assets", {
    payload: {
      chainId: Schema.optional(Schema.Number),
    },
    success: Schema.Struct({
      assets: Schema.Array(AssetSchema),
    }),
  }),
) {}
