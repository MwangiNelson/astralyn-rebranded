"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * First-load curtain. Shows the lockup and a REAL progress bar that eases
 * toward milestones (fonts ready, window load) then lifts to reveal the site.
 * Fires window "astralyn:ready" so the hero can time its text animation to the
 * reveal. Shown once per session.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const target = useRef(10);
  const raf = useRef(0);
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

    const finish = () => {
      if (done.current) return;
      done.current = true;
      cancelAnimationFrame(raf.current);
      try {
        sessionStorage.setItem("astralyn_preloaded", "1");
      } catch {}
      window.dispatchEvent(new Event("astralyn:ready"));
      setShow(false);
    };

    let cur = 0;
    const tick = () => {
      cur += (target.current - cur) * 0.09;
      const shown = Math.min(100, cur);
      setProgress(shown);
      if (shown >= 99.3) {
        window.setTimeout(finish, 240);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    target.current = 24;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        target.current = Math.max(target.current, 66);
      });
    }
    const onLoad = () => {
      target.current = 100;
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    const hard = window.setTimeout(() => {
      target.current = 100;
    }, 3000);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(hard);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.85, ease: EASE } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-midnight"
        >
          <div className="grid-bg grid-bg-fade absolute inset-0 opacity-30" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
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
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="mt-4 font-mono text-[0.65rem] tracking-[0.3em] text-silver">
              {String(Math.round(progress)).padStart(3, "0")}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
