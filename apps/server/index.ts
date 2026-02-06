/** biome-ignore-all lint/nursery/noUndeclaredEnvVars: safe */
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http("http://localhost:8080/rpc", {
    fetchOptions: {
      headers: {
        "x-api-key": process.env.API_KEY as string,
      },
    },
  }),
});

const res = await client.getBalance({
  address: "0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6",
});

console.log(res);
