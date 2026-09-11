import { test, expect } from "@playwright/test";

test.describe("landing page", () => {
  test("mostra o pitch do produto e CTAs principais", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Qualidade desde o refinamento/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Criar conta grátis" })).toBeVisible();
  });

  test("navega para a tela de login", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Entrar" }).first().click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  test("navega para a tela de criação de conta", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Criar conta grátis" }).click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByLabel("Nome")).toBeVisible();
    await expect(page.getByRole("button", { name: "Criar conta" })).toBeVisible();
  });
});
