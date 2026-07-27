"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The entire budget the curtain is allowed, in ms. */
const BUDGET = 900;

/**
 * First-load curtain. Shown once per session.
 *
 * The previous version eased a counter asymptotically toward whatever the load
 * state implied, driven purely by requestAnimationFrame. Two problems: the
 * approach never actually arrives, and rAF is throttled hard in a background
 * tab — open the site in a new tab, come back, and the curtain is still sitting
 * there. Measured at over twenty seconds.
 *
 * So: a fixed, honest 900ms of held attention, driven from wall-clock time and
 * guaranteed to end by a timer that fires whether or not frames are being
 * painted. Fast enough to read as deliberate, never as a wait.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  // A curtain that lifts is a reveal; a curtain lifting in a tab nobody is
  // looking at is just a frame-throttled animation waiting to strand. If the
  // page finishes while hidden, drop it outright.
  const [instant, setInstant] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("astralyn_preloaded");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce) {
      setShow(false);
      window.dispatchEvent(new Event("astralyn:ready"));
      return;
    }

    const start = performance.now();
    let raf = 0;

    const finish = () => {
      if (done.current) return;
      done.current = true;
      cancelAnimationFrame(raf);
      setProgress(100);
      if (document.hidden) setInstant(true);
      try {
        sessionStorage.setItem("astralyn_preloaded", "1");
      } catch {}
      window.dispatchEvent(new Event("astralyn:ready"));
      setShow(false);
    };

    // Wall-clock, so a throttled or skipped frame can never stall the count.
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / BUDGET);
      setProgress(p * 100);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // The guarantee. Timers keep firing when frames do not.
    const hard = window.setTimeout(finish, BUDGET);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hard);
    };
  }, []);

  // Finished while hidden: leave the tree outright. Setting the exit duration
  // to zero is not enough — framer still needs one animation frame to unmount,
  // and a hidden tab is exactly where frames stop arriving, so the curtain
  // would sit at full height until the visitor came back and focused it.
  if (!show && instant) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: instant ? 0 : 0.8, ease: EASE },
          }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-midnight"
        >
          <div className="lit-room absolute inset-0" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative flex flex-col items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/astralyn_logo.svg"
              alt=""
              aria-hidden
              className="h-16 w-auto md:h-20"
            />
            <span className="display mt-6 text-2xl tracking-[0.42em] text-white md:text-3xl">
              ASTRALYN
            </span>
            <span className="label mt-3">Technology House</span>

            <div className="mt-10 h-px w-56 overflow-hidden bg-white/12 md:w-72">
              <div
                className="h-full bg-white shadow-[0_0_12px_rgba(245,245,240,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="mt-4 font-mono text-[0.65rem] tracking-[0.3em] text-silver tabular-nums">
              {String(Math.round(progress)).padStart(3, "0")}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
