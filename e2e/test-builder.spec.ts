import { test, expect } from "@playwright/test";

test.describe("construtor de testes", () => {
  test("monta um fluxo com alguns passos e gera o código Playwright correspondente", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Construtor de testes" }).click();

    await page.getByRole("button", { name: "+ novo" }).click();

    // Passo 1: goto
    await page.getByPlaceholder("URL, ex: /login").fill("/login");
    await page.getByRole("button", { name: "Adicionar passo" }).click();

    // Passo 2: click por texto
    await page.getByLabel("Tipo de passo").selectOption("click");
    await page.getByPlaceholder("Texto visível, ex: Entrar").fill("Entrar");
    await page.getByRole("button", { name: "Adicionar passo" }).click();

    await expect(page.getByText('Ir para "/login"')).toBeVisible();
    await expect(page.getByText('texto "Entrar"')).toBeVisible();

    const code = page.locator("pre code");
    await expect(code).toContainText('await page.goto("/login");');
    await expect(code).toContainText('await page.getByText("Entrar").click();');
  });
});
