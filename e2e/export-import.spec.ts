import { test, expect } from "@playwright/test";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";

test.describe("backup e restauração", () => {
  test("exporta os dados, limpa o localStorage e restaura via importação", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("tab", { name: "Construtor de testes" }).click();
    await page.getByRole("button", { name: "+ novo" }).click();
    await page.getByLabel("Nome do fluxo de teste").fill("Fluxo para backup");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exportar dados" }).click();
    const download = await downloadPromise;
    const filePath = path.join(os.tmpdir(), `qa-toolkit-backup-e2e-${Date.now()}.json`);
    await download.saveAs(filePath);

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole("tab", { name: "Construtor de testes" }).click();
    await expect(page.getByRole("button", { name: /Fluxo para backup/ })).not.toBeVisible();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Importar dados" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    await expect(page.getByText("Backup importado")).toBeVisible();
    await page.waitForTimeout(1200); // aguarda o reload automático pós-importação

    await page.getByRole("tab", { name: "Construtor de testes" }).click();
    await expect(page.getByRole("button", { name: /Fluxo para backup/ })).toBeVisible();

    await fs.unlink(filePath).catch(() => {});
  });
});
