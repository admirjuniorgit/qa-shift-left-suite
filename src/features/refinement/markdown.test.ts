import { describe, expect, it } from "vitest";
import { sessionToMarkdown } from "./markdown";
import type { QuestionBankEntry, RefinementSession } from "./types";

const questions: QuestionBankEntry[] = [
  { id: "q1", category: "escopo", text: "Pergunta de escopo?", tags: [] },
  { id: "q2", category: "seguranca", text: "Pergunta de segurança?", tags: ["envolvePermissoes"] },
];

function makeSession(overrides: Partial<RefinementSession> = {}): RefinementSession {
  return {
    id: "s1",
    storyTitle: "Minha história",
    storyTags: ["envolvePermissoes"],
    selectedQuestionIds: ["q1", "q2"],
    notes: "Algumas notas",
    dorChecklist: [
      { id: "d1", label: "Item pronto", checked: true },
      { id: "d2", label: "Item pendente", checked: false },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("sessionToMarkdown", () => {
  it("inclui título, tags, perguntas selecionadas, notas e checklist com contagem", () => {
    const md = sessionToMarkdown(makeSession(), questions);
    expect(md).toContain("# Minha história");
    expect(md).toContain("Envolve permissões/papéis");
    expect(md).toContain("Pergunta de escopo?");
    expect(md).toContain("Pergunta de segurança?");
    expect(md).toContain("Algumas notas");
    expect(md).toContain("Definition of Ready (1/2)");
    expect(md).toContain("- [x] Item pronto");
    expect(md).toContain("- [ ] Item pendente");
  });

  it("usa '(sem título)' quando a história não tem título", () => {
    const md = sessionToMarkdown(makeSession({ storyTitle: "" }), questions);
    expect(md).toContain("# (sem título)");
  });

  it("omite seções vazias (sem tags, sem perguntas, sem notas)", () => {
    const md = sessionToMarkdown(makeSession({ storyTags: [], selectedQuestionIds: [], notes: "" }), questions);
    expect(md).not.toContain("Características");
    expect(md).not.toContain("Perguntas levantadas");
    expect(md).not.toContain("## Notas");
  });

  it("ignora ids de pergunta que não existem mais no banco", () => {
    const md = sessionToMarkdown(makeSession({ selectedQuestionIds: ["q1", "id-removido"] }), questions);
    expect(md).toContain("Pergunta de escopo?");
    expect(md).not.toContain("id-removido");
  });
});
