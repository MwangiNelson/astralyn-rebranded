"use client";

import Link from "next/link";
import {
  Reveal,
  RevealWords,
  DrawnLine,
  MaskWipe,
  Parallax,
} from "@/components/motion/Reveal";
import CardLit from "@/components/CardLit";
import Plate from "@/components/Plate";
import Hero from "@/components/Hero";
import WorkWall from "@/components/WorkWall";
import type { FieldVariant } from "@/components/Field";
import { PRODUCTS } from "@/lib/products";
import { CTA } from "@/lib/site";

const CHAPTERS: {
  n: string;
  title: string;
  line: string;
  tags: string[];
  field: FieldVariant;
  /** What the plate is actually drawing — stated, so it reads as an
   *  instrument rather than as decoration. */
  readout: string;
}[] = [
  {
    n: "01",
    title: "Potential",
    line: "Every idea begins dormant. Silent. Full of stored energy, waiting for direction.",
    tags: ["Discovery", "Research", "Opportunity Mapping"],
    field: "dormant",
    readout: "Charge / dormant lattice",
  },
  {
    n: "02",
    title: "Strategy",
    line: "We define the opportunity before a line is drawn or written. Direction before motion.",
    tags: ["Technology Strategy", "Brand Strategy", "Market Engineering"],
    field: "vector",
    readout: "Vector field / one attractor",
  },
  {
    n: "03",
    title: "Design",
    line: "We make power human. Clarity engineered into form, interaction, and identity.",
    tags: ["Product Design", "Brand Identity", "Interaction Systems"],
    field: "frame",
    readout: "Subdivision / orthogonal",
  },
  {
    n: "04",
    title: "Technology",
    line: "We build the systems. Energy flows through architecture, code, and infrastructure.",
    tags: ["Software Engineering", "AI Systems", "Enterprise Platforms"],
    field: "network",
    readout: "Signal graph / live",
  },
  {
    n: "05",
    title: "Products",
    line: "Ideas become industry. Power radiates outward into markets.",
    tags: ["Relay", "Tenure", "Ledger"],
    field: "radiate",
    readout: "Emission / outward",
  },
  {
    n: "06",
    title: "Impact",
    line: "Systems that outlive the engagement. Momentum that compounds year after year.",
    tags: ["Five-Year Partnerships", "Managed Deployments", "Owned Infrastructure"],
    field: "compound",
    readout: "Compounding curve",
  },
];

const DISCIPLINES = [
  "Technology Strategy",
  "Digital Product Design",
  "Brand Strategy",
  "Software Engineering",
  "Artificial Intelligence",
  "Enterprise Systems",
  "Research",
  "Innovation",
  "Digital Transformation",
];

/* Every figure here has to survive someone checking it. The previous set
   claimed 18 markets across four continents and 12+ market-defining products;
   an invented number is the one thing on a page like this that can cost a
   deal, so these are the four we can stand behind. */
const STATS = [
  { v: "4", l: "Founders. One standard, one signature." },
  { v: "7", l: "Platforms live and open to inspection" },
  { v: "2020", l: "Longest partnership — still deployed by us" },
  { v: "5", l: "Products on one platform we own" },
];

/** The plate each product draws on the landing strip. */
const PRODUCT_FIELD: Record<string, FieldVariant> = {
  Relay: "flow",
  Tenure: "frame",
  Ledger: "vector",
  Concierge: "network",
  Roster: "radiate",
};

const CAPABILITIES: {
  t: string;
  d: string;
  items: string[];
  field: FieldVariant;
}[] = [
  {
    t: "Strategy",
    d: "We define the opportunity before a line is drawn or written.",
    items: ["Technology Strategy", "Brand Strategy", "Research", "Transformation"],
    field: "vector",
  },
  {
    t: "Design",
    d: "We give power a human form. Editorial. Precise. Felt.",
    items: ["Product Design", "Brand Identity", "Interaction", "Design Systems"],
    field: "frame",
  },
  {
    t: "Technology",
    d: "We engineer systems that turn direction into momentum.",
    items: ["Software Engineering", "AI Systems", "Enterprise Platforms", "Infrastructure"],
    field: "radiate",
  },
];

const FOUNDER_CARDS = [
  { name: "Nelson Mwangi", photo: "/team/nelson.jpg" },
  { name: "Adrian Mang'are", photo: "/team/adrian.jpg" },
  { name: "Angelo Makory", photo: "/team/angelo.jpg" },
  { name: "Cyprian Kibet", photo: "/team/cyprian.jpg" },
];

export default function Home() {
  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <Hero />

      {/* ---------------- DISCIPLINE TICKER ---------------- */}
      <section className="relative overflow-hidden border-y border-white/10 bg-graphite/40 py-6">
        <div className="marquee-track">
          {[...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <span
              key={i}
              className="mx-8 flex items-center gap-8 font-mono text-xs tracking-[0.3em] whitespace-nowrap text-chrome uppercase"
            >
              {d}
              <span className="block h-1.5 w-1.5 rotate-45 bg-white/45" />
            </span>
          ))}
        </div>
        {/* The ticker runs off both edges rather than stopping at them. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,#080808,transparent)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,#080808,transparent)]" />
      </section>

      {/* ---------------- STATS ---------------- */}
      <section
        data-chapter="Standing"
        className="section-tex mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-28"
      >
        <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="flex items-baseline gap-4">
                <p className="stat-num text-[clamp(3.5rem,6vw,5.5rem)]">{s.v}</p>
                <span className="font-mono text-[0.6rem] tracking-[0.24em] text-steel tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="hairline my-4" />
              <p className="max-w-[26ch] text-sm leading-relaxed text-silver">
                {s.l}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- BELIEF ---------------- */}
      <section
        data-chapter="Belief"
        className="panel section-tex relative overflow-hidden"
      >
        <div className="relative mx-auto max-w-[1600px] px-6 py-36 md:px-12 md:py-48">
          <Reveal>
            <p className="label mb-12">Core Belief</p>
          </Reveal>
          <h2 className="display headline-lit text-[clamp(2.8rem,7vw,6.5rem)]">
            <RevealWords text="Technology is power." />
            <br />
            <span className="text-silver">
              <RevealWords text="Strategy gives it purpose." delay={0.2} />
            </span>
            <br />
            <RevealWords text="Design makes it human." delay={0.4} chrome />
          </h2>
          <div className="mt-20 grid gap-10 md:grid-cols-3">
            {[
              {
                t: "Not a software company.",
                d: "Software is an output. We build the systems, direction, and momentum behind it.",
              },
              {
                t: "Not an agency.",
                d: "Agencies execute briefs. We architect businesses and stay for the compounding.",
              },
              {
                t: "A technology house.",
                d: "Strategy, design, and engineering under one roof — one standard, one signature.",
              },
            ].map((b, i) => (
              <Reveal key={b.t} delay={0.1 + i * 0.1}>
                <DrawnLine delay={0.1 + i * 0.1} />
                <h3 className="display mt-6 text-2xl md:text-3xl">{b.t}</h3>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-silver">
                  {b.d}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3} className="mt-16">
            <Link
              href="/about"
              className="font-mono text-xs tracking-[0.25em] text-white uppercase underline-offset-8 transition-all duration-500 hover:underline"
            >
              About Astralyn →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- THE JOURNEY ---------------- */}
      <section
        data-chapter="Transformation"
        className="landing-bone relative overflow-hidden"
      >
        <div className="relative mx-auto max-w-[1600px] px-6 py-36 md:px-12 md:py-44">
          <Reveal>
            <p className="label">The Transformation</p>
            <h2 className="display landing-bone__headline mt-6 mb-24 max-w-4xl text-[clamp(2.2rem,5vw,4rem)]">
              How dormant ideas become market-defining products.
            </h2>
          </Reveal>

          <div className="space-y-28 md:space-y-36">
            {CHAPTERS.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <div key={c.n}>
                  <DrawnLine />
                  <div
                    className={`mt-10 flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${
                      flip ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <Reveal className="md:w-1/2">
                      <div className="flex items-baseline gap-6">
                        <p className="display-outline text-[clamp(2.5rem,5vw,4.5rem)]">
                          {c.n}
                        </p>
                        <h3 className="display text-[clamp(2.8rem,7vw,6.5rem)] uppercase">
                          {c.title}
                        </h3>
                      </div>
                      <p className="mt-6 max-w-md text-lg leading-relaxed text-black/70">
                        {c.line}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="border border-black/25 px-4 py-2 font-mono text-[0.65rem] tracking-[0.2em] text-black/75 uppercase"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </Reveal>

                    {/* The plate drifts against the scroll — the camera move
                        the chapters were missing. */}
                    <Parallax
                      className="md:w-1/2"
                      distance={flip ? -34 : 34}
                    >
                      <MaskWipe delay={0.08} from={flip ? "left" : "bottom"}>
                        <Plate
                          variant={c.field}
                          seed={11 + i * 7}
                          className="aspect-[16/10] w-full"
                          label={`Chapter ${c.n}`}
                          readout={c.readout}
                        />
                      </MaskWipe>
                    </Parallax>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- CAPABILITIES ---------------- */}
      <section data-chapter="Capabilities" className="panel relative">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <Reveal>
            <p className="label">Capabilities</p>
            <h2 className="display headline-lit mt-6 mb-20 text-[clamp(2.2rem,5vw,4rem)]">
              Three forces. One signature.
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.t} delay={i * 0.1}>
                <CardLit className="glass group flex h-full flex-col overflow-hidden transition-colors duration-700 hover:border-white/25">
                  <MaskWipe delay={0.12 + i * 0.08}>
                    <Plate
                      variant={c.field}
                      seed={41 + i * 13}
                      className="aspect-[16/9] w-full border-0 border-b border-white/10"
                    />
                  </MaskWipe>
                  <div className="flex flex-1 flex-col p-10 md:p-12">
                    <span className="font-mono text-xs text-steel-2 tabular-nums">
                      {`0${i + 1}`}
                    </span>
                    <h3 className="display mt-5 text-3xl md:text-4xl">{c.t}</h3>
                    <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-silver">
                      {c.d}
                    </p>
                    <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
                      {c.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.18em] text-chrome uppercase"
                        >
                          <span className="block h-1 w-1 rotate-45 bg-white/50" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/about"
                      className="mt-10 inline-block font-mono text-[0.65rem] tracking-[0.25em] text-silver uppercase transition-colors duration-500 group-hover:text-white"
                    >
                      How we work →
                    </Link>
                  </div>
                </CardLit>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- THE WALL ---------------- */}
      <section
        data-chapter="Work"
        className="section-tex relative overflow-hidden"
      >
        <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-40">
          <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <p className="label">Selected Work</p>
                <h2 className="display headline-lit mt-6 max-w-2xl text-[clamp(2.2rem,5vw,4rem)]">
                  The names are{" "}
                  <span className="text-chrome-sheen">the work.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-md text-base leading-relaxed text-silver">
                  Importers, institutions, national platforms and shipped
                  games. Each one is live. What we changed inside each business
                  stays inside each business.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <Link href="/work" className="btn-core">
                See the wall
              </Link>
            </Reveal>
          </div>
          <WorkWall />
        </div>
      </section>

      {/* ---------------- PRODUCTS ---------------- */}
      <section data-chapter="Products" className="panel relative">
        <div className="mx-auto max-w-[1600px] px-6 py-36 md:px-12">
          <Reveal>
            <p className="label">Products</p>
            <h2 className="display headline-lit mt-6 mb-6 text-[clamp(2.2rem,5vw,4rem)]">
              We don&apos;t only build for clients.{" "}
              <span className="text-chrome-sheen">We build companies.</span>
            </h2>
            <p className="mb-16 max-w-2xl text-base leading-relaxed text-silver">
              Five products for operators who run physical things — vehicles,
              buildings, money, crews. All of them stand on one platform we
              own, which is why a suite this wide is possible at our size.
            </p>
          </Reveal>
          <div className="space-y-6">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06}>
                <Link href="/products" className="group block">
                  <CardLit className="glass chrome-edge flex flex-col gap-6 overflow-hidden transition-colors duration-700 hover:border-white/25 md:flex-row md:items-stretch">
                    <MaskWipe
                      delay={0.06}
                      from="left"
                      className="w-full md:w-2/5"
                    >
                      <Plate
                        variant={PRODUCT_FIELD[p.name] ?? "network"}
                        seed={71 + i * 17}
                        className="aspect-[16/9] w-full border-0 md:aspect-auto md:h-full"
                      />
                    </MaskWipe>
                    <div className="flex flex-1 flex-col justify-center gap-4 p-8 md:p-12">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-mono text-xs text-steel-2 tabular-nums">
                          {p.index}
                        </span>
                        <span className="chrome-badge">{p.status}</span>
                      </div>
                      <h3 className="display text-4xl uppercase md:text-6xl">
                        <span className="text-chrome-sheen">{p.name}</span>
                      </h3>
                      <p className="font-mono text-[0.65rem] tracking-[0.25em] text-steel-2 uppercase">
                        {p.category}
                      </p>
                      <p className="max-w-md text-sm leading-relaxed text-silver">
                        {p.line}
                      </p>
                    </div>
                  </CardLit>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15} className="mt-14">
            <div className="chrome-rule mb-8" />
            <p className="max-w-2xl font-mono text-[0.68rem] leading-relaxed tracking-[0.16em] text-steel uppercase">
              All five run on Astralyn Core — identity, payments, messaging,
              billing, documents, audit. Built once.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOUNDERS TEASER ---------------- */}
      <section
        data-chapter="Founders"
        className="section-tex relative overflow-hidden"
      >
        <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <p className="label">The Founders</p>
                <h2 className="display headline-lit mt-6 max-w-2xl text-[clamp(2.4rem,6vw,5rem)]">
                  Four minds.
                  <br />
                  <span className="text-chrome-sheen">One force.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-md text-base leading-relaxed text-silver">
                  Strategy fused with engineering. Design fused with technology.
                  The people who power Astralyn — presented the way they build:
                  as worlds, not profiles.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.25}>
              <Link href="/team" className="btn-core">
                Meet the Team
              </Link>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {FOUNDER_CARDS.map((f, i) => (
              <Reveal key={f.name} delay={0.08 + i * 0.07}>
                <Link href="/team" className="group block">
                  {/* The portraits are the only real photography on the site.
                      They used to alternate on a 24px vertical stagger, which
                      pushed the even cards past the section's overflow-hidden
                      edge and sheared the bottom off two of the four faces.
                      A straight row reads better here anyway — the composition
                      comes from the reveal stagger, which costs no layout. */}
                  <MaskWipe delay={0.1 + i * 0.08}>
                    <CardLit className="img-frame aspect-[3/4] w-full">
                      <img
                        src={f.photo}
                        alt={f.name}
                        loading="lazy"
                        decoding="async"
                        className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                      <div className="cap">
                        <p className="font-mono text-[0.6rem] tracking-[0.28em] text-white/60 uppercase">
                          {`0${i + 1}`}
                        </p>
                        <p className="display mt-1 text-lg text-white transition-colors duration-500 group-hover:text-chrome">
                          {f.name}
                        </p>
                      </div>
                    </CardLit>
                  </MaskWipe>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section
        data-chapter="Build"
        className="relative overflow-hidden bg-white py-32 text-black md:py-48"
      >
        <div className="mx-auto max-w-[1800px] px-6 text-center md:px-12">
          <Reveal>
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-black/60 uppercase">
              Build with Astralyn
            </p>
          </Reveal>
          <h2 className="display-black mt-8 text-[clamp(3.6rem,11vw,11rem)] uppercase">
            <RevealWords text="What will you" />
            <br />
            <span className="text-black/40">
              <RevealWords text="make next?" delay={0.2} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-12 max-w-xl text-lg leading-relaxed text-black/70 md:text-xl">
              Bring us the venture, product or business that deserves to move
              differently. We will help you give it direction, form and force.
            </p>
            <Link href={CTA.href} className="cta-inverse mt-12">
              Start a conversation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
