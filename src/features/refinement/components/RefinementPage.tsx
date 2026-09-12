import { useEffect, useState } from "react";
import { Plus, Save, Sparkles } from "lucide-react";
import { createId } from "@/lib/id";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { useToast } from "@/components/ui/toast-context";
import { BUILT_IN_QUESTIONS } from "../question-bank";
import { loadCustomQuestions, loadSessions, saveCustomQuestions, saveSessions } from "../storage";
import { DEFAULT_DOR_CHECKLIST_LABELS, type DoRChecklistItem, type QuestionBankEntry, type RefinementSession, type StoryTag } from "../types";
import { loadTemplates as loadQualityTemplates } from "@/features/quality-practices/storage";
import type { ChecklistTemplate } from "@/features/quality-practices/types";
import { QuestionBankFilter } from "./QuestionBankFilter";
import { DoRChecklist } from "./DoRChecklist";
import { SessionHistory } from "./SessionHistory";

function emptyDraft(): Omit<RefinementSession, "id" | "createdAt"> {
  return {
    storyTitle: "",
    storyTags: [],
    selectedQuestionIds: [],
    notes: "",
    dorChecklist: DEFAULT_DOR_CHECKLIST_LABELS.map((label) => ({ id: createId(), label, checked: false })),
  };
}

export function RefinementPage({ onOpenQualityTemplate }: { onOpenQualityTemplate: (templateId: string) => void }) {
  const [sessions, setSessions] = useState<RefinementSession[]>([]);
  const [customQuestions, setCustomQuestions] = useState<QuestionBankEntry[]>([]);
  const [qualityTemplates, setQualityTemplates] = useState<ChecklistTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft());
  const notify = useToast();
  const allQuestions = [...BUILT_IN_QUESTIONS, ...customQuestions];
  const suggestedTemplates = qualityTemplates.filter((t) => t.relatedTags?.some((tag) => draft.storyTags.includes(tag)));

  useEffect(() => {
    setSessions(loadSessions());
    setCustomQuestions(loadCustomQuestions());
    setQualityTemplates(loadQualityTemplates());
  }, []);

  function handleAddCustomQuestion(question: Omit<QuestionBankEntry, "id">) {
    const next = [...customQuestions, { ...question, id: createId() }];
    setCustomQuestions(next);
    saveCustomQuestions(next);
    notify("Pergunta adicionada ao banco.");
  }

  function handleDuplicateSession(session: RefinementSession) {
    const duplicate: RefinementSession = {
      ...session,
      id: createId(),
      storyTitle: `Cópia de ${session.storyTitle || "(sem título)"}`,
      createdAt: new Date().toISOString(),
      dorChecklist: session.dorChecklist.map((item) => ({ ...item, id: createId(), checked: false })),
    };
    const next = [...sessions, duplicate];
    setSessions(next);
    saveSessions(next);
    notify("Sessão duplicada.");
  }

  function toggleTag(tag: StoryTag) {
    setDraft((d) => ({
      ...d,
      storyTags: d.storyTags.includes(tag) ? d.storyTags.filter((t) => t !== tag) : [...d.storyTags, tag],
    }));
  }

  function toggleQuestion(id: string) {
    setDraft((d) => ({
      ...d,
      selectedQuestionIds: d.selectedQuestionIds.includes(id)
        ? d.selectedQuestionIds.filter((q) => q !== id)
        : [...d.selectedQuestionIds, id],
    }));
  }

  function toggleDorItem(id: string) {
    setDraft((d) => ({
      ...d,
      dorChecklist: d.dorChecklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    }));
  }

  function addDorItem(label: string) {
    const item: DoRChecklistItem = { id: createId(), label, checked: false };
    setDraft((d) => ({ ...d, dorChecklist: [...d.dorChecklist, item] }));
  }

  function removeDorItem(id: string) {
    setDraft((d) => ({ ...d, dorChecklist: d.dorChecklist.filter((i) => i.id !== id) }));
  }

  function handleSave() {
    if (!draft.storyTitle.trim()) {
      notify("Dê um título para a história antes de salvar.", "error");
      return;
    }
    const session: RefinementSession = {
      id: editingId ?? createId(),
      createdAt: editingId
        ? (sessions.find((s) => s.id === editingId)?.createdAt ?? new Date().toISOString())
        : new Date().toISOString(),
      ...draft,
    };
    const next = editingId ? sessions.map((s) => (s.id === editingId ? session : s)) : [...sessions, session];
    setSessions(next);
    saveSessions(next);
    setEditingId(session.id);
    notify("Sessão de refinamento salva.");
  }

  function handleNew() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function handleLoad(session: RefinementSession) {
    setEditingId(session.id);
    setDraft({
      storyTitle: session.storyTitle,
      storyTags: session.storyTags,
      selectedQuestionIds: session.selectedQuestionIds,
      notes: session.notes,
      dorChecklist: session.dorChecklist,
    });
  }

  function handleDelete(id: string) {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    saveSessions(next);
    if (editingId === id) handleNew();
  }

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{editingId ? "Editando sessão" : "Nova sessão de refinamento"}</h2>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={handleNew}>
              <Plus className="size-3.5" />
              Nova sessão
            </Button>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="story-title">
            Título da história / link do card
          </label>
          <input
            id="story-title"
            className={inputClass}
            value={draft.storyTitle}
            onChange={(e) => setDraft((d) => ({ ...d, storyTitle: e.target.value }))}
            placeholder="Ex: PROJ-123 — Permitir exportar relatório em PDF"
          />
        </div>

        <QuestionBankFilter
          questions={allQuestions}
          storyTags={draft.storyTags}
          onToggleTag={toggleTag}
          selectedQuestionIds={draft.selectedQuestionIds}
          onToggleQuestion={toggleQuestion}
          onAddCustomQuestion={handleAddCustomQuestion}
        />

        {suggestedTemplates.length > 0 && (
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm dark:border-violet-500/20 dark:bg-violet-500/10">
            <p className="mb-1 flex items-center gap-1.5 font-medium text-violet-800 dark:text-violet-300">
              <Sparkles className="size-3.5" />
              Checklists de qualidade sugeridos
            </p>
            <ul className="space-y-1">
              {suggestedTemplates.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <span>{t.name}</span>
                  <Button size="sm" variant="secondary" onClick={() => onOpenQualityTemplate(t.id)}>
                    Abrir
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="refinement-notes">
            Notas do refinamento
          </label>
          <textarea
            id="refinement-notes"
            className={inputClass}
            rows={4}
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            placeholder="Respostas, decisões e pontos em aberto..."
          />
        </div>

        <DoRChecklist items={draft.dorChecklist} onToggle={toggleDorItem} onAdd={addDorItem} onRemove={removeDorItem} />

        <Button onClick={handleSave}>
          <Save className="size-3.5" />
          {editingId ? "Salvar alterações" : "Salvar sessão"}
        </Button>
      </Card>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Histórico</h3>
        <SessionHistory
          sessions={sessions}
          allQuestions={allQuestions}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onDuplicate={handleDuplicateSession}
        />
      </div>
    </div>
  );
}
