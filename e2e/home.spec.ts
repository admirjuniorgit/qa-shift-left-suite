import { test, expect } from "./fixtures";

test.describe("início (dashboard)", () => {
  test("é a tela inicial e os atalhos levam direto pra aba e fase certas", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "O que você precisa fazer agora?" })).toBeVisible();

    const planningCard = page.getByText("Nova sessão de planning").locator("..");
    await planningCard.getByRole("button", { name: "Ir" }).click();

    await expect(page.getByRole("tab", { name: "Planning", exact: true })).toHaveAttribute("aria-selected", "true");
  });

  test("sessão com DoR incompleto aparece no início e 'Continuar' abre ela em edição", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Refinamento" }).click();

    await page.getByPlaceholder("Ex: PROJ-123 — Permitir exportar relatório em PDF").fill("História pendente no dashboard");
    await page.getByRole("button", { name: "Salvar sessão" }).click();
    await expect(page.getByText("0/6 prontos")).toBeVisible();

    await page.getByRole("tab", { name: "Início" }).click();
    await expect(page.getByRole("heading", { name: "Sessões com Definition of Ready pendente" })).toBeVisible();
    await expect(page.getByText("História pendente no dashboard")).toBeVisible();
    await expect(page.getByText("0/6 itens prontos")).toBeVisible();

    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("heading", { name: "Editando sessão" })).toBeVisible();
    await expect(page.getByPlaceholder("Ex: PROJ-123 — Permitir exportar relatório em PDF")).toHaveValue(
      "História pendente no dashboard",
    );
  });
});
