import type { Locator, Step } from "./types";

export function describeLocator(locator: Locator): string {
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

export function describeStep(step: Step): string {
  switch (step.kind) {
    case "goto":
      return `Ir para "${step.url}"`;
    case "click":
      return `Clicar em ${describeLocator(step.locator)}`;
    case "fill":
      return `Preencher ${describeLocator(step.locator)} com "${step.value}"`;
    case "selectOption":
      return `Selecionar "${step.value}" em ${describeLocator(step.locator)}`;
    case "check":
      return `${step.checked ? "Marcar" : "Desmarcar"} ${describeLocator(step.locator)}`;
    case "hover":
      return `Passar o mouse em ${describeLocator(step.locator)}`;
    case "press":
      return `Pressionar "${step.key}" em ${describeLocator(step.locator)}`;
    case "uploadFile":
      return `Enviar arquivo "${step.filePath}" em ${describeLocator(step.locator)}`;
    case "waitFor":
      return `Esperar ${describeLocator(step.locator)} aparecer`;
    case "expectVisible":
      return `Verificar que ${describeLocator(step.locator)} está visível`;
    case "expectText":
      return `Verificar que ${describeLocator(step.locator)} tem texto "${step.text}"`;
    case "expectCount":
      return `Verificar que ${describeLocator(step.locator)} aparece ${step.count}x`;
    case "expectEnabled":
      return `Verificar que ${describeLocator(step.locator)} está habilitado`;
    case "expectDisabled":
      return `Verificar que ${describeLocator(step.locator)} está desabilitado`;
    case "expectUrl":
      return `Verificar que a URL é "${step.url}"`;
    case "wait":
      return `Esperar ${step.ms}ms`;
    case "screenshot":
      return `Tirar screenshot "${step.name}"`;
  }
}
