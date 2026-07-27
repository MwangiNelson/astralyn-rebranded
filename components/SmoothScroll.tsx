"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

/**
 * Light-touch smooth scroll. Uses lerp (not a long duration) so input feels
 * immediate and responsive — the site should feel fast, never heavy.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    // Expose the instance so full-screen overlays (e.g. the founder dossier)
    // can pause smooth scroll — otherwise Lenis keeps hijacking the wheel and
    // scrolls the page behind the modal instead of the modal itself.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
