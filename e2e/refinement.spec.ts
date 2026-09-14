import { test, expect } from "./fixtures";

test.describe("refinamento", () => {
  test("cria uma sessão, filtra perguntas, marca DoR e persiste após reload", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Ex: PROJ-123 — Permitir exportar relatório em PDF").fill("Minha história de teste");

    const paymentQuestion = "Dados sensíveis (pagamento, PII) estão envolvidos? Como são protegidos?";
    await expect(page.getByText(paymentQuestion)).not.toBeVisible();

    await page.getByText("Envolve pagamento/financeiro").click();
    await expect(page.getByText(paymentQuestion)).toBeVisible();
    await page.getByText(paymentQuestion).click();

    const dorLabel = "Critérios de aceite escritos e claros";
    await page.getByText(dorLabel).locator("..").getByRole("checkbox").check();

    await page.getByRole("button", { name: "Salvar sessão" }).click();
    await expect(page.getByText("1/6 prontos")).toBeVisible();

    await page.reload();
    await expect(page.getByText("Minha história de teste")).toBeVisible();
  });

  test("aba Planning mostra perguntas de planning em vez das de refinamento", async ({ page }) => {
    await page.goto("/");

    const refinementQuestion = "O que explicitamente NÃO faz parte desta entrega?";
    const planningQuestion = "Qual é o maior risco técnico dessa tarefa, e existe um plano B se ele se concretizar?";

    await expect(page.getByText(refinementQuestion)).toBeVisible();
    await expect(page.getByText(planningQuestion)).not.toBeVisible();

    await page.getByRole("tab", { name: "Planning" }).click();

    await expect(page.getByText(planningQuestion)).toBeVisible();
    await expect(page.getByText(refinementQuestion)).not.toBeVisible();
  });
});
