import type { QuestionBankEntry, QuestionPhase, StoryTag } from "./types";

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

  { id: "q-plan-cap-1", phase: "planning", category: "capacidade", text: "O time tem capacidade real para essa entrega dentro do prazo, considerando férias, plantão e outros compromissos já assumidos?", tags: [] },
  { id: "q-plan-cap-2", phase: "planning", category: "capacidade", text: "A estimativa foi dada por quem vai efetivamente executar a tarefa?", tags: [] },
  { id: "q-plan-cap-3", phase: "planning", category: "capacidade", text: "Existe algum trabalho \"invisível\" (infra, configuração, massa de dados, ambiente) que não está contado na estimativa?", tags: [] },

  { id: "q-plan-seq-1", phase: "planning", category: "sequenciamento", text: "O que pode ser feito em paralelo por mais de uma pessoa sem gerar conflito ou retrabalho?", tags: [] },
  { id: "q-plan-seq-2", phase: "planning", category: "sequenciamento", text: "Existe alguma parte que bloqueia o início de outra? Qual é o caminho crítico da entrega?", tags: [] },
  { id: "q-plan-seq-3", phase: "planning", category: "sequenciamento", text: "Dá para entregar em fatias menores e testáveis ao longo da sprint, em vez de tudo pronto só no fim?", tags: [] },

  { id: "q-plan-risco-1", phase: "planning", category: "riscos", text: "Qual é o maior risco técnico dessa tarefa, e existe um plano B se ele se concretizar?", tags: [] },
  { id: "q-plan-risco-2", phase: "planning", category: "riscos", text: "Alguma dependência externa (outro time, serviço, aprovação) pode atrasar o início ou a entrega?", tags: ["integracaoExterna"] },
  { id: "q-plan-risco-3", phase: "planning", category: "testabilidade", text: "O ambiente e os dados necessários para testar essa entrega vão estar disponíveis a tempo?", tags: [] },

  { id: "q-plan-align-1", phase: "planning", category: "alinhamento", text: "Quem vai revisar o código e quem vai testar essa entrega? Essas pessoas já sabem que serão necessárias?", tags: [] },
  { id: "q-plan-align-2", phase: "planning", category: "alinhamento", text: "Stakeholders ou áreas afetadas já sabem que essa mudança entra nesta sprint?", tags: [] },
  { id: "q-plan-align-3", phase: "planning", category: "alinhamento", text: "O time concorda com o que significa \"pronto\" para essa tarefa específica, além do DoD padrão?", tags: [] },
];

export function questionPhase(question: QuestionBankEntry): QuestionPhase {
  return question.phase ?? "refinamento";
}

export function filterQuestions(
  questions: QuestionBankEntry[],
  selectedTags: StoryTag[],
  phase?: QuestionPhase,
): QuestionBankEntry[] {
  return questions
    .filter((q) => (phase ? questionPhase(q) === phase : true))
    .filter((q) => q.tags.length === 0 || q.tags.some((tag) => selectedTags.includes(tag)));
}
