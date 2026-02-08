const DECIMALS = 6;

export const toAtomic = (amount: string | number): bigint => {
  const [whole, fraction = ""] = String(amount).split(".");
  const paddedFraction = fraction.padEnd(DECIMALS, "0").slice(0, DECIMALS);
  return BigInt(whole + paddedFraction);
};

export const fromAtomic = (amount: bigint): string => {
  const str = amount.toString().padStart(DECIMALS + 1, "0");
  const whole = str.slice(0, -DECIMALS);
  const fraction = str.slice(-DECIMALS);
  return `${whole}.${fraction}`;
};

export const formatUsd = (
  atomicAmount: bigint | undefined,
  options: {
    decimals?: number; // Default: 6 (USDC)
    compact?: boolean; // Default: true (Use K, M, B)
  } = {
    compact: true,
    decimals: 6,
  },
) => {
  const { decimals = 6, compact = true } = options;

  const atomicVal = BigInt(atomicAmount ?? 0n);
  const humanVal = Number(atomicVal) / 10 ** decimals;

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
    style: "currency",
  }).format(humanVal);
};
