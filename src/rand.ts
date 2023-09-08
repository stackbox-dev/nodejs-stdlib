import * as crypto from "node:crypto";

const charsets = {
  alphanumeric:
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numeric: "0123456789",
};

export function generate(
  length: number,
  charset: "alphanumeric" | "numeric",
): string {
  const charsetData = charsets[charset];
  const buffer = crypto.randomBytes(length);
  const arr: string[] = [];
  for (const byte of buffer) {
    arr.push(charsetData[byte % charsetData.length]);
  }
  return arr.join("");
}

if (require.main === module) {
  console.log(generate(32, "alphanumeric"));
  console.log(generate(40, "numeric"));
}
