"use client";

import Link from "next/link";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import CapabilityGroup from "@/components/work/CapabilityGroup";
import CaseCard from "@/components/work/CaseCard";
import { CLIENTS } from "@/lib/clients";
import { ALSO, CAPABILITIES, ENGAGEMENT } from "@/lib/work";

/* ------------------------------------------------------------------
   WORK — what we build, with the work as evidence.

   A short client list reads small as a catalogue and strong as proof,
   so the page leads with the kinds of system we build and files each
   client under the one it demonstrates. What we changed inside each
   business still stays inside it; the depth is offered in a room.
------------------------------------------------------------------- */

const DISCRETION = [
  {
    t: "We show the work, not the client's business.",
    d: "Each case says what we built and where you can see it. The client's numbers, plans and internal processes belong to them.",
  },
  {
    t: "Ask for the detail.",
    d: "Under an NDA, we will walk you through any engagement end to end: the decisions, the trade-offs and what we would do differently.",
  },
];

export default function WorkPage() {
  const also = ALSO.map((n) => CLIENTS.find((c) => c.name === n)).filter((c) => c !== undefined);

  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 pt-40 pb-20 md:px-12 md:pt-52 md:pb-28">
          <h1 className="display headline-lit max-w-5xl text-[clamp(2.8rem,7.5vw,6.8rem)] text-balance">
            <RevealWords text="What we build," delay={0.2} />{" "}
            <RevealWords text="and who for." delay={0.45} chrome />
          </h1>
          <Reveal delay={0.6}>
            <p className="mt-10 max-w-[56ch] text-base leading-relaxed text-silver md:text-lg">
              We design, build and run software for businesses and
              institutions. Below are the kinds of system we build, each with
              the client work and products that show it.
            </p>
          </Reveal>
          <Reveal delay={0.75}>
            <nav aria-label="Kinds of work" className="mt-12 flex flex-wrap gap-3">
              {CAPABILITIES.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="chrome-badge transition-colors duration-500 hover:border-white/40 hover:text-white"
                >
                  {c.title}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* ---------------- WHAT WE BUILD ---------------- */}
      {CAPABILITIES.map((cap, i) => (
        <CapabilityGroup key={cap.id} cap={cap} index={i} />
      ))}

      {also.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-20 md:grid-cols-[5fr_7fr] md:gap-24 md:px-12">
            <Reveal>
              <h2 className="display-title text-[clamp(1.6rem,3vw,2.4rem)]">Also built</h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {also.map((c) => (
                <Reveal key={c.name}>
                  <CaseCard client={c} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- HOW WE WORK WITH YOU ---------------- */}
      <section data-chapter="Approach" className="panel section-tex relative">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-6 py-24 md:grid-cols-[5fr_7fr] md:gap-24 md:px-12 md:py-36">
          <div>
            <h2 className="display headline-lit text-[clamp(2.2rem,5vw,4.25rem)] text-balance">
              <RevealWords text="How we work" />{" "}
              <RevealWords text="with you." delay={0.15} chrome />
            </h2>
            <Reveal delay={0.2}>
              <Link
                href="/#approach"
                className="mt-8 inline-block font-mono text-xs tracking-[0.25em] text-white uppercase underline-offset-8 transition-all duration-500 hover:underline"
              >
                The principles we build to →
              </Link>
            </Reveal>
          </div>
          <ol className="space-y-12">
            {ENGAGEMENT.map((s, i) => (
              <li key={s.t}>
                <Reveal delay={0.05 * i}>
                  <DrawnLine delay={0.05 * i} />
                  <h3 className="display-title mt-6 text-[clamp(1.4rem,2.3vw,2rem)]">{s.t}</h3>
                  <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-silver md:text-base">{s.d}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- DISCRETION ---------------- */}
      <section className="section-tex relative">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-24 md:grid-cols-2 md:gap-24 md:px-12 md:py-32">
          {DISCRETION.map((b, i) => (
            <Reveal key={b.t} delay={0.1 * i}>
              <DrawnLine delay={0.1 * i} />
              <h3 className="display-title mt-6 text-[clamp(1.4rem,2.3vw,2rem)]">{b.t}</h3>
              <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-silver">{b.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CLOSE ---------------- */}
      <section className="relative bg-white py-28 text-center text-black md:py-40">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <h2 className="display-black text-[clamp(2.6rem,8vw,7.5rem)] uppercase">
            <RevealWords text="What are you" />
            <br />
            <span className="text-black/40">
              <RevealWords text="building?" delay={0.2} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <Link href="/start" className="cta-inverse mt-12">
              Start a conversation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
