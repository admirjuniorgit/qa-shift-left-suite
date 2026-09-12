import { useEffect, useState } from "react";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/toast-context";
import { createId } from "@/lib/id";
import { BUILT_IN_TEMPLATES } from "../templates-seed";
import { loadTemplates, saveTemplates } from "../storage";
import { templateToMarkdown } from "../markdown";
import type { ChecklistTemplate } from "../types";
import { TemplateList } from "./TemplateList";
import { TemplateEditor } from "./TemplateEditor";
import { MarkdownExportPreview } from "./MarkdownExportPreview";
import { ImportChecklistForm } from "./ImportChecklistForm";

export function QualityPracticesPage({ initialSelectedId }: { initialSelectedId?: string } = {}) {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const notify = useToast();

  useEffect(() => {
    const loaded = loadTemplates();
    setTemplates(loaded);
    const preferred = initialSelectedId && loaded.some((t) => t.id === initialSelectedId) ? initialSelectedId : loaded[0]?.id;
    setSelectedId(preferred ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persist(next: ChecklistTemplate[]) {
    setTemplates(next);
    saveTemplates(next);
  }

  const selected = templates.find((t) => t.id === selectedId);

  function handleChange(updated: ChecklistTemplate) {
    persist(templates.map((t) => (t.id === updated.id ? updated : t)));
  }

  function handleResetToBuiltIn() {
    if (!selected) return;
    const original = BUILT_IN_TEMPLATES.find((t) => t.id === selected.id);
    if (!original) return;
    persist(templates.map((t) => (t.id === selected.id ? original : t)));
    notify("Template restaurado para o original.");
  }

  function handleCreateCustom() {
    const template: ChecklistTemplate = { id: createId(), name: "Novo checklist", category: "custom", isBuiltIn: false, items: [] };
    persist([...templates, template]);
    setSelectedId(template.id);
  }

  function handleImportChecklist(parsed: { name: string; items: string[] }) {
    const template: ChecklistTemplate = {
      id: createId(),
      name: parsed.name,
      category: "custom",
      isBuiltIn: false,
      items: parsed.items.map((text) => ({ id: createId(), text })),
    };
    persist([...templates, template]);
    setSelectedId(template.id);
    notify(`Checklist "${template.name}" importado com ${template.items.length} item(ns).`);
  }

  function handleDeleteCustom(id: string) {
    persist(templates.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(templates[0]?.id ?? "");
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Templates</h3>
          <Button variant="ghost" size="sm" onClick={handleCreateCustom}>
            <Plus className="size-3.5" />
            Novo
          </Button>
        </div>
        <TemplateList templates={templates} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="mt-3">
          <ImportChecklistForm onImport={handleImportChecklist} />
        </div>
      </div>

      <Card className="space-y-4">
        {selected ? (
          <>
            <TemplateEditor
              template={selected}
              onChange={handleChange}
              onResetToBuiltIn={selected.isBuiltIn ? handleResetToBuiltIn : undefined}
            />
            {!selected.isBuiltIn && (
              <Button variant="ghost" size="sm" onClick={() => handleDeleteCustom(selected.id)}>
                <Trash2 className="size-3.5" />
                Excluir este checklist
              </Button>
            )}
            <MarkdownExportPreview markdown={templateToMarkdown(selected)} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-400">
            <ShieldCheck className="size-6" />
            Selecione ou crie um checklist.
          </div>
        )}
      </Card>
    </div>
  );
}
