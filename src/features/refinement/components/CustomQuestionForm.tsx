import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { CATEGORY_LABELS, QUESTION_CATEGORIES, STORY_TAGS, STORY_TAG_LABELS, type QuestionBankEntry, type QuestionCategory, type StoryTag } from "../types";

export function CustomQuestionForm({ onAdd }: { onAdd: (question: Omit<QuestionBankEntry, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<QuestionCategory>("escopo");
  const [tags, setTags] = useState<StoryTag[]>([]);

  function toggleTag(tag: StoryTag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleSubmit() {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), category, tags, isCustom: true });
    setText("");
    setTags([]);
    setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        + adicionar pergunta própria ao banco
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-dashed border-slate-300 p-3 dark:border-slate-700">
      <div>
        <label className={labelClass} htmlFor="custom-question-text">
          Pergunta
        </label>
        <input id="custom-question-text" className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
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
      <div>
        <p className={labelClass}>Só mostrar quando a história tiver (opcional):</p>
        <div className="flex flex-wrap gap-2">
          {STORY_TAGS.map((tag) => (
            <label
              key={tag}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-2.5 py-1 text-xs dark:border-slate-700 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-950"
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
