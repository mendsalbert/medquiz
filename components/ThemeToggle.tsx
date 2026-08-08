"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  getStoredTheme,
  resolveTheme,
  setTheme,
  type ThemePreference,
} from "@/lib/theme";

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [theme, setThemeState] = useState<ThemePreference>("light");

  useEffect(() => {
    function sync() {
      setThemeState(resolveTheme(getStoredTheme()));
    }
    sync();
    window.addEventListener("medquiz-theme", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("medquiz-theme", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function onToggle() {
    const next: ThemePreference = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal/15 bg-surface text-ink transition-colors hover:border-teal/30 ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
