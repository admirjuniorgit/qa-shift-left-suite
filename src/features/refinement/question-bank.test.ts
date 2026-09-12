import { describe, expect, it } from "vitest";
import { filterQuestions } from "./question-bank";
import type { QuestionBankEntry } from "./types";

const bank: QuestionBankEntry[] = [
  { id: "general-1", category: "escopo", text: "Pergunta geral", tags: [] },
  { id: "pagamento-1", category: "seguranca", text: "Pergunta de pagamento", tags: ["fluxoDePagamento"] },
  { id: "integracao-1", category: "dependencias", text: "Pergunta de integração", tags: ["integracaoExterna"] },
  { id: "multi-1", category: "naoFuncionais", text: "Pergunta multi-tag", tags: ["performanceCritica", "integracaoExterna"] },
];

describe("filterQuestions", () => {
  it("sem tags selecionadas, retorna só as perguntas gerais (sem tags)", () => {
    const result = filterQuestions(bank, []);
    expect(result.map((q) => q.id)).toEqual(["general-1"]);
  });

  it("com uma tag selecionada, inclui gerais + perguntas daquela tag", () => {
    const result = filterQuestions(bank, ["fluxoDePagamento"]);
    expect(result.map((q) => q.id).sort()).toEqual(["general-1", "pagamento-1"]);
  });

  it("uma pergunta com múltiplas tags aparece se qualquer uma bater", () => {
    const result = filterQuestions(bank, ["performanceCritica"]);
    expect(result.map((q) => q.id)).toContain("multi-1");
  });

  it("tag desconhecida não bate com nenhuma pergunta específica", () => {
    // @ts-expect-error testando robustez contra tag fora do enum em runtime
    const result = filterQuestions(bank, ["tagQueNaoExiste"]);
    expect(result.map((q) => q.id)).toEqual(["general-1"]);
  });

  it("múltiplas tags selecionadas cobrem múltiplas perguntas", () => {
    const result = filterQuestions(bank, ["fluxoDePagamento", "integracaoExterna"]);
    expect(result.map((q) => q.id).sort()).toEqual(["general-1", "integracao-1", "multi-1", "pagamento-1"]);
  });
});
