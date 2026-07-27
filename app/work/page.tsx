"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import WorkWall from "@/components/WorkWall";
import { CLIENTS } from "@/lib/clients";
import { CTA } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------
   SELECTED WORK — the wall, not the file.

   We used to publish the whole transformation: challenge, strategy, the
   numbers, the outcome. That is our clients' commercial information, and
   giving it away is a poor trade for a scroll. The wall states who trusted
   us and where the work lives. The rest is available in the room.
------------------------------------------------------------------- */

const DISCRETION = [
  {
    t: "The logo is the proof.",
    d: "Businesses that could hire anyone chose us, and their work is live where anyone can inspect it. That is a stronger claim than any metric we could publish about ourselves.",
  },
  {
    t: "The detail is theirs.",
    d: "Architecture, economics and roadmap belong to the client who paid for them. We do not trade a partner's advantage for our own marketing.",
  },
  {
    t: "The depth is on request.",
    d: "Under an NDA, in a room, we will walk you through any engagement end to end — the decisions, the trade-offs and what we would do differently.",
  },
];

export default function WorkPage() {
  const live = CLIENTS.filter((c) => !c.inHouse).length;

  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative flex min-h-[86svh] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_54%_58%_at_82%_10%,rgba(245,245,240,0.07),transparent_68%)]" />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-40 pb-24 md:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: EASE }}
            className="label mb-10"
          >
            Selected Work — The wall, not the file
          </motion.p>
          <h1 className="display max-w-6xl text-[clamp(2.8rem,8vw,7.5rem)] uppercase">
            <RevealWords text="The names" delay={0.2} />
            <br />
            <RevealWords text="are the work" delay={0.6} chrome />
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.6, ease: EASE }}
            className="mt-12 max-w-lg text-base leading-relaxed text-silver"
          >
            Importers, institutions, national platforms and shipped games.
            Every one of them is live and inspectable. What we changed inside
            each business stays inside each business.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1.6, ease: EASE }}
            className="mt-8 font-mono text-xs tracking-[0.3em] text-silver uppercase"
          >
            Powered by Astralyn.
          </motion.p>
        </div>
      </section>

      {/* ---------------- THE WALL ---------------- */}
      <section className="relative mx-auto max-w-[1600px] px-6 pb-32 md:px-12 md:pb-40">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-6">
            <p className="label">
              {live} partners · {CLIENTS.length - live} in-house
            </p>
            <p className="font-mono text-[0.62rem] tracking-[0.24em] text-steel uppercase">
              Hover a mark · Click to open
            </p>
          </div>
        </Reveal>
        <WorkWall />
      </section>

      {/* ---------------- WHY IT STOPS THERE ---------------- */}
      <section className="panel section-tex relative overflow-hidden">
        <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
          <Reveal>
            <p className="label mb-10">On Discretion</p>
            <h2 className="display headline-lit mb-20 max-w-4xl text-[clamp(2.2rem,5vw,4rem)]">
              We publish the client.{" "}
              <span className="text-chrome-sheen">Never the playbook.</span>
            </h2>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3">
            {DISCRETION.map((b, i) => (
              <Reveal key={b.t} delay={0.1 + i * 0.1}>
                <DrawnLine delay={0.1 + i * 0.1} />
                <h3 className="display mt-6 text-2xl md:text-3xl">{b.t}</h3>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-silver">
                  {b.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NEXT CHAPTER ---------------- */}
      <section className="relative overflow-hidden py-48 text-center md:py-64">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,246,247,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <Reveal>
            <p className="label mb-10">The Next Name</p>
          </Reveal>
          <h2 className="display text-[clamp(2.2rem,6vw,5.5rem)] uppercase">
            <RevealWords text="Yours is" />
            <br />
            <RevealWords text="unwritten" delay={0.3} chrome />
          </h2>
          <Reveal delay={0.5}>
            <Link href={CTA.href} className="btn-core btn-solid mt-16">
              Begin the transformation
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
