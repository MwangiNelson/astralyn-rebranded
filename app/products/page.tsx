"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, RevealWords, DrawnLine, MaskWipe } from "@/components/motion/Reveal";
import CardLit from "@/components/CardLit";
import Plate from "@/components/Plate";
import type { FieldVariant } from "@/components/Field";
import { PRODUCTS, CORE_SERVICES, type Product } from "@/lib/products";
import { CTA } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------
   PRODUCTS — a suite on a platform, not a lineup of logos.

   Each product is treated like a launch. Status is stated plainly at the
   top of every one, because a concept presented as a shipping product is
   the fastest way to lose a buyer who checks.
------------------------------------------------------------------- */

/** The plate each product draws — matched to what the product actually does. */
const FIELD: Record<string, FieldVariant> = {
  Relay: "flow",
  Ledger: "vector",
  Concierge: "network",
  Roster: "radiate",
};

function StatusMark({ status }: { status: Product["status"] }) {
  const live = status === "Live";
  return (
    <span className="chrome-badge">
      <span
        aria-hidden
        className={`block h-1.5 w-1.5 rotate-45 ${
          live ? "status-blink bg-white" : "bg-steel"
        }`}
      />
      {status}
    </span>
  );
}

function ProductLaunch({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glow = useTransform(scrollYProgress, [0, 0.35, 0.75], [0, 1, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden py-32 md:py-44">
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_50%_at_78%_28%,rgba(245,245,240,0.07),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        {/* Identity */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <p className="font-mono text-sm text-steel">{product.index}</p>
            <p className="label">{product.category}</p>
            <StatusMark status={product.status} />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="display mt-10 text-[clamp(2.2rem,4.5vw,3.4rem)] uppercase">
            <span className="text-chrome-sheen">{product.name}</span>
            <span className="ml-4 align-middle font-mono text-xs tracking-[0.24em] text-steel-2 normal-case">
              by Astralyn
            </span>
          </p>
        </Reveal>

        {/* Story headline */}
        <h2 className="display mt-6 max-w-5xl text-[clamp(2.2rem,5.2vw,4.6rem)]">
          <RevealWords text={product.headline[0]} delay={0.12} />
          <br />
          <RevealWords text={product.headline[1]} delay={0.3} chrome />
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
          <div>
            {/* Problem / Solution */}
            <Reveal>
              <p className="label mb-5">The Problem</p>
              <p className="max-w-xl text-base leading-relaxed text-silver md:text-lg">
                {product.problem}
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-14">
              <p className="label mb-5">The Solution</p>
              <p className="max-w-xl text-base leading-relaxed text-white md:text-lg">
                {product.solution}
              </p>
            </Reveal>

            {/* Capabilities */}
            <Reveal delay={0.2} className="mt-14">
              <p className="label mb-6">Capability</p>
              <ul className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {product.pillars.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 bg-midnight px-5 py-4 font-mono text-[0.68rem] tracking-[0.16em] text-chrome uppercase"
                  >
                    <span
                      aria-hidden
                      className="block h-1 w-1 shrink-0 rotate-45 bg-white/50"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* The plate + the specification */}
          <div>
            <MaskWipe delay={0.1}>
              <Plate
                variant={FIELD[product.name] ?? "network"}
                seed={product.name.length * 13 + 7}
                className="aspect-[16/11] w-full"
                image={product.image}
                label={product.image ? undefined : product.name}
                readout={product.image ? undefined : product.category}
              />
            </MaskWipe>

            <Reveal delay={0.15} className="mt-10">
              <div className="chrome-rule mb-8" />
              <p className="label mb-3">Built for</p>
              <p className="text-sm leading-relaxed text-silver">
                {product.audience}
              </p>

              {product.site ? (
                <a
                  href={product.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-core mt-10 w-full justify-center"
                >
                  Visit {product.name}
                </a>
              ) : (
                <Link
                  href={CTA.href}
                  className="btn-core mt-10 w-full justify-center"
                >
                  {product.status === "Live" ? "Request access" : "Register interest"}
                </Link>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  const shipping = PRODUCTS.filter((p) => p.status !== "Concept").length;

  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative flex min-h-[82svh] items-center overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_56%_at_80%_36%,rgba(245,245,240,0.1),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.8)_46%,rgba(0,0,0,0)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-40 pb-24 md:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: EASE }}
            className="label mb-10"
          >
            Products — Five products. One platform.
          </motion.p>
          <h1 className="display max-w-6xl text-[clamp(3.2rem,9vw,8.5rem)] text-white uppercase">
            <RevealWords text="Ideas become" delay={0.2} />
            <br />
            <RevealWords text="industry" delay={0.6} chrome />
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.6, ease: EASE }}
            className="mt-12 max-w-xl text-lg leading-relaxed text-chrome"
          >
            We build for operators who run physical things — vehicles,
            buildings, money, crews. Five products, each engineered end to end,
            all standing on infrastructure we own.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1.4, ease: EASE }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {PRODUCTS.map((p) => (
              <span key={p.name} className="chrome-badge">
                {p.name}
              </span>
            ))}
          </motion.div>
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

      {/* ---------------- THE PLATFORM ---------------- */}
      <section className="panel section-tex relative overflow-hidden">
        <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
          <Reveal>
            <p className="label">Astralyn Core</p>
            <h2 className="display headline-lit mt-6 max-w-4xl text-[clamp(2.2rem,5vw,4rem)]">
              The products are the surface.{" "}
              <span className="text-chrome-sheen">This is the company.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver md:text-lg">
              Every product above needs identity, payments, messaging, billing,
              documents and an audit trail. We built those six once. A new
              product starts at its own first feature instead of at a login
              screen — which is why a suite this wide is possible at our size.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {CORE_SERVICES.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.06}>
                <CardLit className="chrome-edge group flex h-full flex-col bg-midnight p-8 md:p-10">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="display text-2xl md:text-3xl">
                      <span className="text-chrome-sheen">{s.name}</span>
                    </h3>
                    <span className="font-mono text-[0.55rem] tracking-[0.2em] text-steel tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[0.6rem] tracking-[0.22em] text-steel-2 uppercase">
                    {s.role}
                  </p>
                  <div className="chrome-rule my-6" />
                  <p className="text-sm leading-relaxed text-silver">
                    {s.detail}
                  </p>
                </CardLit>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-14">
            <p className="max-w-2xl font-mono text-[0.68rem] leading-relaxed tracking-[0.16em] text-steel uppercase">
              {shipping} of {PRODUCTS.length} shipping or in build · Six shared
              services · One sign-in across the suite
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- SIGNATURE ---------------- */}
      <section className="relative overflow-hidden py-48 text-center md:py-64">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,246,247,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <h2 className="display text-[clamp(2.2rem,6vw,5.5rem)] uppercase">
            <RevealWords text="Your product" />
            <br />
            <RevealWords text="belongs here" delay={0.3} chrome />
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
