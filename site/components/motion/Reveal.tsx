"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cinematic rise — light and quick, weight without lag. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.62, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word editorial reveal for display headlines. */
export function RevealWords({
  text,
  className,
  delay = 0,
  gradient = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Chrome-sheen gradient applied per word. Kept on the static leaf (not the
   *  transformed span) so mobile WebKit still clips the gradient to the glyphs
   *  — an ancestor `background-clip: text` drops transformed descendants on iOS. */
  gradient?: boolean;
}) {
  const words = text.split(" ");
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  // Route pages mount behind the navigation curtain. Viewport observers can
  // therefore miss the opening heading before the curtain lifts, leaving its
  // clipped words below the baseline. A frame-delayed mount animation is
  // deterministic for every page and still honours reduced-motion settings.
  useEffect(() => {
    if (reduceMotion) {
      setReady(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden align-bottom ${
            i < words.length - 1 ? "mr-[0.18em]" : ""
          }`}
        >
          <motion.span
            aria-hidden
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: ready ? 0 : "110%" }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: delay + i * 0.04,
              ease: EASE,
            }}
          >
            {gradient ? (
              <span className="text-chrome-sheen inline-block">
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ) : (
              <>
                {w}
                {i < words.length - 1 ? " " : ""}
              </>
            )}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Hairline that draws itself in. */
export function DrawnLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className="hairline origin-left"
    />
  );
}
