import { test, expect } from "@playwright/test";

test.describe("onboarding e tema", () => {
  test("mostra o onboarding na primeira visita e não mostra de novo depois de fechar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Bem-vindo ao QA Toolkit" })).toBeVisible();

    await page.getByRole("button", { name: "Entendi" }).click();
    await expect(page.getByRole("heading", { name: "Bem-vindo ao QA Toolkit" })).not.toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Bem-vindo ao QA Toolkit" })).not.toBeVisible();
  });

  test("alterna entre tema claro e escuro manualmente", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("qa-toolkit-onboarding-seen", "1"));
    await page.goto("/");

    await page.getByRole("button", { name: "Escuro", exact: true }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("button", { name: "Claro", exact: true }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
