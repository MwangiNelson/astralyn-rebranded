"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import CardLit from "@/components/CardLit";
import { CTA } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------
   RESEARCH LAB — a classified index of what comes next.
   Mono labels. Numbered entries. Hairline borders. No decoration.
------------------------------------------------------------------- */

type Status = "ACTIVE" | "PROTOTYPE" | "EXPLORATION";

type Thread = {
  no: string;
  file: string;
  title: string;
  status: Status;
  inquiry: string;
  brief: string;
  fields: string[];
};

const THREADS: Thread[] = [
  {
    no: "01",
    file: "AST-L-014",
    title: "Applied Intelligence",
    status: "ACTIVE",
    inquiry: "What happens when the enterprise can reason about itself?",
    brief:
      "Inference systems embedded inside operations — not chat, cognition. We engineer models that read a business as a single system and act with judgment. Findings feed directly into Meridian and Obsidian.",
    fields: ["Inference orchestration", "Private deployment", "Decision systems"],
  },
  {
    no: "02",
    file: "AST-L-021",
    title: "Autonomous Systems",
    status: "PROTOTYPE",
    inquiry: "How far can software go before it needs permission?",
    brief:
      "Agents that plan, execute and verify without a human in the loop — and the control surfaces that keep them accountable. Current prototype: a self-healing operations mesh running in closed trials.",
    fields: ["Multi-agent control", "Verification layers", "Failure containment"],
  },
  {
    no: "03",
    file: "AST-L-008",
    title: "Interface Futures",
    status: "EXPLORATION",
    inquiry: "After the screen, what does software feel like?",
    brief:
      "Ambient, spatial and voice-first interaction studied as one discipline. We map where attention actually lives and design interfaces that appear only when summoned. The screen becomes optional.",
    fields: ["Spatial computing", "Ambient interaction", "Attention modelling"],
  },
  {
    no: "04",
    file: "AST-L-030",
    title: "Computational Design",
    status: "ACTIVE",
    inquiry: "Can a design system design itself?",
    brief:
      "Generative systems that hold a brand's discipline — typography, rhythm, restraint — and compose within it. Machines that produce a thousand layouts, all unmistakably one identity.",
    fields: ["Generative systems", "Constraint engines", "Identity encoding"],
  },
  {
    no: "05",
    file: "AST-L-035",
    title: "Machine Perception",
    status: "EXPLORATION",
    inquiry: "What does a factory see when it looks at itself?",
    brief:
      "Vision and sensing pipelines for physical operations — ports, plants, grids. Teaching infrastructure to observe its own condition and report before failure, not after.",
    fields: ["Industrial vision", "Sensor fusion", "Predictive condition"],
  },
];

function StatusTag({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-2.5 border border-white/15 px-3.5 py-1.5 font-mono text-[0.6rem] tracking-[0.28em] text-chrome">
      <span
        className={`h-1 w-1 rounded-full ${
          status === "ACTIVE"
            ? "bg-white"
            : status === "PROTOTYPE"
              ? "bg-chrome"
              : "bg-steel"
        }`}
      />
      {status}
    </span>
  );
}

function ThreadEntry({ t, i }: { t: Thread; i: number }) {
  return (
    <Reveal delay={i * 0.08}>
      <CardLit className="group border-b border-white/10 transition-colors duration-700 hover:bg-white/[0.02]">
        <div className="grid gap-8 py-14 md:grid-cols-[7rem_1fr_auto] md:gap-14 md:py-16">
          {/* Index */}
          <div>
            <p className="font-mono text-sm text-steel">{t.no}</p>
            <p className="mt-3 font-mono text-[0.6rem] tracking-[0.2em] text-steel">
              {t.file}
            </p>
          </div>

          {/* Body */}
          <div>
            <h2 className="display text-3xl transition-colors duration-700 md:text-5xl">
              {t.title}
            </h2>
            <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed tracking-[0.08em] text-chrome uppercase">
              {t.inquiry}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-silver md:text-base">
              {t.brief}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {t.fields.map((f) => (
                <span
                  key={f}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-silver uppercase"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="md:pt-2 md:text-right">
            <StatusTag status={t.status} />
          </div>
        </div>
      </CardLit>
    </Reveal>
  );
}

export default function LabPage() {
  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_-10%,rgba(245,246,247,0.05),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-40 pb-24 md:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: EASE }}
            className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            <p className="label">Astralyn Research Division</p>
            <p className="font-mono text-[0.6rem] tracking-[0.28em] text-steel uppercase">
              Index — 05 threads — Revised 2026.07
            </p>
          </motion.div>
          <h1 className="display max-w-6xl text-[clamp(2.8rem,8vw,7.5rem)] uppercase">
            <RevealWords text="We research" delay={0.2} />
            <br />
            <RevealWords text="what's next" delay={0.6} gradient />
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.6, ease: EASE }}
            className="mt-12 max-w-md text-base leading-relaxed text-silver"
          >
            The Lab is where Astralyn works ahead of the brief. Open questions.
            Engineered answers. Everything here eventually becomes product.
          </motion.p>
        </div>
      </section>

      {/* ---------------- THE INDEX ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12">
        <Reveal>
          <div className="flex items-baseline justify-between pb-6">
            <p className="label">Research Index</p>
            <p className="hidden font-mono text-[0.6rem] tracking-[0.28em] text-steel uppercase md:block">
              Status — Active / Prototype / Exploration
            </p>
          </div>
        </Reveal>
        <DrawnLine />

        <div>
          {THREADS.map((t, i) => (
            <ThreadEntry key={t.no} t={t} i={i} />
          ))}
        </div>
      </section>

      {/* ---------------- DOCTRINE ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-40">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <Reveal>
              <p className="label mb-10">Doctrine</p>
            </Reveal>
            <h2 className="display text-[clamp(2rem,4.5vw,4rem)]">
              <RevealWords text="Research is how" />
              <br />
              <span className="text-silver">
                <RevealWords text="we stay ahead" delay={0.25} />
              </span>
              <br />
              <RevealWords text="of the brief." delay={0.5} gradient />
            </h2>
          </div>
          <Reveal delay={0.3} className="md:pt-24">
            <p className="max-w-md text-base leading-relaxed text-silver">
              Nothing in this index is speculation for its own sake. Every
              thread has a path to product. We explore so that when a partner
              asks for the future, we have already built the first version.
            </p>
            <div className="mt-12 space-y-4 font-mono text-[0.65rem] tracking-[0.25em] text-steel uppercase">
              <p>We engineer. We architect. We shape.</p>
              <p>We transform. We power.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- ACCESS ---------------- */}
      <section className="relative overflow-hidden py-48 text-center md:py-56">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,246,247,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <Reveal>
            <p className="label mb-10">Restricted Collaboration</p>
          </Reveal>
          <h2 className="display text-[clamp(2.2rem,6vw,5.5rem)] uppercase">
            <RevealWords text="Build the future" />
            <br />
            <RevealWords text="before it arrives" delay={0.3} gradient />
          </h2>
          <Reveal delay={0.5}>
            <Link href={CTA.href} className="btn-core btn-solid mt-16">
              Request a briefing
            </Link>
          </Reveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 1.6, ease: EASE }}
            className="mt-20 font-mono text-xs tracking-[0.3em] text-silver uppercase"
          >
            Powered by Astralyn.
          </motion.p>
        </div>
      </section>
    </>
  );
}
