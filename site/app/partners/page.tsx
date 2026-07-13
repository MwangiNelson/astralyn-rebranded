"use client";

import Link from "next/link";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import CardLit from "@/components/CardLit";

/* ------------------------------------------------------------
   PARTNERS & ADVISORS — an engineered index.
   Deliberately quieter than the founders. A register, not a stage.
------------------------------------------------------------ */

const ADVISORS = [
  {
    n: "01",
    name: "Dr. Elena Vasquez",
    domain: "Applied Intelligence",
    line: "Machine intelligence, deployed with restraint.",
  },
  {
    n: "02",
    name: "Marcus Thorne",
    domain: "Capital & Markets",
    line: "Reads markets the way engineers read systems.",
  },
  {
    n: "03",
    name: "Wanjiru Kamau",
    domain: "Policy & Regulation",
    line: "Clears the path before the product arrives.",
  },
  {
    n: "04",
    name: "Hiroshi Tanaka",
    domain: "Hardware Systems",
    line: "Thirty years shipping silicon that ships on time.",
  },
  {
    n: "05",
    name: "Sofia Lindqvist",
    domain: "Brand & Narrative",
    line: "Makes precision legible. Makes power quiet.",
  },
  {
    n: "06",
    name: "David Osei",
    domain: "Enterprise Architecture",
    line: "Rebuilds institutions without stopping them.",
  },
];

export default function PartnersPage() {
  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 pt-40 pb-24 md:px-12 md:pt-52">
        <Reveal>
          <p className="label mb-10">Partners &amp; Advisors</p>
        </Reveal>
        <h1 className="display text-[clamp(2.8rem,8vw,7.5rem)] uppercase">
          <RevealWords text="The council" delay={0.2} />
          <br />
          <span className="text-chrome-sheen">
            <RevealWords text="behind the house" delay={0.5} />
          </span>
        </h1>
        <Reveal delay={0.7} className="mt-12 max-w-md">
          <p className="text-base leading-relaxed text-silver">
            Six minds we call before we build. Each one sharpens a different
            edge of the work.
          </p>
        </Reveal>
      </section>

      {/* ---------------- THE INDEX ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 md:pb-44">
        <DrawnLine />
        <div>
          {ADVISORS.map((a, i) => (
            <Reveal key={a.n} delay={i * 0.08} y={32}>
              <CardLit className="group grid grid-cols-1 gap-3 border-b border-white/[0.07] py-10 transition-colors duration-700 md:grid-cols-[6rem_1fr_1fr_1fr] md:items-baseline md:gap-8 md:py-12">
                <p className="font-mono text-sm text-steel transition-colors duration-700 group-hover:text-silver">
                  {a.n}
                </p>
                <h2 className="display text-2xl text-chrome transition-colors duration-700 group-hover:text-white md:text-3xl">
                  {a.name}
                </h2>
                <p className="label transition-colors duration-700 group-hover:text-chrome">
                  {a.domain}
                </p>
                <p className="text-sm leading-relaxed text-silver">{a.line}</p>
              </CardLit>
            </Reveal>
          ))}
        </div>

        {/* ---------------- THE INVITATION ---------------- */}
        <Reveal delay={0.3} className="mt-24">
          <p className="max-w-md text-base leading-relaxed text-silver">
            The council grows slowly. Deliberately. If your discipline belongs
            here, speak with us.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block font-mono text-xs tracking-[0.25em] text-white uppercase underline-offset-8 transition-all duration-500 hover:underline"
          >
            Speak with Astralyn →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
