import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { applyTheme, getStoredThemePreference, setStoredThemePreference, type ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];

export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePreference>("system");

  useEffect(() => {
    setPref(getStoredThemePreference());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (pref === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [pref]);

  function handleSelect(next: ThemePreference) {
    setPref(next);
    setStoredThemePreference(next);
    applyTheme(next);
  }

  return (
    <div className="inline-flex w-full rounded-lg bg-slate-100 p-0.5 text-xs dark:bg-white/5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleSelect(opt.value)}
          className={cn(
            "flex-1 rounded-md px-2.5 py-1.5 font-medium transition-colors",
            pref === opt.value
              ? "bg-white text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-300"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
