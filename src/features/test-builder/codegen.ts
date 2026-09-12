import type { Locator, Step, TestCase } from "./types";

function locatorExpression(locator: Locator): string {
  switch (locator.kind) {
    case "text": {
      const opts = locator.exact ? `, { exact: true }` : "";
      return `page.getByText(${JSON.stringify(locator.text)}${opts})`;
    }
    case "role": {
      const opts: string[] = [];
      if (locator.name) opts.push(`name: ${JSON.stringify(locator.name)}`);
      if (locator.exact) opts.push(`exact: true`);
      const optsStr = opts.length ? `, { ${opts.join(", ")} }` : "";
      return `page.getByRole(${JSON.stringify(locator.role)}${optsStr})`;
    }
    case "label": {
      const opts = locator.exact ? `, { exact: true }` : "";
      return `page.getByLabel(${JSON.stringify(locator.label)}${opts})`;
    }
    case "testId":
      return `page.getByTestId(${JSON.stringify(locator.testId)})`;
    case "css":
      return `page.locator(${JSON.stringify(locator.selector)})`;
  }
}

function stepStatement(step: Step): string {
  switch (step.kind) {
    case "goto":
      return `await page.goto(${JSON.stringify(step.url)});`;
    case "click":
      return `await ${locatorExpression(step.locator)}.click();`;
    case "fill":
      return `await ${locatorExpression(step.locator)}.fill(${JSON.stringify(step.value)});`;
    case "selectOption":
      return `await ${locatorExpression(step.locator)}.selectOption(${JSON.stringify(step.value)});`;
    case "check":
      return `await ${locatorExpression(step.locator)}.setChecked(${step.checked ? "true" : "false"});`;
    case "expectVisible":
      return `await expect(${locatorExpression(step.locator)}).toBeVisible();`;
    case "expectText":
      return `await expect(${locatorExpression(step.locator)}).toHaveText(${JSON.stringify(step.text)});`;
    case "expectUrl":
      return `await expect(page).toHaveURL(${JSON.stringify(step.url)});`;
    case "wait":
      // page.waitForTimeout é um cheiro (flakiness) — preferível esperar por um elemento/estado real quando possível.
      return `await page.waitForTimeout(${step.ms});`;
    case "screenshot":
      return `await page.screenshot({ path: ${JSON.stringify(`${step.name}.png`)} });`;
  }
}

export function generatePlaywrightTest(testCase: TestCase): string {
  const lines = testCase.steps.map((step) => `  ${stepStatement(step)}`);
  return [
    `import { test, expect } from "@playwright/test";`,
    ``,
    `test(${JSON.stringify(testCase.name)}, async ({ page }) => {`,
    ...(lines.length ? lines : [`  // adicione passos no construtor para gerar o corpo do teste`]),
    `});`,
    ``,
  ].join("\n");
}
