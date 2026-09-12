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
              "w-full rounded-md px-3 py-2 text-left text-sm",
              t.id === selectedId
                ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "hover:bg-slate-100 dark:hover:bg-slate-800",
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
