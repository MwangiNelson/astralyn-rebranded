"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Field from "@/components/Field";
import type { Founder } from "@/lib/team";

const EASE = [0.22, 1, 0.36, 1] as const;
const CSS_EASE = "cubic-bezier(0.22,1,0.36,1)";
const LAYOUT_TX = { layout: { duration: 0.72, ease: EASE } } as const;

/* ------------------------------------------------------------
   EXPAND CARDS — the founders as one elastic strip.

   They used to be four half-page slabs in a 2×2 grid, which cost two
   full screens of scroll to say "there are four of us". Here they share
   a single band: the one under the cursor takes the room, the other
   three compress to sealed edges. Same monolith language — signature
   field, accent seam, fractures — a fifth of the height.

   Layout is driven by `flexGrow` rather than fixed rem widths, so the
   same component is a horizontal strip on desktop and a vertical
   accordion on mobile with no second set of measurements.

   The portrait keeps its `layoutId`, so clicking an open card still
   flies the face into the dossier takeover.
------------------------------------------------------------ */

/* How much room the open card takes relative to a closed one. With four
   founders this puts the open card at ~44% and each closed one at ~19% —
   enough that a closed card is still a slab you can read a name on, not a
   sliver. Push this past ~3 and the three closed cards collapse to edges. */
const EXPANDED_GROW = 2.4;

export default function ExpandCards({
  founders,
  onOpen,
}: {
  founders: Founder[];
  /** Fires when an already-expanded card is activated — the second
   *  gesture. Keeps "look at them" and "open the file" distinct. */
  onOpen: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex h-[74svh] min-h-[520px] w-full flex-col gap-2 md:h-[clamp(26rem,40vw,34rem)] md:min-h-0 md:flex-row md:gap-3">
      {founders.map((f, i) => {
        const open = i === expanded;

        return (
          <button
            key={f.n}
            type="button"
            /* The stretch is animated by CSS, not by framer, and that is
               load-bearing. `layoutId` on the portrait below implies layout
               projection: had framer driven flexGrow, it would have animated
               the card's width as a scaleX transform and the <img> inside
               would inherit it — the face visibly squashing and stretching on
               every hover. A plain CSS transition changes real layout, so the
               portrait re-covers its box each frame at true proportions, and
               framer only ever measures the card at rest — which is when the
               dossier morph needs the measurement anyway. */
            style={{
              flexGrow: open ? EXPANDED_GROW : 1,
              flexBasis: 0,
              /* Border and shadow ride along here rather than in a Tailwind
                 `transition-*` class — an inline transition replaces the
                 class outright, so declaring them apart would silently drop
                 the edge lighting. */
              transition: reduceMotion
                ? "none"
                : `flex-grow 0.66s ${CSS_EASE}, border-color 0.7s ${CSS_EASE}, box-shadow 0.7s ${CSS_EASE}`,
            }}
            /* Hover expands, but only for a real pointer. On touch the
               first tap expands and the second opens — otherwise a
               synthesised hover would open the dossier on first contact. */
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setExpanded(i);
            }}
            onFocus={() => setExpanded(i)}
            onClick={() => (open ? onOpen(i) : setExpanded(i))}
            aria-expanded={open}
            aria-label={
              open
                ? `Open the dossier of ${f.name}`
                : `${f.name}, ${f.title} — expand`
            }
            className="group relative min-h-0 min-w-0 cursor-pointer overflow-hidden border border-white/[0.07] bg-[linear-gradient(165deg,#0c0d0f_0%,#08090a_55%,#0b0c0e_100%)] text-left hover:border-white/20 focus-visible:border-white/40 aria-expanded:border-white/20 aria-expanded:shadow-[0_0_90px_rgba(245,246,247,0.10),inset_0_0_120px_rgba(245,246,247,0.04)]"
          >
            {/* Signature field — dormant until this founder has the floor */}
            <div
              aria-hidden
              className={`absolute inset-0 transition-opacity duration-1000 ${
                open ? "opacity-70" : "opacity-25"
              }`}
            >
              <Field variant={f.field} seed={23 + i * 9} />
            </div>

            {/* Portrait — shares a layoutId with the dossier so it flies to
                centre stage when the card is opened. */}
            {f.photo && (
              <motion.div
                layoutId={`portrait-${f.n}`}
                transition={LAYOUT_TX}
                className="absolute inset-0"
              >
                <img
                  src={f.photo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover object-[center_18%] grayscale contrast-[1.08] transition-opacity duration-1000 ${
                    open ? "opacity-100" : "opacity-45"
                  }`}
                />
              </motion.div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.12)_42%,rgba(8,9,10,0.92)_100%)]" />

            {/* Light leaking from below, tinted to the founder's accent */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background: `radial-gradient(ellipse at 50% 118%, ${f.accent}26, transparent 62%)`,
              }}
            />

            {/* The seam. Collapsed it is the whole card's identity — a
                single lit edge with nothing else to read. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-700 md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-px"
              style={{
                background: `linear-gradient(to right, transparent, ${f.accent}, transparent)`,
                opacity: open ? 0 : 0.5,
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* ---------------- IDENTITY ---------------- */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-xs text-steel md:text-sm">{f.n}</p>
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.15 }}
                      className="label flex items-center gap-2 whitespace-nowrap"
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: f.accent }}
                      />
                      Open Dossier
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Expanded: the full identity. */}
              <AnimatePresence mode="wait">
                {open && (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.18 } }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.18, ease: EASE }}
                    className="min-w-0"
                  >
                    <p className="label mb-3" style={{ color: f.accent }}>
                      Signal — {f.signal}
                    </p>
                    <h3 className="display text-2xl whitespace-nowrap md:text-4xl">
                      {f.name}
                    </h3>
                    <p className="mt-2 font-mono text-[0.6rem] tracking-[0.25em] text-silver uppercase md:text-[0.65rem]">
                      {f.title}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed: the name only. Set vertically on desktop, where
                  the card is a sliver; horizontally on mobile, where it is
                  a band. */}
              {!open && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.2 }}
                  className="min-w-0"
                >
                  <p className="display truncate text-lg text-silver transition-colors duration-500 group-hover:text-white md:hidden">
                    {f.name}
                  </p>
                  <p className="display hidden whitespace-nowrap text-xl text-silver transition-colors duration-500 group-hover:text-white md:block md:[writing-mode:vertical-rl] md:rotate-180">
                    {f.name}
                  </p>
                </motion.div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
