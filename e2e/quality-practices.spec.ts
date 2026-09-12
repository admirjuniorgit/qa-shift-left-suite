import { test, expect } from "@playwright/test";

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
});
