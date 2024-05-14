import * as crypto from "node:crypto";

export const NULL = "00000000-0000-0000-0000-000000000000";

export function v4(): string {
  return crypto.randomUUID();
}

// https://www.ietf.org/archive/id/draft-peabody-dispatch-new-uuid-format-04.html#name-uuid-version-7
/**
 * unix_ts_ms:
 * 48 bit big-endian unsigned number of Unix epoch timestamp as per Section 6.1.
 * ver:
 * 4 bit UUIDv7 version set as per Section 4
 * rand_a:
 * 12 bits pseudo-random data to provide uniqueness as per Section 6.2 and Section 6.6.
 * var:
 * The 2 bit variant defined by Section 4.
 * rand_b:
 * The final 62 bits of pseudo-random data to provide uniqueness as per Section 6.2 and Section 6.6.
 */
export function v7(): string {
  const timeComponent = Date.now().toString(16).padStart(12, "0");

  const rndBuf = crypto.randomBytes(8);
  // set 10 as first 2 bits for RFC 4122 variant
  rndBuf[0] = (rndBuf[0] & 0x3f) | 0x80;
  const rndArrHex = rndBuf.toString("hex");

  return (
    timeComponent.slice(0, 8) +
    "-" +
    timeComponent.slice(8, 12) +
    "-7" +
    nextSeq().toString(16).padStart(3, "0") +
    "-" +
    rndArrHex.slice(0, 4) +
    "-" +
    rndArrHex.slice(4, 16)
  );
}

let seq = 0;
function nextSeq() {
  seq = seq === 0xfff ? 0 : seq + 1;
  return seq;
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

export function v5(name: string, namespace: string): string {
  const namespaceBuffer = Buffer.from(namespace.replace(/-/g, ""), "hex");
  if (namespaceBuffer.length !== 16) {
    throw new Error("Namespace must be a 128-bit UUID");
  }
  const nameBuffer = Buffer.from(name, "utf8");

  const hash = crypto.createHash("sha1");
  hash.update(namespaceBuffer);
  hash.update(nameBuffer);
  const digest = hash.digest();

  // Set version and variant bits for UUID v5
  digest[6] = (digest[6] & 0x0f) | 0x50; // Version 5
  digest[8] = (digest[8] & 0x3f) | 0x80; // Variant 1

  // Format as UUID string
  return [
    digest.subarray(0, 4).toString("hex"),
    digest.subarray(4, 6).toString("hex"),
    digest.subarray(6, 8).toString("hex"),
    digest.subarray(8, 10).toString("hex"),
    digest.subarray(10, 16).toString("hex"),
  ].join("-");
}

export const NameSpace = {
  DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};
