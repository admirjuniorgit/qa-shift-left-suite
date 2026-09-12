import type { ChecklistTemplate } from "./types";

function item(text: string, idx: number, prefix: string) {
  return { id: `${prefix}-${idx}`, text };
}

export const BUILT_IN_TEMPLATES: ChecklistTemplate[] = [
  {
    id: "tpl-dod",
    name: "Definition of Done",
    category: "dod",
    isBuiltIn: true,
    items: [
      "Código revisado e aprovado por pelo menos 1 pessoa",
      "Testes automatizados cobrindo o caminho principal e erros óbvios",
      "Sem regressão nos testes existentes (CI verde)",
      "Documentação/README atualizados quando aplicável",
      "Critérios de aceite da tarefa validados",
      "Deploy/feature flag e rollback definidos",
    ].map((t, i) => item(t, i, "dod")),
  },
  {
    id: "tpl-code-review",
    name: "Checklist de code review",
    category: "codeReview",
    isBuiltIn: true,
    relatedTags: ["envolvePermissoes", "fluxoDePagamento"],
    items: [
      "O PR faz o que a descrição diz, sem escopo escondido",
      "Nomes de variáveis/funções comunicam a intenção",
      "Casos de erro e de borda são tratados",
      "Há testes cobrindo a mudança",
      "Nenhum segredo, chave ou dado sensível commitado",
      "Sem código morto ou comentado deixado para trás",
    ].map((t, i) => item(t, i, "cr")),
  },
  {
    id: "tpl-bug-report",
    name: "Template de relato de bug",
    category: "bugReport",
    isBuiltIn: true,
    items: [
      "Passos para reproduzir, numerados e específicos",
      "Resultado esperado vs. resultado obtido",
      "Ambiente (navegador/OS/versão/ambiente de teste)",
      "Evidência (print, vídeo, log ou trace)",
      "Severidade e impacto no usuário",
      "Frequência (sempre reproduz? intermitente?)",
    ].map((t, i) => item(t, i, "bug")),
  },
  {
    id: "tpl-test-strategy",
    name: "Estratégia de teste",
    category: "testStrategy",
    isBuiltIn: true,
    relatedTags: ["integracaoExterna", "performanceCritica", "fluxoDePagamento"],
    items: [
      "Riscos principais da entrega identificados e priorizados",
      "Nível de teste definido por risco (unitário, integração, e2e, manual)",
      "Dados de teste necessários mapeados",
      "Dependências externas mockadas ou isoladas quando possível",
      "Critério de saída definido (o que precisa passar para liberar)",
    ].map((t, i) => item(t, i, "strategy")),
  },
  {
    id: "tpl-release",
    name: "Checklist de release",
    category: "release",
    isBuiltIn: true,
    relatedTags: ["mudancaDeContrato", "alteraDadosExistentes"],
    items: [
      "Changelog/notas de release atualizadas",
      "Migrações de dados testadas e reversíveis",
      "Monitoramento/alertas prontos para acompanhar o pós-deploy",
      "Plano de rollback validado",
      "Stakeholders avisados da janela de deploy",
    ].map((t, i) => item(t, i, "release")),
  },
];
