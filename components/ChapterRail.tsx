"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ChapterRail — the spine of the scroll.
 *
 * The homepage is a seven-chapter journey with no way to tell where you are in
 * it. This is that instrument: a hairline rail of ticks pinned to the left
 * edge, one per chapter, where the tick you are inside extends and lights and
 * names itself. Wayfinding first; the sense of travelling through a documentary
 * comes free with it.
 *
 * Reads any element carrying `data-chapter="Label"`. It deliberately does not
 * write `id`s onto those elements — mutating server-rendered attributes trips
 * React's hydration check — so jumping is done by scrolling the captured node.
 */
export default function ChapterRail() {
  const [labels, setLabels] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(false);
  const nodes = useRef<HTMLElement[]>([]);
  const pathname = usePathname();

  // Lives in the layout, so it re-reads the document on every route change
  // rather than only on mount.
  useEffect(() => {
    const found = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter]"),
    );
    nodes.current = found;
    setLabels(found.map((n) => n.dataset.chapter ?? ""));
    setActive(0);

    if (!found.length) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const mark = window.innerHeight * 0.42;
      let next = 0;
      found.forEach((n, i) => {
        if (n.getBoundingClientRect().top <= mark) next = i;
      });
      setActive(next);
      // The rail stays out of the way until the visitor has left the hero.
      setLit(window.scrollY > window.innerHeight * 0.75);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const jump = useCallback((i: number) => {
    const node = nodes.current[i];
    if (!node) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement) => void } })
      .__lenis;
    if (lenis) lenis.scrollTo(node);
    else node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (labels.length < 2) return null;

  return (
    <nav
      aria-label="Chapters"
      className={`pointer-events-none fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-700 lg:flex ${
        lit ? "opacity-100" : "opacity-0"
      }`}
    >
      {labels.map((label, i) => {
        const on = i === active;
        return (
          <button
            key={label + i}
            type="button"
            onClick={() => jump(i)}
            aria-current={on ? "true" : undefined}
            className="group pointer-events-auto flex items-center gap-3 py-1 text-left"
          >
            <span
              className={`block h-px transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                on
                  ? "w-8 bg-white shadow-[0_0_12px_rgba(245,245,240,0.7)]"
                  : "w-3 bg-white/25 group-hover:w-5 group-hover:bg-white/60"
              }`}
            />
            <span
              className={`font-mono text-[0.58rem] tracking-[0.26em] whitespace-nowrap uppercase transition-all duration-500 ${
                on
                  ? "text-white opacity-100"
                  : "text-silver opacity-0 group-hover:opacity-70"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
