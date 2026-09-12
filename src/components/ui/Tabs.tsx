import type { ComponentType } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
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
    <div role="tablist" className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-white/5">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-white text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-300"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
            )}
          >
            {Icon && <Icon className="size-4" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
