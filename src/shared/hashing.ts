import { createHash } from "node:crypto";

export const sha256HexUtf8 = (value: string): string =>
  createHash("sha256").update(value, "utf8").digest("hex");
