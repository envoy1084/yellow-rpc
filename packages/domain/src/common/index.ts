export type Mutable<T> = T extends readonly (infer U)[]
  ? U[]
  : T extends object
    ? { -readonly [K in keyof T]: Mutable<T[K]> }
    : T;

export const toMutable = <T>(value: T): Mutable<T> =>
  structuredClone(value) as Mutable<T>;
