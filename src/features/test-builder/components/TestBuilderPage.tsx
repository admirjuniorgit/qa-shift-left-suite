import { useEffect, useState } from "react";
import { Copy, Download, FlaskConical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";
import { downloadTextFile } from "@/lib/download";
import { useToast } from "@/components/ui/toast-context";
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
  const notify = useToast();

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

  function handleDuplicateTestCase(id: string) {
    const source = testCases.find((tc) => tc.id === id);
    if (!source) return;
    const now = new Date().toISOString();
    const copy: TestCase = {
      id: createId(),
      name: `Cópia de ${source.name}`,
      steps: source.steps.map((step) => ({ ...step, id: createId() })),
      createdAt: now,
      updatedAt: now,
    };
    persist([...testCases, copy]);
    setSelectedId(copy.id);
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

  function handleDuplicateStep(index: number) {
    updateSelected((tc) => {
      const steps = [...tc.steps];
      const copy: Step = { ...steps[index], id: createId() };
      steps.splice(index + 1, 0, copy);
      return { ...tc, steps };
    });
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

  function handleReorderStep(fromIndex: number, toIndex: number) {
    updateSelected((tc) => {
      const steps = [...tc.steps];
      const [moved] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, moved);
      return { ...tc, steps };
    });
  }

  function handleDownloadAll() {
    if (testCases.length === 0) return;
    testCases.forEach((tc, i) => {
      setTimeout(() => downloadTextFile(`${slugify(tc.name)}.spec.ts`, generatePlaywrightTest(tc), "text/typescript"), i * 150);
    });
    notify(`Baixando ${testCases.length} arquivo(s)...`);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Fluxos de teste</h3>
          <Button variant="ghost" size="sm" onClick={handleCreate}>
            <Plus className="size-3.5" />
            Novo
          </Button>
        </div>
        <ul className="space-y-1">
          {testCases.map((tc) => (
            <li key={tc.id} className="group flex items-center gap-1">
              <button
                onClick={() => setSelectedId(tc.id)}
                className={cn(
                  "min-w-0 flex-1 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  tc.id === selectedId
                    ? "bg-violet-600/10 font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                    : "hover:bg-slate-100 dark:hover:bg-white/5",
                )}
              >
                <span className="block truncate">{tc.name}</span>
                <span className="block text-xs text-slate-400">{tc.steps.length} passo(s)</span>
              </button>
              <button
                onClick={() => handleDuplicateTestCase(tc.id)}
                className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-slate-400 opacity-0 hover:bg-slate-100 hover:text-violet-600 group-hover:opacity-100 dark:hover:bg-white/5"
                aria-label={`Duplicar ${tc.name}`}
                title="Duplicar fluxo"
              >
                <Copy className="size-3.5" />
              </button>
            </li>
          ))}
          {testCases.length === 0 && (
            <li className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-white/10">
              <FlaskConical className="size-5" />
              Nenhum fluxo ainda.
            </li>
          )}
        </ul>
        {testCases.length > 1 && (
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={handleDownloadAll}>
            <Download className="size-3.5" />
            Baixar todos (.spec.ts)
          </Button>
        )}
      </div>

      <Card className="space-y-4">
        {selected ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <input
                aria-label="Nome do fluxo de teste"
                className="w-full rounded-lg border-none bg-transparent text-base font-semibold focus:outline-none"
                value={selected.name}
                onChange={(e) => updateSelected((tc) => ({ ...tc, name: e.target.value }))}
              />
              <Button variant="ghost" size="sm" onClick={() => handleDelete(selected.id)}>
                <Trash2 className="size-3.5" />
                Excluir
              </Button>
            </div>

            <StepList
              steps={selected.steps}
              onMove={handleMoveStep}
              onRemove={handleRemoveStep}
              onDuplicate={handleDuplicateStep}
              onReorder={handleReorderStep}
            />
            <StepForm onAdd={handleAddStep} />
            <CodePreview code={generatePlaywrightTest(selected)} fileName={`${slugify(selected.name)}.spec.ts`} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-400">
            <FlaskConical className="size-6" />
            Crie um fluxo de teste para começar.
          </div>
        )}
      </Card>
    </div>
  );
}
