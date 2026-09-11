import { describe, expect, it } from "vitest";
import { slugify, projectKeyFromName } from "./slug";

describe("slugify", () => {
  it("remove acentos e normaliza espaços/símbolos", () => {
    expect(slugify("Organização de QA")).toBe("organizacao-de-qa");
    expect(slugify("  Time — Frontend!! ")).toBe("time-frontend");
  });

  it("lida com string vazia", () => {
    expect(slugify("   ")).toBe("");
  });
});

describe("projectKeyFromName", () => {
  it("gera até 4 letras maiúsculas a partir do nome", () => {
    expect(projectKeyFromName("Checkout")).toBe("CHEC");
    expect(projectKeyFromName("App Mobile")).toBe("APPM");
  });

  it("usa PRJ como fallback quando não há letras", () => {
    expect(projectKeyFromName("123 456")).toBe("PRJ");
  });
});
