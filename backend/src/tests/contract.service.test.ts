import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { hashToBytes32 } from "../blockchain/contract.service.js";

describe("hashToBytes32", () => {
  it("adds a 0x prefix to a bare 64-char hex hash", () => {
    const hash = crypto.createHash("sha256").update("evaluation content").digest("hex");
    expect(hashToBytes32(hash)).toBe(`0x${hash}`);
  });

  it("is idempotent when the hash already has a 0x prefix", () => {
    const hash = crypto.createHash("sha256").update("already prefixed").digest("hex");
    expect(hashToBytes32(`0x${hash}`)).toBe(`0x${hash}`);
  });

  it("preserves the full 32 bytes — does not truncate like the old UTF-8 encoding bug", () => {
    const hash = crypto.createHash("sha256").update("full length check").digest("hex");
    const result = hashToBytes32(hash);
    expect(result.length).toBe(66); // "0x" + 64 hex chars
    expect(result.slice(2)).toBe(hash);
  });

  it("rejects a hash that isn't 64 hex characters", () => {
    expect(() => hashToBytes32("too-short")).toThrow(/32-byte/);
  });

  it("rejects non-hex characters", () => {
    expect(() => hashToBytes32("g".repeat(64))).toThrow(/32-byte/);
  });
});
