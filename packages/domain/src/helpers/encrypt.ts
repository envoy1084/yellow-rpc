import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export const encryptAesGcm = ({
  masterKey,
  text,
}: {
  masterKey: string;
  text: string;
}) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    Buffer.from(masterKey, "hex"),
    iv,
  );

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

export const decryptAesGcm = ({
  masterKey,
  encrypted,
}: {
  masterKey: string;
  encrypted: string;
}) => {
  const data = Buffer.from(encrypted, "base64");
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);

  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(masterKey, "hex"),
    iv,
  );
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
};
