import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function preferredTheme(): Theme {
  try {
    const stored = localStorage.getItem("swapmeet-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore storage access failures
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(preferredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("swapmeet-theme", theme);
    } catch {
      // ignore storage access failures
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      aria-label={theme === "light" ? "Switch to Night mode" : "Switch to Day mode"}
      className="inline-flex items-center gap-token-2 rounded-pill border-[length:var(--hairline)] border-solid border-line px-token-3 py-token-2 text-label uppercase text-fg"
    >
      {theme === "light" ? "🌙 Night" : "☀️ Day"}
    </button>
  );
}
