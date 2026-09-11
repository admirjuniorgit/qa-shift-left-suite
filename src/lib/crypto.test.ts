import { describe, expect, it, beforeAll } from "vitest";
import { encryptToken, decryptToken } from "./crypto";

beforeAll(() => {
  process.env.GITLAB_TOKEN_ENCRYPTION_KEY = "test-key-not-for-production";
});

describe("encryptToken / decryptToken", () => {
  it("faz round-trip do valor original", () => {
    const original = "glpat-abc123XYZ";
    const encrypted = encryptToken(original);

    expect(encrypted).not.toBe(original);
    expect(decryptToken(encrypted)).toBe(original);
  });

  it("gera saídas diferentes para a mesma entrada (IV aleatório)", () => {
    const a = encryptToken("mesmo-valor");
    const b = encryptToken("mesmo-valor");
    expect(a).not.toBe(b);
  });

  it("rejeita payload malformado", () => {
    expect(() => decryptToken("payload-invalido")).toThrow();
  });
});
