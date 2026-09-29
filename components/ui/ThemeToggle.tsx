"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * ThemeToggle — A compact sun/moon toggle for switching between dark and light themes.
 * Place inside the sidebar, header, or any navigation area.
 */
export function ThemeToggle({ collapsed = false, variant = "default" }: { collapsed?: boolean; variant?: "default" | "highlighted" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // SSR placeholder to prevent layout shift
    return (
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="w-5 h-5" />
        {!collapsed && <span className="text-sm font-medium opacity-0">Theme</span>}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    // Also persist directly for the flash-prevention script
    try { localStorage.setItem("theme", next); } catch {}
  };

  const baseClasses = "cursor-glow cursor-glow-sm flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cyan)]/50";
  const defaultClasses = "border border-transparent hover:bg-[var(--white-alpha-05)] hover:border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]";
  const highlightedClasses = "border border-[var(--white-alpha-10)] bg-[var(--white-alpha-05)] text-[var(--color-text-primary)] hover:bg-[var(--white-alpha-10)] hover:border-[var(--color-border-hover)] shadow-sm";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`${baseClasses} ${variant === "highlighted" ? highlightedClasses : defaultClasses}`}
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {isDark ? (
          // Moon icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          // Sun icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </span>
      {!collapsed && (
        <span className="text-sm font-medium">{isDark ? "Dark" : "Light"}</span>
      )}
    </button>
  );
}
