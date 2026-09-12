import { cn } from "@/lib/cn";
import { CATEGORY_LABELS, type ChecklistTemplate } from "../types";

export function TemplateList({
  templates,
  selectedId,
  onSelect,
}: {
  templates: ChecklistTemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-1">
      {templates.map((t) => (
        <li key={t.id}>
          <button
            onClick={() => onSelect(t.id)}
            className={cn(
              "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
              t.id === selectedId
                ? "bg-violet-600/10 font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                : "hover:bg-slate-100 dark:hover:bg-white/5",
            )}
          >
            {t.name}
            <span className="block text-xs text-slate-400">{CATEGORY_LABELS[t.category]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
