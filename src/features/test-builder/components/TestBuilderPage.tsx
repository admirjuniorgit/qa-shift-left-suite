import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";
import { generatePlaywrightTest } from "../codegen";
import { loadTestCases, saveTestCases } from "../storage";
import type { Step, TestCase } from "../types";
import { StepForm } from "./StepForm";
import { StepList } from "./StepList";
import { CodePreview } from "./CodePreview";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "teste"
  );
}

export function TestBuilderPage() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const loaded = loadTestCases();
    setTestCases(loaded);
    setSelectedId(loaded[0]?.id ?? "");
  }, []);

  function persist(next: TestCase[]) {
    setTestCases(next);
    saveTestCases(next);
  }

  const selected = testCases.find((tc) => tc.id === selectedId);

  function updateSelected(mutate: (tc: TestCase) => TestCase) {
    if (!selected) return;
    const updated = mutate({ ...selected, updatedAt: new Date().toISOString() });
    persist(testCases.map((tc) => (tc.id === selected.id ? updated : tc)));
  }

  function handleCreate() {
    const now = new Date().toISOString();
    const testCase: TestCase = { id: createId(), name: "Novo fluxo de teste", steps: [], createdAt: now, updatedAt: now };
    persist([...testCases, testCase]);
    setSelectedId(testCase.id);
  }

  function handleDelete(id: string) {
    persist(testCases.filter((tc) => tc.id !== id));
    if (selectedId === id) setSelectedId(testCases[0]?.id ?? "");
  }

  function handleAddStep(step: Step) {
    updateSelected((tc) => ({ ...tc, steps: [...tc.steps, step] }));
  }

  function handleRemoveStep(index: number) {
    updateSelected((tc) => ({ ...tc, steps: tc.steps.filter((_, i) => i !== index) }));
  }

  function handleMoveStep(index: number, direction: -1 | 1) {
    updateSelected((tc) => {
      const steps = [...tc.steps];
      const target = index + direction;
      if (target < 0 || target >= steps.length) return tc;
      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...tc, steps };
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Fluxos de teste</h3>
          <Button variant="ghost" size="sm" onClick={handleCreate}>
            + novo
          </Button>
        </div>
        <ul className="space-y-1">
          {testCases.map((tc) => (
            <li key={tc.id}>
              <button
                onClick={() => setSelectedId(tc.id)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-sm",
                  tc.id === selectedId
                    ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                {tc.name}
                <span className="block text-xs text-slate-400">{tc.steps.length} passo(s)</span>
              </button>
            </li>
          ))}
          {testCases.length === 0 && <p className="text-sm text-slate-400">Nenhum fluxo ainda.</p>}
        </ul>
      </div>

      <Card className="space-y-4">
        {selected ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <input
                aria-label="Nome do fluxo de teste"
                className="w-full rounded-md border-none bg-transparent text-base font-semibold focus:outline-none"
                value={selected.name}
                onChange={(e) => updateSelected((tc) => ({ ...tc, name: e.target.value }))}
              />
              <Button variant="ghost" size="sm" onClick={() => handleDelete(selected.id)}>
                Excluir
              </Button>
            </div>

            <StepList steps={selected.steps} onMove={handleMoveStep} onRemove={handleRemoveStep} />
            <StepForm onAdd={handleAddStep} />
            <CodePreview code={generatePlaywrightTest(selected)} fileName={`${slugify(selected.name)}.spec.ts`} />
          </>
        ) : (
          <p className="text-sm text-slate-400">Crie um fluxo de teste para começar.</p>
        )}
      </Card>
    </div>
  );
}
