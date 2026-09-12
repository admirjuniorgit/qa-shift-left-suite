import { describe, expect, it } from "vitest";
import { templateToMarkdown } from "./markdown";
import type { ChecklistTemplate } from "./types";

describe("templateToMarkdown", () => {
  it("gera um heading com o nome do template e checkboxes markdown para cada item", () => {
    const template: ChecklistTemplate = {
      id: "t1",
      name: "Definition of Done",
      category: "dod",
      isBuiltIn: true,
      items: [
        { id: "1", text: "Código revisado" },
        { id: "2", text: "Testes passando" },
      ],
    };

    const md = templateToMarkdown(template);

    expect(md).toContain("# Definition of Done");
    expect(md).toContain("- [ ] Código revisado");
    expect(md).toContain("- [ ] Testes passando");
    expect(md.indexOf("- [ ] Código revisado")).toBeLessThan(md.indexOf("- [ ] Testes passando"));
  });

  it("lida com template sem itens", () => {
    const template: ChecklistTemplate = { id: "t2", name: "Vazio", category: "custom", isBuiltIn: false, items: [] };
    const md = templateToMarkdown(template);
    expect(md).toContain("# Vazio");
    expect(md).not.toContain("- [ ]");
  });
});
