/** biome-ignore-all lint/nursery/noUndeclaredEnvVars: safe */
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const measureExecutionTime = async <T>(
  fn: () => Promise<T>,
): Promise<{ result: T; time: number }> => {
  const start = performance.now();
  const res = await fn();
  const end = performance.now();
  return { result: res, time: end - start };
};

const yellowRpcClient = createPublicClient({
  chain: mainnet,
  transport: http("https://yellow-rpc.envoyos.xyz/rpc", {
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

const yellowFirst = await measureExecutionTime(() =>
  yellowRpcClient.getBalance({
    address: "0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6",
  }),
);

const alchemyFirst = await measureExecutionTime(() =>
  alchemyClient.getBalance({
    address: "0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6",
  }),
);

const yellowSecond = await measureExecutionTime(() =>
  yellowRpcClient.getBalance({
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  }),
);

const alchemySecond = await measureExecutionTime(() =>
  alchemyClient.getBalance({
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  }),
);

console.log(
  `\nYellow RPC First Request took ${yellowFirst.time.toFixed(2)}ms\nResult: ${yellowFirst.result}`,
);
console.log(
  `\nAlchemy First Request took ${alchemyFirst.time.toFixed(2)}ms\nResult: ${alchemyFirst.result}`,
);

console.log(
  `\nYellow RPC Second Request took ${yellowSecond.time.toFixed(2)}ms\nResult: ${yellowSecond.result}`,
);
console.log(
  `\nAlchemy Second Request took ${alchemySecond.time.toFixed(2)}ms\nResult: ${alchemySecond.result}`,
);

console.log(
  `\nFirst Request Overhead: ${(yellowFirst.time - alchemyFirst.time).toFixed(2)}ms`,
);
console.log(
  `Second Request Overhead: ${(yellowSecond.time - alchemySecond.time).toFixed(2)}ms`,
);

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
