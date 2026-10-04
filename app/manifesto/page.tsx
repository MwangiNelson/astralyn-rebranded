"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, RevealWords } from "@/components/motion/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Plain-language account of the company — read, not scanned. */
const WHAT_WE_DO = [
  "Some of the businesses we work with are just getting started and need a technical team to build the product the whole company will run on. Others are established, but still run on spreadsheets, paperwork and disconnected tools, and need their operations and customer experience brought online. Either way, we bring the technical expertise they don't have in-house.",
  "Most of our work is engineering. We design and build custom software, web and mobile platforms, internal systems, data pipelines and the integrations that tie them together. We also build machine learning and AI into products where it actually earns its place: forecasting, automation, search, document processing and decision support.",
  "Consulting is how every engagement starts. We get to know the business, work out what technology it really needs, and plan a path that fits its budget and timeline. Then the same team builds it, ships it and stays on to support and scale it. One technical partner from the first conversation to the system in production.",
];

const DISCIPLINES = [
  {
    n: "01",
    title: "Strategy",
    line: "We work out what the business needs, which technology fits, and the plan to get there before any code is written.",
  },
  {
    n: "02",
    title: "Design",
    line: "We turn complex processes into products and interfaces that people understand, trust and want to use.",
  },
  {
    n: "03",
    title: "Technology",
    line: "We engineer the software, systems and machine learning that make the business run, and keep them running at scale.",
  },
];

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

      {/* ---------------- WHAT WE DO ---------------- */}
      <section className="relative bg-white py-28 text-black md:py-40">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-6 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:px-12">
          <Reveal className="md:sticky md:top-32 md:self-start">
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-black/55 uppercase">
              What Astralyn does
            </p>
            <h2 className="display mt-7 text-[clamp(3rem,6vw,6rem)] uppercase">
              Astralyn<br />does tech.
            </h2>
          </Reveal>
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-black">
                Astralyn is a technology consultancy and engineering house. We help
                businesses that need technical expertise either get started or take
                what they already do and make it digital.
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

      {/* ---------------- THREE DISCIPLINES ---------------- */}
      <section className="relative bg-white pb-28 text-black md:pb-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="border-t border-black/20 pt-20 md:pt-28">
            <Reveal>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-black/55 uppercase">
                How we make it real
              </p>
              <h2 className="display mt-6 max-w-3xl text-[clamp(2rem,4vw,3.5rem)] uppercase">
                Three disciplines.<br />One accountable team.
              </h2>
            </Reveal>
          </div>
          <div className="mt-14 border-t border-black/20">
            {DISCIPLINES.map((discipline, index) => (
              <Reveal key={discipline.title} delay={index * 0.1}>
                <article className="grid gap-4 border-b border-black/20 py-8 md:grid-cols-[6rem_1fr_minmax(16rem,0.7fr)] md:items-center md:py-10">
                  <p className="font-mono text-sm text-black/50">{discipline.n}</p>
                  <h3 className="display text-[clamp(1.8rem,3.5vw,3rem)] uppercase">
                    {discipline.title}
                  </h3>
                  <p className="max-w-md text-base leading-relaxed text-black/65">
                    {discipline.line}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- THE CLOSE ---------------- */}
      <section className="relative overflow-hidden py-32 md:py-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,245,240,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 text-center md:px-12">
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
