import { HttpApi, OpenApi } from "@effect/platform";

import { apiKeysGroup } from "./api-key";
import { healthGroup } from "./health";

export const api = HttpApi.make("YellowRpcAPI")
  .add(healthGroup)
  .add(apiKeysGroup)
  .annotate(OpenApi.Title, "YellowRPC API")
  .annotate(OpenApi.Description, "YellowRPC API")
  .annotate(OpenApi.License, {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
  });

export * from "./dto";
