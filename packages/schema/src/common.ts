import { Schema } from "effect";

const getHexRegex = (bytes: number | null) =>
  bytes ? new RegExp(`^0x[a-fA-F0-9]{${bytes * 2}}$`) : /^0x[a-fA-F0-9]*$/;

export const hexSchema = <const Name extends string>(
  bytes: number | null,
  brandName: Name,
) => {
  return Schema.TemplateLiteral(Schema.Literal("0x"), Schema.String).pipe(
    Schema.pattern(getHexRegex(bytes), {
      message: () =>
        bytes
          ? `Invalid format: must be ${bytes} bytes (${bytes * 2} hex chars) prefixed with 0x`
          : "Invalid format: must be a 0x-prefixed hex string",
    }),
    Schema.brand(brandName),
  );
};

export const AddressSchema = hexSchema(20, "Address");
export const HexSchema = hexSchema(null, "Hex");

export type Address = typeof AddressSchema.Type;
export type Hex = typeof HexSchema.Type;
