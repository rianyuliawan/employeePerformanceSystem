import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "../crypto/aes.service.js";

describe("aes.service", () => {
  it("decrypts back to the original plaintext", () => {
    const plaintext = "Nomor telepon: 081234567890";
    const encrypted = encrypt(plaintext);
    expect(decrypt(encrypted)).toBe(plaintext);
  });

  it("never reuses the same IV/ciphertext for repeated calls", () => {
    const a = encrypt("same plaintext");
    const b = encrypt("same plaintext");
    expect(a).not.toBe(b);
  });

  it("stores iv:tag:ciphertext as three hex segments", () => {
    const parts = encrypt("segment check").split(":");
    expect(parts).toHaveLength(3);
    for (const part of parts) expect(part).toMatch(/^[0-9a-f]+$/);
  });

  it("throws on a tampered ciphertext (GCM auth tag mismatch)", () => {
    const encrypted = encrypt("tamper me");
    const [iv, tag, ciphertext] = encrypted.split(":");
    const tamperedByte = (parseInt(ciphertext.slice(0, 2), 16) ^ 0xff).toString(16).padStart(2, "0");
    const tampered = `${iv}:${tag}:${tamperedByte}${ciphertext.slice(2)}`;
    expect(() => decrypt(tampered)).toThrow();
  });

  it("throws on a malformed payload", () => {
    expect(() => decrypt("not-a-valid-payload")).toThrow("Invalid encrypted payload");
  });
});
