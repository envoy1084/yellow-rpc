import { createHash } from "node:crypto";

import base64url from "base64url";

export const keyHasher = (key: string) => {
  const encoded = new TextEncoder().encode(key);
  const hash = createHash("sha256").update(encoded).digest("binary");
  const hashed = base64url.encode(hash);
  return hashed;
};
