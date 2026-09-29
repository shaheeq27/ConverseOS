"use client";

import { useEffect, useRef } from "react";

const POOL_SIZE = 40;

export function MouseFollowGlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on devices with a fine pointer (mouse)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      if (containerRef.current) containerRef.current.style.display = "none";
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Initialize particle pool for soft brush effect
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const el = document.createElement("div");
      el.className = "glow-particle";
      container.appendChild(el);
      particles.push(el);
    }

    let currentIndex = 0;
    let lastX = -1000;
    let lastY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastX === -1000) {
        lastX = x;
        lastY = y;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only stamp a new particle if we've moved a minimum distance
      // This prevents stationary hotspots and spreads the trail evenly
      if (dist > 18) {
        const el = particles[currentIndex];
        currentIndex = (currentIndex + 1) % POOL_SIZE;

        const angle = Math.atan2(dy, dx);
        
        // Faster movement stretches the particle to fill gaps
        const stretchX = Math.min(Math.max(1 + dist / 35, 1), 3);
        const stretchY = Math.max(1 - dist / 150, 0.6);

        // Calculate dynamic duration: slower movement = longer fading lifetime
        // dist is ~18 for slow/regular movement, and 50-100+ for fast movement
        const duration = Math.max(0.6, 2.0 - (dist - 18) * 0.025).toFixed(2);

        // 1. Instantly snap to current position
        el.style.transition = "none";
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad) scaleX(${stretchX}) scaleY(${stretchY})`;
        el.style.opacity = "1";

        // Force DOM reflow so the instant snap applies immediately
        void el.offsetWidth;

        // 2. Trigger the CSS transition to fade out and slightly expand
        el.style.transition = `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`;
        el.style.opacity = "0";
        
        // Slowly drift slightly in the direction of movement while fading out
        el.style.transform = `translate3d(${x + dx * 0.4}px, ${y + dy * 0.4}px, 0) rotate(${angle}rad) scaleX(${stretchX * 1.15}) scaleY(${stretchY * 1.15})`;

        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden mouse-follow-container"
      aria-hidden="true"
    />
  );
}
