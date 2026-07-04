import { describe, it, expect } from "vitest";
import { generateSHA256, compareHash } from "../crypto/hash.service.js";

describe("hash.service", () => {
  it("produces a 64-character hex digest", () => {
    const hash = generateSHA256("hello world");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic for the same input", () => {
    expect(generateSHA256("same input")).toBe(generateSHA256("same input"));
  });

  it("produces different hashes for different input", () => {
    expect(generateSHA256("input a")).not.toBe(generateSHA256("input b"));
  });

  it("compareHash matches regardless of case", () => {
    const hash = generateSHA256("case test");
    expect(compareHash("case test", hash.toUpperCase())).toBe(true);
  });

  it("compareHash rejects a wrong hash", () => {
    expect(compareHash("real content", generateSHA256("different content"))).toBe(false);
  });
});
