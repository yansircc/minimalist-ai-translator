"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="fixed left-4 top-4 z-50 p-2 text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
      aria-label="Toggle theme"
      data-test="theme-toggle"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-5 w-5" data-test="theme-icon-dark" />
      ) : (
        <Sun className="h-5 w-5" data-test="theme-icon-light" />
      )}
    </button>
  );
}
