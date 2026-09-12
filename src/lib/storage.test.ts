import { beforeEach, describe, expect, it, vi } from "vitest";
import { getItem, setItem, removeItem, storageKey, allNamespacedKeys } from "./storage";

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("retorna o fallback quando a chave não existe", () => {
    expect(getItem("inexistente", [1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("faz round-trip de valores complexos", () => {
    const value = { a: 1, b: ["x", "y"], c: { nested: true } };
    setItem("algo", value);
    expect(getItem("algo", null)).toEqual(value);
  });

  it("namespaceia a chave real no localStorage", () => {
    setItem("minha-chave", 42);
    expect(localStorage.getItem(storageKey("minha-chave"))).toBe("42");
  });

  it("retorna o fallback quando o JSON armazenado está corrompido", () => {
    localStorage.setItem(storageKey("corrompido"), "{ isso não é json");
    expect(getItem("corrompido", "fallback")).toBe("fallback");
  });

  it("removeItem apaga apenas a chave namespaced", () => {
    setItem("a", 1);
    setItem("b", 2);
    removeItem("a");
    expect(getItem("a", null)).toBeNull();
    expect(getItem("b", null)).toBe(2);
  });

  it("allNamespacedKeys lista só as chaves do namespace do app", () => {
    setItem("a", 1);
    setItem("b", 2);
    localStorage.setItem("outra-lib:chave", "1");
    const keys = allNamespacedKeys();
    expect(keys).toContain(storageKey("a"));
    expect(keys).toContain(storageKey("b"));
    expect(keys).not.toContain("outra-lib:chave");
  });

  it("setItem retorna false e não lança quando o localStorage estoura a cota", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(setItem("qualquer", "valor")).toBe(false);
    spy.mockRestore();
  });
});
