"use client";

import Link from "next/link";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import CardLit from "@/components/CardLit";
import Hero from "@/components/Hero";
import { CTA } from "@/lib/site";

const CHAPTERS = [
  {
    n: "01",
    title: "Potential",
    line: "Every idea begins dormant. Silent. Full of stored energy, waiting for direction.",
    tags: ["Discovery", "Research", "Opportunity Mapping"],
    art: "/art/sig-03.svg",
  },
  {
    n: "02",
    title: "Strategy",
    line: "We define the opportunity before a line is drawn or written. Direction before motion.",
    tags: ["Technology Strategy", "Brand Strategy", "Market Engineering"],
    art: "/art/field-teal.svg",
  },
  {
    n: "03",
    title: "Design",
    line: "We make power human. Clarity engineered into form, interaction, and identity.",
    tags: ["Product Design", "Brand Identity", "Interaction Systems"],
    art: "/art/nebula-dual.svg",
  },
  {
    n: "04",
    title: "Technology",
    line: "We build the systems. Energy flows through architecture, code, and infrastructure.",
    tags: ["Software Engineering", "AI Systems", "Enterprise Platforms"],
    art: "/art/corridor.svg",
  },
  {
    n: "05",
    title: "Products",
    line: "Ideas become industry. Power radiates outward into markets.",
    tags: ["Meridian", "Axiom Rail", "Obsidian"],
    art: "/art/field-amber.svg",
  },
  {
    n: "06",
    title: "Impact",
    line: "Market-defining outcomes. Momentum that compounds year after year.",
    tags: ["3.2× Revenue", "18 Markets", "Long-term Partnership"],
    art: "/art/chrome-macro.svg",
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

const STATS = [
  { v: "4", l: "Founders. One standard, one signature." },
  { v: "12+", l: "Market-defining products engineered" },
  { v: "18", l: "Markets powered across four continents" },
  { v: "∞", l: "Ideas waiting to become industry" },
];

const PRODUCTS = [
  {
    name: "Meridian",
    line: "Autonomous operations. A platform that runs the machine so people can run the business.",
    tag: "AI OPERATIONS",
    art: "/art/field-teal.svg",
  },
  {
    name: "Axiom Rail",
    line: "Financial infrastructure engineered for motion. Money that moves like light.",
    tag: "FINTECH INFRASTRUCTURE",
    art: "/art/nebula-dual.svg",
  },
  {
    name: "Obsidian",
    line: "Enterprise intelligence. Every signal in the organization, made visible.",
    tag: "ENTERPRISE INTELLIGENCE",
    art: "/art/field-amber.svg",
  },
];

const CAPABILITIES = [
  {
    t: "Strategy",
    d: "We define the opportunity before a line is drawn or written.",
    items: ["Technology Strategy", "Brand Strategy", "Research", "Transformation"],
    art: "/art/field-teal.svg",
  },
  {
    t: "Design",
    d: "We give power a human form. Editorial. Precise. Felt.",
    items: ["Product Design", "Brand Identity", "Interaction", "Design Systems"],
    art: "/art/corridor.svg",
  },
  {
    t: "Technology",
    d: "We engineer systems that turn direction into momentum.",
    items: ["Software Engineering", "AI Systems", "Enterprise Platforms", "Infrastructure"],
    art: "/art/chrome-macro.svg",
  },
];

const MATERIALS = [
  { t: "Liquid Chrome", k: "Primary Material", art: "/art/chrome-macro.svg" },
  { t: "Infinite Architecture", k: "Depth & Perspective", art: "/art/corridor.svg" },
  { t: "Contained Energy", k: "The Core", art: "/art/field-teal.svg" },
  { t: "Amber Horizon", k: "Warmth & Arrival", art: "/art/field-amber.svg" },
  { t: "Dual Grade", k: "Cinematic Light", art: "/art/nebula-dual.svg" },
  { t: "Signal Field", k: "Intelligence", art: "/art/sig-03.svg" },
];

const FOUNDER_SIGS = [
  { name: "Nelson Mwangi", art: "/art/sig-01.svg" },
  { name: "Adrian Mang'are", art: "/art/sig-02.svg" },
  { name: "Angelo Makory", art: "/art/sig-03.svg" },
  { name: "Cyprian Kibet", art: "/art/sig-04.svg" },
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
              <span className="block h-1.5 w-1.5 rotate-45 bg-teal" />
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="section-tex mx-auto max-w-[1600px] px-6 py-28 md:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <p className="stat-num text-[clamp(3.5rem,6vw,5.5rem)]">{s.v}</p>
              <div className="hairline my-4" />
              <p className="text-sm leading-relaxed text-silver">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- BELIEF ---------------- */}
      <section className="panel section-tex relative overflow-hidden">
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
            <span className="text-chrome-sheen">
              <RevealWords text="Design makes it human." delay={0.4} />
            </span>
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
                <p className="font-mono text-xs text-teal">{`0${i + 1}`}</p>
                <h3 className="display mt-3 text-2xl md:text-3xl">{b.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-silver">{b.d}</p>
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
      <section className="section-tex relative mx-auto max-w-[1600px] px-6 py-36 md:px-12">
        <Reveal>
          <p className="label">The Transformation</p>
          <h2 className="display headline-lit mt-6 mb-24 max-w-4xl text-[clamp(2.2rem,5vw,4rem)]">
            How dormant ideas become{" "}
            <span className="text-white">market-defining products.</span>
          </h2>
        </Reveal>

        <div className="space-y-24 md:space-y-28">
          {CHAPTERS.map((c, i) => (
            <div key={c.n}>
              <DrawnLine />
              <div
                className={`mt-10 flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
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
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-silver">
                    {c.line}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-white/10 px-4 py-2 font-mono text-[0.65rem] tracking-[0.2em] text-chrome uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={0.1} className="md:w-1/2">
                  <CardLit className="img-frame group aspect-[16/10] w-full">
                    <img src={c.art} alt={`${c.title} — Astralyn`} />
                    <div className="cap">
                      <p className="font-mono text-[0.6rem] tracking-[0.3em] text-white/70 uppercase">
                        Chapter {c.n}
                      </p>
                    </div>
                  </CardLit>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CAPABILITIES ---------------- */}
      <section className="panel relative">
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
                  <div className="img-frame aspect-[16/9] w-full border-0 border-b border-white/10">
                    <img src={c.art} alt={`${c.t} — Astralyn`} />
                  </div>
                  <div className="p-10 md:p-12">
                    <p className="font-mono text-xs text-teal">{`0${i + 1}`}</p>
                    <h3 className="display mt-5 text-3xl md:text-4xl">{c.t}</h3>
                    <p className="mt-5 text-sm leading-relaxed text-silver">
                      {c.d}
                    </p>
                    <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
                      {c.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.18em] text-chrome uppercase"
                        >
                          <span className="block h-1 w-1 rotate-45 bg-teal" />
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

      {/* ---------------- MATERIALS GALLERY ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-36 md:px-12">
        <Reveal>
          <p className="label">The Materials</p>
          <h2 className="display headline-lit mt-6 mb-16 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">
            Liquid chrome. Controlled light.{" "}
            <span className="text-chrome-sheen">Engineered depth.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {MATERIALS.map((m, i) => (
            <Reveal key={m.t} delay={(i % 3) * 0.08}>
              <CardLit
                className={`img-frame group w-full ${
                  i === 0 ? "aspect-[16/10] md:col-span-2" : "aspect-square"
                }`}
              >
                <img src={m.art} alt={m.t} />
                <div className="cap">
                  <p className="font-mono text-[0.6rem] tracking-[0.3em] text-teal uppercase">
                    {m.k}
                  </p>
                  <p className="display mt-1 text-lg text-white md:text-xl">
                    {m.t}
                  </p>
                </div>
              </CardLit>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- PRODUCTS ---------------- */}
      <section className="panel relative">
        <div className="mx-auto max-w-[1600px] px-6 py-36 md:px-12">
          <Reveal>
            <p className="label">Products</p>
            <h2 className="display headline-lit mt-6 mb-16 text-[clamp(2.2rem,5vw,4rem)]">
              We don&apos;t only build for clients.{" "}
              <span className="text-chrome-sheen">We build companies.</span>
            </h2>
          </Reveal>
          <div className="space-y-6">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <Link href="/products" className="group block">
                  <CardLit className="glass flex flex-col gap-6 overflow-hidden transition-colors duration-700 hover:border-white/25 md:flex-row md:items-stretch">
                    <div className="img-frame aspect-[16/9] w-full border-0 md:aspect-auto md:w-2/5">
                      <img src={p.art} alt={p.name} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-4 p-8 md:p-12">
                      <span className="font-mono text-xs text-teal">{`0${i + 1}`}</span>
                      <h3 className="display text-4xl uppercase transition-colors duration-500 group-hover:text-chrome md:text-6xl">
                        {p.name}
                      </h3>
                      <p className="font-mono text-[0.65rem] tracking-[0.25em] text-steel-2 uppercase">
                        {p.tag}
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
        </div>
      </section>

      {/* ---------------- FOUNDERS TEASER ---------------- */}
      <section className="section-tex relative overflow-hidden">
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
              <Link href="/founders" className="btn-core">
                Enter the Monoliths
              </Link>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {FOUNDER_SIGS.map((f, i) => (
              <Reveal key={f.name} delay={0.08 + i * 0.07}>
                <Link href="/founders" className="group block">
                  <CardLit className="img-frame aspect-[3/4] w-full">
                    <img src={f.art} alt={f.name} />
                    <div className="cap">
                      <p className="font-mono text-[0.6rem] tracking-[0.28em] text-white/60 uppercase">
                        {`0${i + 1}`}
                      </p>
                      <p className="display mt-1 text-lg text-white transition-colors duration-500 group-hover:text-chrome">
                        {f.name}
                      </p>
                    </div>
                  </CardLit>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative overflow-hidden bg-white py-32 text-black md:py-48">
        <div className="mx-auto max-w-[1800px] px-6 text-center md:px-12">
          <Reveal>
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-black/60 uppercase">
              Build with Astralyn
            </p>
          </Reveal>
          <h2 className="display-black mt-8 text-[clamp(4.4rem,12vw,12rem)] uppercase">
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
