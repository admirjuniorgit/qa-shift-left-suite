import { beforeEach, describe, expect, it } from "vitest";
import { buildBackup, importBackup } from "./export-import";
import { loadTestCases, saveTestCases } from "@/features/test-builder/storage";
import type { TestCase } from "@/features/test-builder/types";

beforeEach(() => {
  localStorage.clear();
});

const sampleTestCase: TestCase = {
  id: "tc-1",
  name: "fluxo de exemplo",
  steps: [{ id: "s1", kind: "goto", url: "/" }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("export-import", () => {
  it("buildBackup inclui os dados atuais de cada feature", () => {
    saveTestCases([sampleTestCase]);
    const backup = buildBackup();
    expect(backup.version).toBe(1);
    expect(backup.data["test-cases"]).toEqual([sampleTestCase]);
  });

  it("importBackup restaura os dados e sobrescreve o estado atual", () => {
    saveTestCases([sampleTestCase]);
    const backup = buildBackup();

    saveTestCases([]);
    expect(loadTestCases()).toEqual([]);

    const result = importBackup(backup);
    expect(result.ok).toBe(true);
    expect(loadTestCases()).toEqual([sampleTestCase]);
  });

  it("rejeita um arquivo sem a estrutura esperada", () => {
    const result = importBackup({ foo: "bar" });
    expect(result.ok).toBe(false);
  });

  it("rejeita quando os dados de uma feature não batem com o schema", () => {
    const malformed = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: { "test-cases": [{ id: "sem os campos obrigatorios" }] },
    };
    const result = importBackup(malformed);
    expect(result.ok).toBe(false);
  });

  it("não altera nada no localStorage quando a importação é rejeitada", () => {
    saveTestCases([sampleTestCase]);
    const malformed = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: { "test-cases": [{ id: "invalido" }] },
    };
    importBackup(malformed);
    expect(loadTestCases()).toEqual([sampleTestCase]);
  });
});
