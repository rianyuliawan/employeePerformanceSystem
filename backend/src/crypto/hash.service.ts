import crypto from "node:crypto";

export function generateSHA256(input: string | Buffer) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function compareHash(input: string | Buffer, expectedHash: string) {
  return generateSHA256(input).toLowerCase() === expectedHash.toLowerCase();
}

