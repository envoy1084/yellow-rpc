/** biome-ignore-all lint/nursery/noUndeclaredEnvVars: safe */
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http("http://localhost:8080/rpc", {
    fetchOptions: {},
  }),
});

console.time("start");
const res = await client.getBalance({
  address: "0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6",
});
console.timeEnd("start");

console.time("start1");
const res2 = await client.getBalance({
  address: "0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6",
});
console.timeEnd("start1");

console.log(res);
console.log(res2);

// Yellow RPC
// - First Request: 350-400ms
// - Subsequent Requests: 100-120ms

// Alchemy
// - First Request: 280-300ms
// - Subsequent Requests: 90-100ms
