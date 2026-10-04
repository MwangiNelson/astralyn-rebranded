"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, RevealWords } from "@/components/motion/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------
   BELIEFS — each one is a room. Huge type. Whitespace as design.
------------------------------------------------------------ */
const BELIEFS = [
  {
    n: "01",
    label: "On Power",
    lines: ["Technology", "is power."],
    note: "Raw. Dormant. Waiting. Power alone builds nothing.",
  },
  {
    n: "02",
    label: "On Purpose",
    lines: ["Strategy gives", "it purpose."],
    note: "Direction before motion. We architect the why before the what.",
  },
  {
    n: "03",
    label: "On Humanity",
    lines: ["Design makes", "it human."],
    note: "Precision you can feel. Clarity engineered into form.",
  },
  {
    n: "04",
    label: "On Building",
    lines: ["We architect", "businesses."],
    note: "Not decks. Not decoration. Foundations built to hold weight.",
  },
  {
    n: "05",
    label: "On Craft",
    lines: ["We engineer", "products."],
    note: "Systems with momentum. Ideas become industry.",
  },
  {
    n: "06",
    label: "On Tomorrow",
    lines: ["We shape", "the future."],
    note: "Not predicted. Not awaited. Built — deliberately.",
  },
];

/* Plain-language account of the company — read, not scanned. */
const WHAT_WE_DO = [
  "Most teams come to us with something half-formed: a market they want to enter, a process that has outgrown its tools, or a product that needs to exist but doesn't yet. We start by understanding the business behind it — who it serves, where the real opportunity is, and what has to be true for it to succeed. That becomes the strategy, and everything else is built on it.",
  "From there, the same team designs and builds the thing. We shape the brand and the product experience so people understand it and trust it, then engineer the software, platforms and AI systems that run it — from the first prototype through to enterprise scale. Because strategy, design and engineering sit under one roof, nothing gets lost in a handover, and one team stays accountable for the result.",
  "We also build for ourselves. Alongside client work, Astralyn develops its own portfolio of products, held to the same standard we bring to every engagement. It keeps our thinking sharp and our engineering honest — we know what it takes to ship because we do it with our own name on the line.",
  "We take on a small number of partners at a time: founders and enterprise teams who care about doing it properly, and who want a collaborator for the long run rather than a vendor for the next sprint.",
];

/* A single belief is a compact, tactile chapter — not an empty full screen. */
function Belief({
  n,
  label,
  lines,
  note,
  index,
}: (typeof BELIEFS)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Camera language — the statement drifts as the visitor travels past it.
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const alignRight = index % 2 === 1;

  return (
    <section
      ref={ref}
      className={`relative mx-auto max-w-[1600px] px-6 md:px-12 ${
        index === 0 ? "" : "-mt-5 md:-mt-9"
      }`}
    >
      <motion.div
        style={{ y }}
        className={`manifesto-card ${alignRight ? "md:[&_.belief-copy]:order-2 md:[&_.belief-index]:order-1" : ""}`}
      >
        <div className="belief-index">
          <p className="font-mono text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-[-0.08em] text-chrome/80">
            {n}
          </p>
          <span className="editorial-kicker mt-7">{label}</span>
        </div>
        <div className={`belief-copy ${alignRight ? "md:text-right" : ""}`}>
          <Reveal>
            <h2 className="display text-[clamp(3rem,8vw,7.7rem)] uppercase">
              <RevealWords text={lines[0]} />
              <br />
              <RevealWords text={lines[1]} delay={0.18} chrome />
            </h2>
          </Reveal>
          <Reveal
            delay={0.28}
            className={`mt-8 max-w-sm ${alignRight ? "md:ml-auto" : ""}`}
          >
            <p className="text-base leading-relaxed text-silver">{note}</p>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

export default function Manifesto() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroFade = useTransform(heroProgress, [0, 0.85], [1, 0]);
  const heroRise = useTransform(heroProgress, [0, 1], [0, -80]);

  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section ref={heroRef} className="relative h-[105svh]">
        <div className="sticky top-0 flex h-[88svh] items-center justify-center overflow-hidden">
          <div className="lit-room absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(245,245,240,0.12),transparent_45%),radial-gradient(ellipse_at_22%_72%,rgba(245,245,240,0.07),transparent_42%)]" />

          <motion.div
            style={{ opacity: heroFade, y: heroRise }}
            className="relative px-6 text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.4, ease: EASE }}
              className="label mb-10"
            >
              About Astralyn
            </motion.p>
            <h1 className="display text-[clamp(3rem,10vw,10rem)] uppercase">
              <RevealWords text="Built to" delay={0.3} />
              <br />
              <RevealWords text="move business." delay={0.7} chrome />
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1.6, ease: EASE }}
              className="mt-12 font-mono text-xs tracking-[0.3em] text-silver uppercase"
            >
              A point of view, then the work to make it real.
            </motion.p>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            style={{ opacity: heroFade }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-12 w-px bg-gradient-to-b from-transparent via-chrome to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ---------------- THE BELIEFS ---------------- */}
      <section className="chapter-surface overflow-hidden py-16 md:py-24">
        <div className="mb-12 flex items-center justify-between px-6 md:mx-auto md:max-w-[1600px] md:px-12">
          <p className="editorial-kicker">What we believe</p>
          <p className="font-mono text-[0.65rem] tracking-[0.24em] text-steel uppercase">
            Scroll to read
          </p>
        </div>
        <div className="space-y-0">
          {BELIEFS.map((b, i) => (
            <Belief key={b.n} {...b} index={i} />
          ))}
        </div>
      </section>

      {/* ---------------- WHAT WE DO ---------------- */}
      <section className="relative bg-white py-28 text-black md:py-40">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-6 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:px-12">
          <Reveal className="md:sticky md:top-32 md:self-start">
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-black/55 uppercase">
              What Astralyn does
            </p>
            <h2 className="display mt-7 text-[clamp(3rem,6vw,6rem)] uppercase">
              In plain<br />terms.
            </h2>
          </Reveal>
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-black">
                Astralyn is a technology strategy, design and software engineering
                company. We help startups and established businesses turn ambitious
                ideas into products that work — and keep working.
              </p>
            </Reveal>
            <div className="mt-12 space-y-7 border-t border-black/20 pt-12">
              {WHAT_WE_DO.map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.06}>
                  <p className="text-base leading-relaxed text-black/70 md:text-lg">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- THE CLOSE ---------------- */}
      <section className="relative overflow-hidden py-32 md:py-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,245,240,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 text-center md:px-12">
          <Reveal>
            <p className="label mb-12">The Signature</p>
          </Reveal>
          <h2 className="display text-[clamp(2.8rem,8vw,7.5rem)] uppercase">
            <RevealWords text="Powered by Astralyn." chrome />
          </h2>
          <Reveal delay={0.5} className="mt-16">
            <p className="mx-auto max-w-md text-base leading-relaxed text-silver">
              Every system we build carries it. Every product we ship earns it.
            </p>
          </Reveal>
          <Reveal delay={0.7}>
            <Link href="/start" className="btn-core btn-solid mt-16">
              Start something
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
