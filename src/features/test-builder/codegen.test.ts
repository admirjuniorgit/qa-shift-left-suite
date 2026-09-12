import { describe, expect, it } from "vitest";
import { generatePlaywrightTest } from "./codegen";
import type { Step, TestCase } from "./types";

function makeTestCase(steps: Step[], name = "meu fluxo"): TestCase {
  return { id: "tc-1", name, steps, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
}

describe("generatePlaywrightTest", () => {
  it("gera um teste vazio com comentário quando não há passos", () => {
    const code = generatePlaywrightTest(makeTestCase([]));
    expect(code).toContain('import { test, expect } from "@playwright/test";');
    expect(code).toContain('test("meu fluxo", async ({ page }) => {');
    expect(code).toContain("// adicione passos no construtor para gerar o corpo do teste");
  });

  it("gera goto", () => {
    const code = generatePlaywrightTest(makeTestCase([{ id: "1", kind: "goto", url: "https://exemplo.com" }]));
    expect(code).toContain('await page.goto("https://exemplo.com");');
  });

  it("gera click com locator de texto", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "click", locator: { kind: "text", text: "Entrar" } }]),
    );
    expect(code).toContain('await page.getByText("Entrar").click();');
  });

  it("gera click com locator de texto exato", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "click", locator: { kind: "text", text: "Entrar", exact: true } }]),
    );
    expect(code).toContain('await page.getByText("Entrar", { exact: true }).click();');
  });

  it("gera click com locator de role e nome", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "click", locator: { kind: "role", role: "button", name: "Salvar" } }]),
    );
    expect(code).toContain('await page.getByRole("button", { name: "Salvar" }).click();');
  });

  it("gera click com locator de role sem nome", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "click", locator: { kind: "role", role: "button" } }]),
    );
    expect(code).toContain('await page.getByRole("button").click();');
  });

  it("gera fill com locator de label", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "fill", locator: { kind: "label", label: "E-mail" }, value: "a@b.com" }]),
    );
    expect(code).toContain('await page.getByLabel("E-mail").fill("a@b.com");');
  });

  it("gera selectOption com locator de testId", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "selectOption", locator: { kind: "testId", testId: "pais" }, value: "BR" }]),
    );
    expect(code).toContain('await page.getByTestId("pais").selectOption("BR");');
  });

  it("gera check/uncheck com locator CSS", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "check", locator: { kind: "css", selector: "#aceite" }, checked: true }]),
    );
    expect(code).toContain('await page.locator("#aceite").setChecked(true);');
  });

  it("gera expectVisible", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "expectVisible", locator: { kind: "text", text: "Bem-vindo" } }]),
    );
    expect(code).toContain('await expect(page.getByText("Bem-vindo")).toBeVisible();');
  });

  it("gera expectText", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "expectText", locator: { kind: "css", selector: ".titulo" }, text: "Painel" }]),
    );
    expect(code).toContain('await expect(page.locator(".titulo")).toHaveText("Painel");');
  });

  it("gera expectUrl", () => {
    const code = generatePlaywrightTest(makeTestCase([{ id: "1", kind: "expectUrl", url: "/dashboard" }]));
    expect(code).toContain('await expect(page).toHaveURL("/dashboard");');
  });

  it("gera wait", () => {
    const code = generatePlaywrightTest(makeTestCase([{ id: "1", kind: "wait", ms: 500 }]));
    expect(code).toContain("await page.waitForTimeout(500);");
  });

  it("gera screenshot", () => {
    const code = generatePlaywrightTest(makeTestCase([{ id: "1", kind: "screenshot", name: "checkout" }]));
    expect(code).toContain('await page.screenshot({ path: "checkout.png" });');
  });

  it("gera hover", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "hover", locator: { kind: "text", text: "Menu" } }]),
    );
    expect(code).toContain('await page.getByText("Menu").hover();');
  });

  it("gera press", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "press", locator: { kind: "label", label: "Busca" }, key: "Enter" }]),
    );
    expect(code).toContain('await page.getByLabel("Busca").press("Enter");');
  });

  it("gera uploadFile", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "uploadFile", locator: { kind: "testId", testId: "file-input" }, filePath: "./fixtures/foto.png" }]),
    );
    expect(code).toContain('await page.getByTestId("file-input").setInputFiles("./fixtures/foto.png");');
  });

  it("gera waitFor", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "waitFor", locator: { kind: "css", selector: ".spinner" } }]),
    );
    expect(code).toContain('await page.locator(".spinner").waitFor();');
  });

  it("gera expectCount", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "expectCount", locator: { kind: "css", selector: "li" }, count: 3 }]),
    );
    expect(code).toContain('await expect(page.locator("li")).toHaveCount(3);');
  });

  it("gera expectEnabled e expectDisabled", () => {
    const code = generatePlaywrightTest(
      makeTestCase([
        { id: "1", kind: "expectEnabled", locator: { kind: "role", role: "button", name: "Salvar" } },
        { id: "2", kind: "expectDisabled", locator: { kind: "role", role: "button", name: "Salvar" } },
      ]),
    );
    expect(code).toContain('await expect(page.getByRole("button", { name: "Salvar" })).toBeEnabled();');
    expect(code).toContain('await expect(page.getByRole("button", { name: "Salvar" })).toBeDisabled();');
  });

  it("envolve cada passo em test.step com um rótulo legível", () => {
    const code = generatePlaywrightTest(
      makeTestCase([{ id: "1", kind: "goto", url: "/login" }]),
    );
    expect(code).toContain('await test.step("Ir para \\"/login\\"", async () => {');
    expect(code).toContain('await page.goto("/login");');
    expect(code).toContain("});");
  });

  it("escapa aspas e quebras de linha nos valores do usuário com segurança", () => {
    const code = generatePlaywrightTest(
      makeTestCase([
        { id: "1", kind: "fill", locator: { kind: "label", label: 'Campo "especial"' }, value: 'linha1\nlinha2 "com aspas"' },
      ]),
    );
    expect(code).toContain('page.getByLabel("Campo \\"especial\\"")');
    expect(code).toContain('.fill("linha1\\nlinha2 \\"com aspas\\"")');
  });

  it("gera um arquivo completo com múltiplos passos, na ordem correta", () => {
    const code = generatePlaywrightTest(
      makeTestCase(
        [
          { id: "1", kind: "goto", url: "/login" },
          { id: "2", kind: "fill", locator: { kind: "label", label: "E-mail" }, value: "a@b.com" },
          { id: "3", kind: "click", locator: { kind: "role", role: "button", name: "Entrar" } },
          { id: "4", kind: "expectUrl", url: "/dashboard" },
        ],
        "login com sucesso",
      ),
    );

    const gotoIdx = code.indexOf('await page.goto("/login");');
    const fillIdx = code.indexOf('await page.getByLabel("E-mail").fill("a@b.com");');
    const clickIdx = code.indexOf('await page.getByRole("button", { name: "Entrar" }).click();');
    const expectIdx = code.indexOf('await expect(page).toHaveURL("/dashboard");');

    expect([gotoIdx, fillIdx, clickIdx, expectIdx].every((i) => i >= 0)).toBe(true);
    expect(gotoIdx).toBeLessThan(fillIdx);
    expect(fillIdx).toBeLessThan(clickIdx);
    expect(clickIdx).toBeLessThan(expectIdx);
    expect(code.startsWith('import { test, expect } from "@playwright/test";')).toBe(true);
    expect(code).toContain('test("login com sucesso", async ({ page }) => {');
  });
});
