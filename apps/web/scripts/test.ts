/** biome-ignore-all lint/nursery/noUndeclaredEnvVars: safe */
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const yellowRpcClient = createPublicClient({
  chain: mainnet,
  transport: http("http://localhost:8080/rpc", {
    fetchOptions: {
      headers: {
        "x-api-key": process.env.YELLOW_API_KEY as string,
      },
    },
  }),
});

const alchemyClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ALCHEMY_RPC_URL as string),
});

// Benchmarks
console.time("start:yellow-first");
await yellowRpcClient.getBalance({
  address: "0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6",
});
console.timeEnd("start:yellow-first");

console.time("start:yellow-second");
await yellowRpcClient.getBalance({
  address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
});
console.timeEnd("start:yellow-second");

console.time("start:alchemy-first");
await alchemyClient.getBalance({
  address: "0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6",
});
console.timeEnd("start:alchemy-first");

console.time("start:alchemy-second");
await alchemyClient.getBalance({
  address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
});
console.timeEnd("start:alchemy-second");

// Yellow RPC
// - First Request: 300-350ms
// - Subsequent Requests: 90-120ms

// Alchemy
// - First Request: 280-300ms
// - Subsequent Requests: 90-100ms

// [333.55ms] start:yellow-first
// [108.51ms] start:yellow-second
// [281.67ms] start:alchemy-first
// [97.27ms] start:alchemy-second

// [305.24ms] start:yellow-first
// [102.07ms] start:yellow-second
// [289.68ms] start:alchemy-first
// [91.02ms] start:alchemy-second

// [317.12ms] start:yellow-first
// [103.05ms] start:yellow-second
// [277.15ms] start:alchemy-first
// [90.51ms] start:alchemy-second
