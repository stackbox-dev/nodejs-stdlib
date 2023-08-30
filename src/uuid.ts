import * as crypto from "node:crypto";

export const NULL = "00000000-0000-0000-0000-000000000000";

export function v4(): string {
  return crypto.randomUUID();
}

export function fromBuffer(buffer: Buffer): string {
  const hex = buffer.toString("hex");
  return (
    hex.slice(0, 8) +
    "-" +
    hex.slice(8, 12) +
    "-" +
    hex.slice(12, 16) +
    "-" +
    hex.slice(16, 20) +
    "-" +
    hex.slice(20, 32)
  );
}
