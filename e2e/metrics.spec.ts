import { test, expect } from "./fixtures";

test.describe("métricas de qualidade", () => {
  test("filtra por categoria e exporta o guia como Markdown", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Métricas" }).click();

    await expect(page.getByRole("heading", { name: "Pass rate" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Lead time for changes" })).toBeVisible();

    await page.getByRole("tab", { name: "Fluxo de entrega" }).click();
    await expect(page.getByRole("heading", { name: "Pass rate" })).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "Lead time for changes" })).toBeVisible();

    await page.getByRole("button", { name: "Copiar" }).click();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain("## Fluxo de entrega");
    expect(clipboardText).toContain("### Lead time for changes");
    expect(clipboardText).not.toContain("### Pass rate");
  });
});
