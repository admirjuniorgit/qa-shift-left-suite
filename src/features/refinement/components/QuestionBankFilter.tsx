import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { CATEGORY_LABELS, PHASE_LABELS, QUESTION_PHASES, STORY_TAGS, STORY_TAG_LABELS, type QuestionBankEntry, type QuestionPhase, type StoryTag } from "../types";
import { filterQuestions } from "../question-bank";
import { CustomQuestionForm } from "./CustomQuestionForm";

export function QuestionBankFilter({
  questions,
  storyTags,
  onToggleTag,
  selectedQuestionIds,
  onToggleQuestion,
  onAddCustomQuestion,
}: {
  questions: QuestionBankEntry[];
  storyTags: StoryTag[];
  onToggleTag: (tag: StoryTag) => void;
  selectedQuestionIds: string[];
  onToggleQuestion: (id: string) => void;
  onAddCustomQuestion: (question: Omit<QuestionBankEntry, "id">) => void;
}) {
  const [phase, setPhase] = useState<QuestionPhase>("refinamento");
  const visible = filterQuestions(questions, storyTags, phase);
  const byCategory = new Map<string, QuestionBankEntry[]>();
  for (const q of visible) {
    byCategory.set(q.category, [...(byCategory.get(q.category) ?? []), q]);
  }

  return (
    <div className="space-y-4">
      <Tabs
        items={QUESTION_PHASES.map((p) => ({ id: p, label: PHASE_LABELS[p] }))}
        activeId={phase}
        onChange={(id) => setPhase(id as QuestionPhase)}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Características da história (filtra as perguntas relevantes)
        </p>
        <div className="flex flex-wrap gap-2">
          {STORY_TAGS.map((tag) => (
            <label
              key={tag}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-xs dark:border-white/10 has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50 has-[:checked]:text-violet-700 dark:has-[:checked]:border-violet-500/50 dark:has-[:checked]:bg-violet-500/15 dark:has-[:checked]:text-violet-300"
            >
              <input type="checkbox" checked={storyTags.includes(tag)} onChange={() => onToggleTag(tag)} className="sr-only" />
              {STORY_TAG_LABELS[tag]}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[...byCategory.entries()].map(([category, items]) => (
          <div key={category}>
            <h4 className="mb-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
            </h4>
            <ul className="space-y-1">
              {items.map((q) => (
                <li key={q.id}>
                  <label className="flex cursor-pointer items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={selectedQuestionIds.includes(q.id)}
                      onChange={() => onToggleQuestion(q.id)}
                    />
                    <span>{q.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {visible.length === 0 && <p className="text-sm text-slate-400">Nenhuma pergunta para os filtros atuais.</p>}
      </div>

      <CustomQuestionForm key={phase} defaultPhase={phase} onAdd={onAddCustomQuestion} />
    </div>
  );
}
