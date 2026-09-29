"use client";

import { useEffect } from "react";

/**
 * CursorGlow — A global event delegation handler for cursor-reactive surface lighting.
 *
 * Any element with the CSS class `cursor-glow` will automatically receive
 * CSS custom properties `--glow-x` and `--glow-y` (in px) tracking the
 * cursor position relative to that element.
 *
 * The visual effect is defined entirely in globals.css via the `.cursor-glow` class.
 *
 * Mount this component ONCE at the root layout level.
 */
export function CursorGlow() {
  useEffect(() => {
    // Skip on touch/coarse pointer devices
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    // Skip if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Single delegated handler on the document — no per-element listeners needed
    const handlePointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        ".cursor-glow"
      ) as HTMLElement | null;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      target.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return null; // Pure side-effect component — renders nothing
}
