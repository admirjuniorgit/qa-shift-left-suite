import { describe, expect, it } from "vitest";
import { generateApiToken, hashApiToken } from "./api-tokens";

describe("generateApiToken", () => {
  it("gera um token com prefixo estável e hash reproduzível", () => {
    const { token, hash, prefix } = generateApiToken();

    expect(token.startsWith("qass_")).toBe(true);
    expect(prefix).toBe(token.slice(0, 12));
    expect(hash).toBe(hashApiToken(token));
  });

  it("gera tokens diferentes a cada chamada", () => {
    const a = generateApiToken();
    const b = generateApiToken();
    expect(a.token).not.toBe(b.token);
  });
});
