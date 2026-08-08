export type ThemePreference = "light" | "dark";

const THEME_KEY = "medquiz.theme";

export function getStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveTheme(preference: ThemePreference | null): ThemePreference {
  if (preference) return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: ThemePreference) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: ThemePreference) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
  applyTheme(theme);
  window.dispatchEvent(new Event("medquiz-theme"));
}

export function toggleTheme() {
  const next: ThemePreference =
    resolveTheme(getStoredTheme()) === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
