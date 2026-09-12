import { STEP_LABELS, type Locator, type Step } from "../types";

function locatorSummary(locator: Locator): string {
  switch (locator.kind) {
    case "text":
      return `texto "${locator.text}"`;
    case "role":
      return `papel "${locator.role}"${locator.name ? ` (${locator.name})` : ""}`;
    case "label":
      return `rótulo "${locator.label}"`;
    case "testId":
      return `test id "${locator.testId}"`;
    case "css":
      return `seletor "${locator.selector}"`;
  }
}

function stepSummary(step: Step): string {
  switch (step.kind) {
    case "goto":
      return `Ir para "${step.url}"`;
    case "click":
      return `Clicar em ${locatorSummary(step.locator)}`;
    case "fill":
      return `Preencher ${locatorSummary(step.locator)} com "${step.value}"`;
    case "selectOption":
      return `Selecionar "${step.value}" em ${locatorSummary(step.locator)}`;
    case "check":
      return `${step.checked ? "Marcar" : "Desmarcar"} ${locatorSummary(step.locator)}`;
    case "expectVisible":
      return `Verificar que ${locatorSummary(step.locator)} está visível`;
    case "expectText":
      return `Verificar que ${locatorSummary(step.locator)} tem texto "${step.text}"`;
    case "expectUrl":
      return `Verificar que a URL é "${step.url}"`;
    case "wait":
      return `Esperar ${step.ms}ms`;
    case "screenshot":
      return `Tirar screenshot "${step.name}"`;
  }
}

export function StepList({
  steps,
  onMove,
  onRemove,
}: {
  steps: Step[];
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}) {
  if (steps.length === 0) {
    return <p className="text-sm text-slate-400">Nenhum passo ainda — adicione o primeiro abaixo.</p>;
  }

  return (
    <ol className="space-y-1.5">
      {steps.map((step, index) => (
        <li key={step.id} className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          <span className="w-5 shrink-0 text-slate-400">{index + 1}.</span>
          <span className="min-w-0 flex-1 truncate" title={stepSummary(step)}>
            <span className="font-medium">{STEP_LABELS[step.kind]}:</span> {stepSummary(step)}
          </span>
          <div className="flex shrink-0 gap-1 text-xs">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
              className="disabled:opacity-30"
              aria-label="Mover para cima"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={index === steps.length - 1}
              onClick={() => onMove(index, 1)}
              className="disabled:opacity-30"
              aria-label="Mover para baixo"
            >
              ↓
            </button>
            <button type="button" onClick={() => onRemove(index)} className="text-slate-400 hover:text-red-500" aria-label="Remover passo">
              remover
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
