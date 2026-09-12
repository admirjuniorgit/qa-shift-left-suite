export type ThemePreference = "light" | "dark" | "system";

const KEY = "qa-toolkit-theme";

export function getStoredThemePreference(): ThemePreference {
  const value = localStorage.getItem(KEY);
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

export function setStoredThemePreference(pref: ThemePreference): void {
  localStorage.setItem(KEY, pref);
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(pref: ThemePreference): void {
  const isDark = pref === "dark" || (pref === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", isDark);
}
