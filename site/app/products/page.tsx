"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import { CTA } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------
   PRODUCTS — treated like launches, never portfolio items.
------------------------------------------------------------------- */

type Product = {
  index: string;
  name: string;
  category: string;
  headline: [string, string];
  problem: string;
  solution: string;
  stack: string;
  metrics: { value: string; label: string }[];
  visual: "beam" | "column" | "core";
};

const PRODUCTS: Product[] = [
  {
    index: "01",
    name: "Meridian",
    category: "Autonomous Operations Platform",
    headline: ["Operations that", "run themselves."],
    problem:
      "Enterprises drown in coordination. Thousands of decisions per hour — routed by hand, delayed by meetings, lost in threads. The business moves slower than its own information.",
    solution:
      "Meridian watches every signal across the operation, routes every decision, and acts before anyone has to ask. Exceptions surface. Everything else simply happens. An operating system for the operation itself.",
    stack:
      "Rust · Kafka · Postgres · Next.js · Proprietary inference layer",
    metrics: [
      { value: "−41%", label: "Operating cost" },
      { value: "12ms", label: "Decision latency" },
      { value: "24/7", label: "Autonomous execution" },
    ],
    visual: "beam",
  },
  {
    index: "02",
    name: "Axiom Rail",
    category: "Financial Infrastructure",
    headline: ["Money should move", "at the speed of intent."],
    problem:
      "Settlement takes days. Reconciliation takes teams. Every transfer drags a century of banking architecture behind it — and trust is manufactured by hand.",
    solution:
      "A ledger-grade payments rail engineered for finality. One API. Instant settlement, continuous reconciliation, cryptographic audit built into the rail itself. Trust becomes a property of the system, not a department.",
    stack: "Go · TypeScript · Event sourcing · Postgres · Zero-knowledge audit",
    metrics: [
      { value: "1.4s", label: "Settlement finality" },
      { value: "99.999%", label: "Uptime" },
      { value: "$2.1B", label: "Processed to date" },
    ],
    visual: "column",
  },
  {
    index: "03",
    name: "Obsidian",
    category: "Enterprise Intelligence System",
    headline: ["Every enterprise is", "sitting on an answer."],
    problem:
      "Data everywhere. Intelligence nowhere. Dashboards describe the past while the decisions that matter get made on instinct — because the truth is scattered across forty systems.",
    solution:
      "Obsidian reads the entire business as one system. It answers the question asked — then asks the next one. Private by design, deployed inside the walls, fluent in the language of the enterprise it serves.",
    stack: "Python · Ray · LLM orchestration · Vector systems · Private deployment",
    metrics: [
      { value: "6×", label: "Faster analysis" },
      { value: "−38%", label: "Forecast error" },
      { value: "01", label: "Source of truth" },
    ],
    visual: "core",
  },
];

/* Abstract monochrome light — the visual is light itself. */
function LightVisual({
  kind,
  progress,
}: {
  kind: Product["visual"];
  progress: MotionValue<number>;
}) {
  if (kind === "beam") {
    return (
      <motion.div
        style={{ y: progress }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="absolute top-1/2 left-0 h-40 w-full -translate-y-1/2 bg-[radial-gradient(ellipse_60%_100%_at_center,rgba(245,246,247,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(245,246,247,0.06),transparent_60%)]" />
      </motion.div>
    );
  }
  if (kind === "column") {
    return (
      <motion.div
        style={{ y: progress }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-chrome/50 to-transparent" />
        <div className="absolute top-0 left-1/2 h-full w-48 -translate-x-1/2 bg-[radial-gradient(ellipse_100%_60%_at_center,rgba(245,246,247,0.07),transparent_70%)] blur-xl" />
        <div className="absolute top-1/2 left-1/2 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </motion.div>
    );
  }
  return (
    <motion.div
      style={{ y: progress }}
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,246,247,0.09),transparent_55%)]" />
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
    </motion.div>
  );
}

function ProductLaunch({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7], [0, 1, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden py-40 md:py-56"
    >
      <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0">
        <LightVisual kind={product.visual} progress={drift} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080808_95%)]" />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        {/* Identity */}
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="font-mono text-sm text-steel">{product.index}</p>
            <p className="label">{product.category}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="display mt-10 text-2xl tracking-[0.02em] text-chrome uppercase md:text-3xl">
            {product.name}
          </p>
        </Reveal>

        {/* Story headline */}
        <h2 className="display mt-6 max-w-5xl text-[clamp(2.6rem,6.5vw,6rem)]">
          <RevealWords text={product.headline[0]} delay={0.15} />
          <br />
          <RevealWords text={product.headline[1]} delay={0.35} gradient />
        </h2>

        {/* Problem / Solution */}
        <div className="mt-24 grid gap-16 md:mt-32 md:grid-cols-2 md:gap-24">
          <Reveal>
            <p className="label mb-6">The Problem</p>
            <p className="max-w-md text-lg leading-relaxed text-silver">
              {product.problem}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="label mb-6">The Solution</p>
            <p className="max-w-md text-lg leading-relaxed text-white">
              {product.solution}
            </p>
          </Reveal>
        </div>

        {/* Metrics — big numbers, engineered */}
        <div className="mt-24 grid gap-px border-y border-white/10 md:mt-32 md:grid-cols-3">
          {product.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.15}>
              <div className="py-12 md:px-10 md:py-16">
                <p className="display text-5xl text-white md:text-6xl">
                  {m.value}
                </p>
                <p className="label mt-5">{m.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Technology + CTA */}
        <Reveal delay={0.2} className="mt-20 md:mt-24">
          <p className="label mb-4">Technology</p>
          <p className="font-mono text-xs leading-relaxed tracking-[0.15em] text-silver uppercase">
            {product.stack}
          </p>
          <div className="mt-14 flex flex-wrap items-center gap-10">
            <Link href={CTA.href} className="btn-core">
              Request access
            </Link>
            <p className="font-mono text-[0.65rem] tracking-[0.3em] text-steel uppercase">
              Powered by Astralyn.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative flex min-h-[78svh] items-center overflow-hidden bg-black text-white">
        <div className="grid-bg grid-bg-fade absolute inset-0 opacity-75" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_44%,rgba(245,245,240,0.13),transparent_0%,transparent_23%,rgba(245,245,240,0.08)_23.3%,transparent_23.6%,transparent_40%,rgba(245,245,240,0.04)_40.3%,transparent_40.6%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.82)_45%,rgba(0,0,0,0)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-40 pb-24 md:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: EASE }}
            className="label mb-10"
          >
            Products — Not a portfolio. A lineup.
          </motion.p>
          <h1 className="display max-w-6xl text-[clamp(3.8rem,9vw,8.5rem)] text-white uppercase">
            <RevealWords text="Ideas become" delay={0.2} />
            <br />
            <RevealWords text="industry" delay={0.6} gradient />
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.6, ease: EASE }}
            className="mt-12 max-w-xl text-lg leading-relaxed text-chrome"
          >
            We do not ship projects. We launch products. Each one engineered
            end to end — strategy, design, technology — until it defines its
            market.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <DrawnLine />
      </div>

      {/* ---------------- THE LINEUP ---------------- */}
      {PRODUCTS.map((p, i) => (
        <div key={p.name}>
          <ProductLaunch product={p} />
          {i < PRODUCTS.length - 1 && (
            <div className="mx-auto max-w-[1600px] px-6 md:px-12">
              <DrawnLine />
            </div>
          )}
        </div>
      ))}

      {/* ---------------- SIGNATURE ---------------- */}
      <section className="relative overflow-hidden py-48 text-center md:py-64">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,246,247,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <h2 className="display text-[clamp(2.2rem,6vw,5.5rem)] uppercase">
            <RevealWords text="Your product" />
            <br />
            <RevealWords text="belongs here" delay={0.3} gradient />
          </h2>
          <Reveal delay={0.5}>
            <Link href={CTA.href} className="btn-core btn-solid mt-16">
              Start the launch
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
