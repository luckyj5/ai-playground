"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("scentsense-theme", next ? "dark" : "light");
    } catch {
      // ignore
    }
    track("theme_toggle", { mode: next ? "dark" : "light" });
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="btn-ghost h-10 w-10 rounded-full p-0"
      >
        ◐
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="btn-ghost h-10 w-10 rounded-full p-0 text-lg"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
