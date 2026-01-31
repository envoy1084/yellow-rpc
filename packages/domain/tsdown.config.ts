import { createTsdownConfig } from "@yellow-rpc/config/tsdown";

export default createTsdownConfig({
  entry: {
    apiKey: ["./src/api-key/index.ts"],
    user: ["./src/user/index.ts"],
  },
});
