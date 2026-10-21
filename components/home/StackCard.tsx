"use client";

import { useEffect, useRef } from "react";

/**
 * On phones the homepage reads as a stack of full-screen cards: each section
 * pins with position: sticky and the next one slides over it on native scroll.
 * A card taller than the screen pins by its bottom edge (a negative `top`), so
 * it scrolls through in full before the next covers it. Scroll-jacking was the
 * rejected alternative; sticky keeps the browser's own scroll physics.
 * The CSS applies only below md and without reduced motion, so desktop and
 * reduced-motion visitors get a plain stacked page.
 */
export default function StackCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pin = () => {
      el.style.setProperty("--pin", `${Math.min(0, window.innerHeight - el.offsetHeight)}px`);
    };
    const ro = new ResizeObserver(pin);
    ro.observe(el);
    window.addEventListener("resize", pin);
    pin();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", pin);
    };
  }, []);

  return (
    <div ref={ref} className={`stack-card ${className}`}>
      {children}
    </div>
  );
}
