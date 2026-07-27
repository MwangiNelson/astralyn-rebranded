"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The site's motion vocabulary.
 *
 * It used to be one gesture — fade plus a 26px rise — applied to every section,
 * which is why the page read as static however much of it moved. These are four
 * distinct moves with four distinct jobs: type arrives, media is uncovered by
 * light, the camera drifts, and rules draw themselves. Weight and momentum, no
 * bounce, no overshoot.
 */

/** Cinematic rise. For copy and grouped content — never for media. */
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
  // framer drives these inline, so the global prefers-reduced-motion CSS rule
  // never reaches them — the travel has to be dropped here.
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: reduceMotion ? 0.2 : 0.62, delay, ease: EASE }}
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
  lit = false,
  chrome = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Marks this the emphasised line: the brightest phrase in the heading.
   *  Applied to the static leaf rather than the transformed span, so the halo
   *  is never resolved against a moving element. */
  lit?: boolean;
  /** Sets the line in chrome — the house accent. Like `lit`, this has to land
   *  on the static leaf: a transformed descendant escapes an ancestor's
   *  `background-clip: text` on mobile WebKit and the words vanish outright. */
  chrome?: boolean;
}) {
  const words = text.split(" ");
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  // Route pages mount behind the navigation curtain, so viewport observers can
  // miss the opening heading before the curtain lifts. A frame-delayed mount
  // animation is deterministic for every page and still honours reduced motion.
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
          /* pb/-mb extends the clipping box below the baseline so descenders
             (g, y, p) survive at rest while the word still rises from behind a
             hard edge. Without it every `display` headline is shaved. */
          className={`inline-block overflow-hidden pb-[0.18em] align-bottom -mb-[0.18em] ${
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
            {lit || chrome ? (
              <span
                className={`inline-block ${chrome ? "text-chrome-sheen" : "text-lit"}`}
              >
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

/**
 * MaskWipe — media is uncovered rather than faded in, as if a light source
 * passed across the plate. The wipe carries a lit leading edge so the reveal
 * reads as illumination instead of a transition.
 */
export function MaskWipe({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left";
}) {
  const reduceMotion = useReducedMotion();

  const closed =
    from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  const open = "inset(0% 0% 0% 0%)";

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ clipPath: closed }}
        whileInView={{ clipPath: open }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1.05, delay, ease: EASE }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
      {/* The light that did the uncovering, leaving after the plate is open. */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.9, 0] }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1.15, delay, ease: "easeOut", times: [0, 0.3, 1] }}
        className={
          from === "bottom"
            ? "pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70 shadow-[0_0_18px_rgba(245,245,240,0.6)]"
            : "pointer-events-none absolute inset-y-0 right-0 w-px bg-white/70 shadow-[0_0_18px_rgba(245,245,240,0.6)]"
        }
      />
    </div>
  );
}

/**
 * Parallax — the camera move the brief asks for. The element drifts against
 * the scroll across its own travel through the viewport, spring-smoothed so it
 * never ties itself to the raw wheel.
 */
export function Parallax({
  children,
  distance = 60,
  className = "",
}: {
  children: ReactNode;
  /** Total px of counter-travel across the full pass through the viewport. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduceMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Hairline that draws itself in. */
export function DrawnLine({ delay = 0 }: { delay?: number }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className="hairline" />;

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
