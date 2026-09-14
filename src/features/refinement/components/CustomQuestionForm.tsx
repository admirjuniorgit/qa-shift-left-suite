import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { CATEGORY_LABELS, PHASE_LABELS, QUESTION_CATEGORIES, QUESTION_PHASES, STORY_TAGS, STORY_TAG_LABELS, type QuestionBankEntry, type QuestionCategory, type QuestionPhase, type StoryTag } from "../types";

export function CustomQuestionForm({
  defaultPhase = "refinamento",
  onAdd,
}: {
  defaultPhase?: QuestionPhase;
  onAdd: (question: Omit<QuestionBankEntry, "id">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<QuestionCategory>("escopo");
  const [phase, setPhase] = useState<QuestionPhase>(defaultPhase);
  const [tags, setTags] = useState<StoryTag[]>([]);

  function toggleTag(tag: StoryTag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleSubmit() {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), category, phase, tags, isCustom: true });
    setText("");
    setTags([]);
    setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-violet-600 hover:underline dark:text-violet-400">
        + adicionar pergunta própria ao banco
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-slate-300 p-3 dark:border-white/10">
      <div>
        <label className={labelClass} htmlFor="custom-question-text">
          Pergunta
        </label>
        <input id="custom-question-text" className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass} htmlFor="custom-question-phase">
            Fase
          </label>
          <select
            id="custom-question-phase"
            className={inputClass}
            value={phase}
            onChange={(e) => setPhase(e.target.value as QuestionPhase)}
          >
            {QUESTION_PHASES.map((p) => (
              <option key={p} value={p}>
                {PHASE_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="custom-question-category">
            Categoria
          </label>
          <select
            id="custom-question-category"
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as QuestionCategory)}
          >
            {QUESTION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <p className={labelClass}>Só mostrar quando a história tiver (opcional):</p>
        <div className="flex flex-wrap gap-2">
          {STORY_TAGS.map((tag) => (
            <label
              key={tag}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-2.5 py-1 text-xs dark:border-white/10 has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50 has-[:checked]:text-violet-700 dark:has-[:checked]:border-violet-500/50 dark:has-[:checked]:bg-violet-500/15 dark:has-[:checked]:text-violet-300"
            >
              <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} className="sr-only" />
              {STORY_TAG_LABELS[tag]}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit}>
          Adicionar ao banco
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
