import { test, expect } from "./fixtures";

test.describe("boas práticas de qualidade", () => {
  test("edita um item de um template e exporta como Markdown", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Boas práticas" }).click();

    await page.getByRole("button", { name: /Definition of Done/ }).first().click();

    const firstItem = page.locator("ul li input").first();
    await firstItem.fill("Código revisado por 2 pessoas (item editado no teste)");

    await expect(page.locator("pre")).toContainText("Código revisado por 2 pessoas (item editado no teste)");

    await page.getByRole("button", { name: "Copiar" }).click();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain("Código revisado por 2 pessoas (item editado no teste)");
  });

  test("importa um checklist colando Markdown", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Boas práticas" }).click();

    await page.getByText("+ importar checklist de um Markdown").click();
    await page
      .getByPlaceholder(/Meu checklist/)
      .fill("# Checklist de acessibilidade\n- [ ] Contraste de cores ok\n- [ ] Navegável por teclado");
    await page.getByRole("button", { name: "Importar", exact: true }).click();

    await expect(page.getByRole("button", { name: /Checklist de acessibilidade/ }).first()).toBeVisible();
    const itemValues = await page.locator("main input").evaluateAll((inputs) => inputs.map((i) => (i as HTMLInputElement).value));
    expect(itemValues).toContain("Contraste de cores ok");
    expect(itemValues).toContain("Navegável por teclado");
  });
});
