import { describe, expect, it } from "vitest";
import { parseChecklistMarkdown } from "./markdown-import";

describe("parseChecklistMarkdown", () => {
  it("extrai o nome do heading e os itens de checkboxes markdown", () => {
    const md = ["# Meu checklist", "", "- [ ] Primeiro item", "- [x] Segundo item"].join("\n");
    const result = parseChecklistMarkdown(md);
    expect(result.name).toBe("Meu checklist");
    expect(result.items).toEqual(["Primeiro item", "Segundo item"]);
  });

  it("aceita marcadores simples (- ou *) sem checkbox", () => {
    const md = ["## Outro checklist", "- item A", "* item B"].join("\n");
    const result = parseChecklistMarkdown(md);
    expect(result.name).toBe("Outro checklist");
    expect(result.items).toEqual(["item A", "item B"]);
  });

  it("usa um nome padrão quando não há heading", () => {
    const md = "- [ ] único item";
    const result = parseChecklistMarkdown(md);
    expect(result.name).toBe("Checklist importado");
    expect(result.items).toEqual(["único item"]);
  });

  it("ignora linhas em branco e texto que não é item de lista", () => {
    const md = ["# Título", "", "Um parágrafo qualquer.", "- [ ] item válido", ""].join("\n");
    const result = parseChecklistMarkdown(md);
    expect(result.items).toEqual(["item válido"]);
  });

  it("retorna lista de itens vazia quando não há nenhum marcador", () => {
    const result = parseChecklistMarkdown("# Só título\nsem itens aqui");
    expect(result.items).toEqual([]);
  });
});
