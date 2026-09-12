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
    <div className="inline-flex rounded-md border border-slate-300 text-xs dark:border-slate-700">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleSelect(opt.value)}
          className={cn(
            "px-2.5 py-1 first:rounded-l-md last:rounded-r-md",
            pref === opt.value
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
