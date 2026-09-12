import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
}

export function Tabs({
  items,
  activeId,
  onChange,
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={item.id === activeId}
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
            item.id === activeId
              ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
