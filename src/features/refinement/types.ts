import { z } from "zod";

export const QUESTION_CATEGORIES = [
  "escopo",
  "criteriosDeAceite",
  "dados",
  "naoFuncionais",
  "seguranca",
  "dependencias",
  "testabilidade",
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  escopo: "Escopo",
  criteriosDeAceite: "Critérios de aceite",
  dados: "Dados",
  naoFuncionais: "Não-funcionais",
  seguranca: "Segurança",
  dependencias: "Dependências",
  testabilidade: "Testabilidade",
};

export const STORY_TAGS = [
  "integracaoExterna",
  "alteraDadosExistentes",
  "uiNova",
  "performanceCritica",
  "envolvePermissoes",
  "fluxoDePagamento",
  "mudancaDeContrato",
] as const;

export type StoryTag = (typeof STORY_TAGS)[number];

export const STORY_TAG_LABELS: Record<StoryTag, string> = {
  integracaoExterna: "Tem integração externa",
  alteraDadosExistentes: "Altera dados existentes",
  uiNova: "Tem UI nova",
  performanceCritica: "Performance é crítica",
  envolvePermissoes: "Envolve permissões/papéis",
  fluxoDePagamento: "Envolve pagamento/financeiro",
  mudancaDeContrato: "Muda contrato de API/integração",
};

export const questionBankEntrySchema = z.object({
  id: z.string(),
  text: z.string(),
  category: z.enum(QUESTION_CATEGORIES),
  tags: z.array(z.enum(STORY_TAGS)),
  isCustom: z.boolean().optional(),
});

export type QuestionBankEntry = z.infer<typeof questionBankEntrySchema>;

export const dorChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  checked: z.boolean(),
});

export type DoRChecklistItem = z.infer<typeof dorChecklistItemSchema>;

export const refinementSessionSchema = z.object({
  id: z.string(),
  storyTitle: z.string(),
  storyTags: z.array(z.enum(STORY_TAGS)),
  selectedQuestionIds: z.array(z.string()),
  notes: z.string(),
  dorChecklist: z.array(dorChecklistItemSchema),
  createdAt: z.string(),
});

export type RefinementSession = z.infer<typeof refinementSessionSchema>;

export const DEFAULT_DOR_CHECKLIST_LABELS = [
  "Critérios de aceite escritos e claros",
  "Dependências identificadas e desbloqueadas",
  "Impacto em dados existentes avaliado",
  "Casos de teste principais esboçados",
  "Estimativa de esforço feita pelo time",
  "Sem perguntas em aberto sobre escopo",
];
