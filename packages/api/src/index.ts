import { HttpApi, OpenApi } from "@effect/platform";

import { apiKeysGroup } from "./api-key";
import { healthGroup } from "./health";
import { rpcGroup } from "./rpc";
import { sessionGroup } from "./session";

export const api = HttpApi.make("YellowRpcAPI")
  .add(healthGroup)
  .add(apiKeysGroup)
  .add(rpcGroup)
  .add(sessionGroup)
  .annotate(OpenApi.Title, "YellowRPC API")
  .annotate(OpenApi.Description, "YellowRPC API")
  .annotate(OpenApi.License, {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
  });

export * from "./dto";
