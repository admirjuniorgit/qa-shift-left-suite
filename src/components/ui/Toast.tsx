import { useCallback, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ToastContext, type ToastTone } from "./toast-context";

type Toast = { id: string; message: string; tone: ToastTone };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, tone: ToastTone = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm shadow-lg backdrop-blur-sm",
              t.tone === "success"
                ? "border-white/10 bg-slate-900/95 text-slate-100 dark:border-white/10 dark:bg-slate-100/95 dark:text-slate-900"
                : "border-red-500/20 bg-red-600 text-white",
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
