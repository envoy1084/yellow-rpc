import { FetchHttpClient } from "@effect/platform";
import { AtomHttpApi } from "@effect-atom/atom-react";
import { api } from "@yellow-rpc/api";

export class YellowRpcClient extends AtomHttpApi.Tag<YellowRpcClient>()(
  "YellowRpcClient",
  {
    api: api,
    baseUrl: import.meta.env.VITE_YELLOW_RPC_BASE_URL,
    httpClient: FetchHttpClient.layer,
  },
) {}
