import { describe, expect, it } from "vitest";
import { filterQuestions, questionPhase } from "./question-bank";
import type { QuestionBankEntry } from "./types";

const bank: QuestionBankEntry[] = [
  { id: "general-1", category: "escopo", text: "Pergunta geral", tags: [] },
  { id: "pagamento-1", category: "seguranca", text: "Pergunta de pagamento", tags: ["fluxoDePagamento"] },
  { id: "integracao-1", category: "dependencias", text: "Pergunta de integração", tags: ["integracaoExterna"] },
  { id: "multi-1", category: "naoFuncionais", text: "Pergunta multi-tag", tags: ["performanceCritica", "integracaoExterna"] },
];

const bankWithPhases: QuestionBankEntry[] = [
  { id: "ref-1", category: "escopo", text: "Pergunta de refinamento sem fase explícita", tags: [] },
  { id: "ref-2", phase: "refinamento", category: "escopo", text: "Pergunta de refinamento explícita", tags: [] },
  { id: "plan-1", phase: "planning", category: "capacidade", text: "Pergunta de planning", tags: [] },
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

  it("filtra por fase quando informada, tratando pergunta sem fase como refinamento", () => {
    expect(filterQuestions(bankWithPhases, [], "refinamento").map((q) => q.id).sort()).toEqual(["ref-1", "ref-2"]);
    expect(filterQuestions(bankWithPhases, [], "planning").map((q) => q.id)).toEqual(["plan-1"]);
  });

  it("sem fase informada, não filtra por fase", () => {
    expect(filterQuestions(bankWithPhases, []).map((q) => q.id)).toHaveLength(3);
  });
});

describe("questionPhase", () => {
  it("retorna 'refinamento' quando a pergunta não tem fase definida (dado antigo)", () => {
    expect(questionPhase({ id: "x", category: "escopo", text: "t", tags: [] })).toBe("refinamento");
  });

  it("retorna a fase explícita quando definida", () => {
    expect(questionPhase({ id: "x", phase: "planning", category: "capacidade", text: "t", tags: [] })).toBe("planning");
  });
});
