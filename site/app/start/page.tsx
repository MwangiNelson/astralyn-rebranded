"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RevealWords } from "@/components/motion/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------
   START SOMETHING EXTRAORDINARY — the intake sequence.
   Four movements. One signal. No noise.
------------------------------------------------------------ */

const KINDS = [
  {
    id: "venture",
    title: "New Venture",
    line: "An idea. Dormant. Waiting for power.",
  },
  {
    id: "product",
    title: "Existing Product",
    line: "Momentum that needs engineering.",
  },
  {
    id: "enterprise",
    title: "Enterprise Transformation",
    line: "Systems that need rethinking. At scale.",
  },
];

const FORCES = [
  { id: "strategy", title: "Strategy", line: "Direction before motion." },
  { id: "design", title: "Design", line: "Power, made human." },
  { id: "technology", title: "Technology", line: "Systems that hold weight." },
];

const SCALES = [
  {
    id: "focused",
    title: "Focused",
    line: "A precise engagement. Weeks, not months.",
  },
  {
    id: "extended",
    title: "Extended",
    line: "A product, end to end. A quarter or more.",
  },
  {
    id: "transformative",
    title: "Transformative",
    line: "A long-term partnership. Measured in years.",
  },
];

const STEP_LABELS = [
  "What are we powering?",
  "Which forces?",
  "What scale?",
  "The signal",
];

const TOTAL = 4;

/* Selectable panel — dark, hairline, illuminates when chosen. */
function Choice({
  title,
  line,
  selected,
  onSelect,
}: {
  title: string;
  line: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group block w-full border p-8 text-left transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] md:p-10 ${
        selected
          ? "border-white/70 bg-white/[0.04] shadow-[0_0_50px_rgba(245,246,247,0.10),inset_0_0_30px_rgba(245,246,247,0.04)]"
          : "border-white/[0.12] hover:border-white/35 hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-baseline justify-between gap-6">
        <h3
          className={`display text-2xl transition-colors duration-700 md:text-3xl ${
            selected ? "text-white" : "text-chrome group-hover:text-white"
          }`}
        >
          {title}
        </h3>
        <span
          className={`font-mono text-[0.6rem] tracking-[0.25em] uppercase transition-opacity duration-500 ${
            selected ? "text-white opacity-100" : "text-steel opacity-0 group-hover:opacity-60"
          }`}
        >
          {selected ? "Selected" : "Select"}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-silver">{line}</p>
    </button>
  );
}

/* Engineered input — no browser chrome. Focus is light. */
const FIELD =
  "w-full appearance-none border border-white/[0.15] bg-transparent px-5 py-4 font-sans text-base text-white placeholder:text-steel outline-none transition-all duration-700 focus:border-white/60 focus:shadow-[0_0_36px_rgba(245,246,247,0.10)]";

export default function StartPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [kind, setKind] = useState<string | null>(null);
  const [forces, setForces] = useState<string[]>([]);
  const [scale, setScale] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vision, setVision] = useState("");

  const toggleForce = (id: string) =>
    setForces((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const canContinue =
    (step === 0 && kind !== null) ||
    (step === 1 && forces.length > 0) ||
    (step === 2 && scale !== null) ||
    (step === 3 && name.trim() !== "" && email.includes("@"));

  const advance = () => {
    if (!canContinue) return;
    if (step < TOTAL - 1) setStep(step + 1);
    else setDone(true);
  };

  const progress = done ? 1 : (step + 1) / TOTAL;

  return (
    <section className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 pt-40 pb-24 md:px-12">
      {/* ---------------- HEADER ---------------- */}
      <div>
        <p className="label mb-8">Begin</p>
        <h1 className="display text-[clamp(2.2rem,5.5vw,4.5rem)] uppercase">
          <RevealWords text="Start something" delay={0.1} />
          <br />
          <span className="text-chrome-sheen">
            <RevealWords text="extraordinary" delay={0.4} />
          </span>
        </h1>
      </div>

      {/* ---------------- PROGRESS — an engineered line ---------------- */}
      <div className="mt-16 mb-14">
        <div className="mb-4 flex items-baseline justify-between">
          <p className="font-mono text-xs tracking-[0.3em] text-silver uppercase">
            {done ? "Complete" : STEP_LABELS[step]}
          </p>
          <p className="font-mono text-xs tracking-[0.3em] text-steel">
            {done ? "04" : `0${step + 1}`} / 04
          </p>
        </div>
        <div className="h-px w-full bg-white/[0.08]">
          <motion.div
            animate={{ scaleX: progress }}
            initial={{ scaleX: 1 / TOTAL }}
            transition={{ duration: 1, ease: EASE }}
            className="h-px w-full origin-left bg-gradient-to-r from-white/60 via-white to-white/60 shadow-[0_0_16px_rgba(245,246,247,0.4)]"
          />
        </div>
      </div>

      {/* ---------------- THE SEQUENCE ---------------- */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {done ? (
            /* ------- CONFIRMATION — the signal lands ------- */
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="py-16 text-center"
            >
              <div className="pointer-events-none mx-auto mb-14 h-px w-40 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_40px_rgba(245,246,247,0.5)]" />
              <h2 className="display text-[clamp(2.4rem,6vw,5rem)] uppercase">
                <RevealWords text="Signal received." delay={0.2} />
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.9, ease: EASE }}
                className="mx-auto mt-10 max-w-md text-base leading-relaxed text-silver"
              >
                {name.split(" ")[0]}, your vision is with us. We respond within
                forty-eight hours. Quietly. Precisely.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, delay: 1.4, ease: EASE }}
                className="mt-16 font-mono text-xs tracking-[0.3em] text-silver uppercase"
              >
                Powered by Astralyn.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 64 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -64 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {/* ------- 01 · WHAT ------- */}
              {step === 0 && (
                <div className="space-y-4">
                  {KINDS.map((k) => (
                    <Choice
                      key={k.id}
                      title={k.title}
                      line={k.line}
                      selected={kind === k.id}
                      onSelect={() => setKind(k.id)}
                    />
                  ))}
                </div>
              )}

              {/* ------- 02 · FORCES (multi) ------- */}
              {step === 1 && (
                <>
                  <p className="label mb-6">Select every force you need</p>
                  <div className="space-y-4">
                    {FORCES.map((f) => (
                      <Choice
                        key={f.id}
                        title={f.title}
                        line={f.line}
                        selected={forces.includes(f.id)}
                        onSelect={() => toggleForce(f.id)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ------- 03 · SCALE ------- */}
              {step === 2 && (
                <div className="space-y-4">
                  {SCALES.map((s) => (
                    <Choice
                      key={s.id}
                      title={s.title}
                      line={s.line}
                      selected={scale === s.id}
                      onSelect={() => setScale(s.id)}
                    />
                  ))}
                </div>
              )}

              {/* ------- 04 · THE SIGNAL ------- */}
              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <label htmlFor="name" className="label mb-4 block">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Who is building this?"
                      className={FIELD}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label mb-4 block">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Where do we respond?"
                      className={FIELD}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="vision" className="label mb-4 block">
                      The Vision
                    </label>
                    <textarea
                      id="vision"
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      placeholder="Three sentences. What should exist that doesn't?"
                      rows={5}
                      className={`${FIELD} resize-none`}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- CONTROLS ---------------- */}
      {!done && (
        <div className="mt-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`font-mono text-xs tracking-[0.25em] uppercase transition-all duration-500 ${
              step === 0
                ? "pointer-events-none opacity-0"
                : "text-silver hover:text-white"
            }`}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={advance}
            disabled={!canContinue}
            className={`btn-core ${step === TOTAL - 1 ? "btn-solid" : ""} ${
              canContinue ? "" : "pointer-events-none opacity-30"
            }`}
          >
            {step === TOTAL - 1 ? "Send the signal" : "Continue"}
          </button>
        </div>
      )}
    </section>
  );
}
