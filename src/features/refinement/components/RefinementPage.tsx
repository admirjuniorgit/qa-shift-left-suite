import { useEffect, useState } from "react";
import { createId } from "@/lib/id";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { useToast } from "@/components/ui/toast-context";
import { BUILT_IN_QUESTIONS } from "../question-bank";
import { loadSessions, saveSessions } from "../storage";
import { DEFAULT_DOR_CHECKLIST_LABELS, type DoRChecklistItem, type RefinementSession, type StoryTag } from "../types";
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

export function RefinementPage() {
  const [sessions, setSessions] = useState<RefinementSession[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft());
  const notify = useToast();

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

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
              + nova sessão
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
          questions={BUILT_IN_QUESTIONS}
          storyTags={draft.storyTags}
          onToggleTag={toggleTag}
          selectedQuestionIds={draft.selectedQuestionIds}
          onToggleQuestion={toggleQuestion}
        />

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

        <Button onClick={handleSave}>{editingId ? "Salvar alterações" : "Salvar sessão"}</Button>
      </Card>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Histórico</h3>
        <SessionHistory sessions={sessions} onLoad={handleLoad} onDelete={handleDelete} />
      </div>
    </div>
  );
}
