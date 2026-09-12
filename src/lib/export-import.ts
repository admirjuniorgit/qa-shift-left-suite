import { z } from "zod";
import { getItem, setItem } from "./storage";
import { testBuilderBackupEntry } from "@/features/test-builder/storage";
import { refinementBackupEntries } from "@/features/refinement/storage";
import { qualityPracticesBackupEntry } from "@/features/quality-practices/storage";

const BACKUP_ENTRIES = [testBuilderBackupEntry, ...refinementBackupEntries, qualityPracticesBackupEntry];

const backupSchema = z
  .object({
    version: z.literal(1),
    exportedAt: z.string(),
    data: z.record(z.string(), z.unknown()),
  })
  .strict();

export type Backup = z.infer<typeof backupSchema>;

export function buildBackup(): Backup {
  const data: Record<string, unknown> = {};
  for (const entry of BACKUP_ENTRIES) {
    data[entry.key] = getItem(entry.key, []);
  }
  return { version: 1, exportedAt: new Date().toISOString(), data };
}

export type ImportResult = { ok: true } | { ok: false; error: string };

export function importBackup(raw: unknown): ImportResult {
  const parsed = backupSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Arquivo de backup inválido: estrutura não reconhecida." };
  }

  for (const entry of BACKUP_ENTRIES) {
    const value = parsed.data.data[entry.key];
    if (value === undefined) continue;
    const entryResult = entry.schema.safeParse(value);
    if (!entryResult.success) {
      return { ok: false, error: `Arquivo de backup inválido: dados de "${entry.key}" não batem com o formato esperado.` };
    }
  }

  for (const entry of BACKUP_ENTRIES) {
    const value = parsed.data.data[entry.key];
    if (value === undefined) continue;
    setItem(entry.key, value);
  }

  return { ok: true };
}

export function backupFileName(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `qa-toolkit-backup-${date}.json`;
}

export function downloadBackup(): void {
  const backup = buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = backupFileName();
  link.click();
  URL.revokeObjectURL(url);
}
