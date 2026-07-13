"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Phase = "idle" | "cover" | "reveal";

const COVER_DURATION = 620;

/**
 * A real navigation hand-off. Internal links are held briefly while the black
 * curtain covers the outgoing page; only then does the router change route.
 * The incoming page is therefore revealed from behind the same surface rather
 * than simply fading after it has already changed.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const onClick = (event: MouseEvent) => {
      if (
        phase !== "idle" ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.target ||
        link.hasAttribute("download") ||
        link.hasAttribute("data-no-transition")
      ) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      const nextPath = `${url.pathname}${url.search}${url.hash}`;
      const currentPath = `${current.pathname}${current.search}${current.hash}`;

      if (
        url.origin !== current.origin ||
        url.protocol !== current.protocol ||
        nextPath === currentPath ||
        url.pathname === current.pathname && url.search === current.search && url.hash
      ) {
        return;
      }

      event.preventDefault();
      setDestination(nextPath);
      setPhase("cover");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "cover" || !destination) return;

    const timer = window.setTimeout(() => router.push(destination), COVER_DURATION);
    return () => window.clearTimeout(timer);
  }, [destination, phase, router]);

  useEffect(() => {
    if (phase === "cover") setPhase("reveal");
    // Only reacts to an actual route change. `pathname` is intentionally the
    // dependency because all current navigation links are page-to-page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {!reduceMotion && phase !== "idle" && (
        <motion.div
          key="route-curtain"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[190] bg-black"
          initial={{ y: "100%" }}
          animate={{ y: phase === "cover" ? "0%" : "-100%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (phase === "reveal") {
              setDestination(null);
              setPhase("idle");
            }
          }}
        >
          <div className="absolute inset-0 grid-bg opacity-45" />
          <div className="absolute inset-x-0 top-0 h-px bg-white shadow-[0_0_22px_rgba(245,245,240,0.75)]" />
          <p className="absolute right-6 bottom-7 font-mono text-[0.58rem] tracking-[0.34em] text-white/70 uppercase md:right-12">
            Astralyn / loading
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
