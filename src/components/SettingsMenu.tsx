import { useState } from "react";
import { Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackupControls } from "@/components/BackupControls";

export function SettingsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Configurações"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
      >
        <Settings className="size-4" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar configurações"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-72 space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-lg dark:border-white/10 dark:bg-[#0f0f16]">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Tema</p>
              <ThemeToggle />
            </div>
            <div className="h-px bg-slate-200 dark:bg-white/10" />
            <BackupControls />
          </div>
        </>
      )}
    </div>
  );
}
