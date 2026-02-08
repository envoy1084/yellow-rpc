import { createTsdownConfig } from "@yellow-rpc/config/tsdown";

export default createTsdownConfig({
  entry: {
    apiKey: "src/api-key/index.ts",
    helpers: "src/helpers/index.ts",
    session: "src/session/index.ts",
  },
});
