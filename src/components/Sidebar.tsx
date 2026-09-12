import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar({ activeId, onChange }: { activeId: string; onChange: (id: string) => void }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white/60 px-3 py-5 md:flex dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-600/30">
          <Sparkles className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">QA Toolkit</span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors",
                active
                  ? "bg-violet-600/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
