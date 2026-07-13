"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------
   CONTACT — almost empty. Whitespace is the design.
   One headline. One address. Two cities. One door.
------------------------------------------------------------ */

export default function ContactPage() {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col justify-center px-6 py-40 md:px-12">
      {/* A single volumetric light source */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(245,246,247,0.05),transparent_55%)]" />

      <div className="relative">
        <Reveal>
          <p className="label mb-12">Contact</p>
        </Reveal>

        <h1 className="display text-[clamp(3rem,10vw,10rem)] uppercase">
          <RevealWords text="Speak with" delay={0.2} />
          <br />
          <span className="text-chrome-sheen">
            <RevealWords text="Astralyn" delay={0.6} />
          </span>
        </h1>

        {/* The address — one line, fully lit on approach */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
          className="mt-20"
        >
          <a
            href="mailto:hello@astralyn.group"
            className="display inline-block text-[clamp(1.4rem,3.5vw,3rem)] text-chrome underline-offset-[12px] transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:text-white hover:underline hover:[text-shadow:0_0_40px_rgba(245,246,247,0.35)]"
          >
            hello@astralyn.group
          </a>
        </motion.div>
      </div>

      {/* The footing — cities and the door */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.6, ease: EASE }}
        className="relative mt-32"
      >
        <DrawnLine delay={1.4} />
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-baseline md:justify-between">
          <div className="flex gap-14">
            <div>
              <p className="label">Nairobi</p>
              <p className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-steel uppercase">
                EAT +3
              </p>
            </div>
            <div>
              <p className="label">London</p>
              <p className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-steel uppercase">
                GMT +0
              </p>
            </div>
          </div>

          <Link
            href="/start"
            className="font-mono text-xs tracking-[0.25em] text-white uppercase underline-offset-8 transition-all duration-500 hover:underline"
          >
            Start something extraordinary →
          </Link>
        </div>

        <p className="mt-20 font-mono text-[0.65rem] tracking-[0.3em] text-steel uppercase">
          Powered by Astralyn.
        </p>
      </motion.div>
    </section>
  );
}
