import { FetchHttpClient } from "@effect/platform";
import { AtomHttpApi } from "@effect-atom/atom-react";
import { api } from "@yellow-rpc/api";

export class YellowRpcClient extends AtomHttpApi.Tag<YellowRpcClient>()(
  "YellowRpcClient",
  {
    api: api,
    baseUrl: "http://localhost:8080",
    httpClient: FetchHttpClient.layer,
  },
) {}
