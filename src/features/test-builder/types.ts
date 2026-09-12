import { z } from "zod";

export const locatorSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), text: z.string(), exact: z.boolean().optional() }),
  z.object({ kind: z.literal("role"), role: z.string(), name: z.string().optional(), exact: z.boolean().optional() }),
  z.object({ kind: z.literal("label"), label: z.string(), exact: z.boolean().optional() }),
  z.object({ kind: z.literal("testId"), testId: z.string() }),
  z.object({ kind: z.literal("css"), selector: z.string() }),
]);

export type Locator = z.infer<typeof locatorSchema>;

export type LocatorKind = Locator["kind"];

export const stepSchema = z.discriminatedUnion("kind", [
  z.object({ id: z.string(), kind: z.literal("goto"), url: z.string() }),
  z.object({ id: z.string(), kind: z.literal("click"), locator: locatorSchema }),
  z.object({ id: z.string(), kind: z.literal("fill"), locator: locatorSchema, value: z.string() }),
  z.object({ id: z.string(), kind: z.literal("selectOption"), locator: locatorSchema, value: z.string() }),
  z.object({ id: z.string(), kind: z.literal("check"), locator: locatorSchema, checked: z.boolean() }),
  z.object({ id: z.string(), kind: z.literal("expectVisible"), locator: locatorSchema }),
  z.object({ id: z.string(), kind: z.literal("expectText"), locator: locatorSchema, text: z.string() }),
  z.object({ id: z.string(), kind: z.literal("expectUrl"), url: z.string() }),
  z.object({ id: z.string(), kind: z.literal("wait"), ms: z.number().int().positive() }),
  z.object({ id: z.string(), kind: z.literal("screenshot"), name: z.string() }),
]);

export type Step = z.infer<typeof stepSchema>;

export type StepKind = Step["kind"];

export const testCaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  steps: z.array(stepSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TestCase = z.infer<typeof testCaseSchema>;

export const STEP_LABELS: Record<StepKind, string> = {
  goto: "Ir para URL",
  click: "Clicar em",
  fill: "Preencher campo",
  selectOption: "Selecionar opção",
  check: "Marcar/desmarcar",
  expectVisible: "Verificar que está visível",
  expectText: "Verificar texto",
  expectUrl: "Verificar URL",
  wait: "Esperar (ms)",
  screenshot: "Tirar screenshot",
};

export const LOCATOR_LABELS: Record<LocatorKind, string> = {
  text: "Texto visível",
  role: "Papel (botão, link, campo...)",
  label: "Rótulo do campo",
  testId: "Test ID (data-testid)",
  css: "Seletor CSS",
};
