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
