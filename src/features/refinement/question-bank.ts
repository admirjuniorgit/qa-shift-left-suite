import type { QuestionBankEntry, StoryTag } from "./types";

export const BUILT_IN_QUESTIONS: QuestionBankEntry[] = [
  { id: "q-escopo-1", category: "escopo", text: "O que explicitamente NÃO faz parte desta entrega?", tags: [] },
  { id: "q-escopo-2", category: "escopo", text: "Existe algum caso de borda óbvio que ainda não foi mencionado?", tags: [] },
  { id: "q-escopo-3", category: "escopo", text: "Essa tarefa pode ser quebrada em partes menores e entregáveis?", tags: [] },

  { id: "q-ac-1", category: "criteriosDeAceite", text: "Os critérios de aceite cobrem cenário de sucesso e de falha?", tags: [] },
  { id: "q-ac-2", category: "criteriosDeAceite", text: "Há algum critério de aceite ambíguo ou que admite mais de uma interpretação?", tags: [] },
  { id: "q-ac-3", category: "criteriosDeAceite", text: "Como o time vai validar que cada critério foi atendido (manual, automatizado, ambos)?", tags: [] },

  { id: "q-dados-1", category: "dados", text: "Quais dados existentes serão lidos, criados ou alterados?", tags: ["alteraDadosExistentes"] },
  { id: "q-dados-2", category: "dados", text: "Precisa de migração de dados? Ela é reversível?", tags: ["alteraDadosExistentes"] },
  { id: "q-dados-3", category: "dados", text: "Existe risco de perda ou inconsistência de dados em produção?", tags: ["alteraDadosExistentes"] },

  { id: "q-nf-1", category: "naoFuncionais", text: "Há um requisito claro de tempo de resposta ou volume esperado?", tags: ["performanceCritica"] },
  { id: "q-nf-2", category: "naoFuncionais", text: "O comportamento sob falha (timeout, indisponibilidade) foi definido?", tags: ["integracaoExterna", "performanceCritica"] },
  { id: "q-nf-3", category: "naoFuncionais", text: "Existe requisito de acessibilidade ou de suporte a outro idioma/locale?", tags: ["uiNova"] },

  { id: "q-seg-1", category: "seguranca", text: "Quem tem permissão para executar essa ação? Foi validado no back e no front?", tags: ["envolvePermissoes"] },
  { id: "q-seg-2", category: "seguranca", text: "Dados sensíveis (pagamento, PII) estão envolvidos? Como são protegidos?", tags: ["fluxoDePagamento", "envolvePermissoes"] },
  { id: "q-seg-3", category: "seguranca", text: "Essa mudança introduz uma nova superfície exposta (endpoint, input externo)?", tags: ["integracaoExterna"] },

  { id: "q-dep-1", category: "dependencias", text: "Depende de outro time, serviço externo ou feature ainda não pronta?", tags: ["integracaoExterna"] },
  { id: "q-dep-2", category: "dependencias", text: "Essa mudança quebra compatibilidade com algum consumidor atual da API/contrato?", tags: ["mudancaDeContrato"] },
  { id: "q-dep-3", category: "dependencias", text: "Há uma feature flag ou plano de rollback caso algo dê errado?", tags: [] },

  { id: "q-test-1", category: "testabilidade", text: "É possível testar isso localmente sem depender de ambiente externo?", tags: ["integracaoExterna"] },
  { id: "q-test-2", category: "testabilidade", text: "Existe alguma parte difícil de automatizar (ex: pagamento real, terceiros)? Como será coberta?", tags: ["fluxoDePagamento", "integracaoExterna"] },
  { id: "q-test-3", category: "testabilidade", text: "Quais cenários de teste manual/exploratório fazem sentido além do automatizado?", tags: [] },
];

export function filterQuestions(
  questions: QuestionBankEntry[],
  selectedTags: StoryTag[],
): QuestionBankEntry[] {
  return questions.filter((q) => q.tags.length === 0 || q.tags.some((tag) => selectedTags.includes(tag)));
}
