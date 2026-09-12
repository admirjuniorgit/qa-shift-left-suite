import { CATEGORY_LABELS, STORY_TAGS, STORY_TAG_LABELS, type QuestionBankEntry, type StoryTag } from "../types";
import { filterQuestions } from "../question-bank";

export function QuestionBankFilter({
  questions,
  storyTags,
  onToggleTag,
  selectedQuestionIds,
  onToggleQuestion,
}: {
  questions: QuestionBankEntry[];
  storyTags: StoryTag[];
  onToggleTag: (tag: StoryTag) => void;
  selectedQuestionIds: string[];
  onToggleQuestion: (id: string) => void;
}) {
  const visible = filterQuestions(questions, storyTags);
  const byCategory = new Map<string, QuestionBankEntry[]>();
  for (const q of visible) {
    byCategory.set(q.category, [...(byCategory.get(q.category) ?? []), q]);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Características da história (filtra as perguntas relevantes)
        </p>
        <div className="flex flex-wrap gap-2">
          {STORY_TAGS.map((tag) => (
            <label
              key={tag}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-xs dark:border-slate-700 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-950"
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
    </div>
  );
}
