"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CTA } from "@/lib/site";
import EnergyWord from "@/components/EnergyWord";
import MetallicPaint from "@/components/MetallicPaint";

const EASE = [0.22, 1, 0.36, 1] as const;
const LINES = ["Power the", "next generation", "of business"];

export default function Hero() {
  const [go, setGo] = useState(false);
  const [clock, setClock] = useState("");

  // Time the intro to the preloader reveal (falls back if it's absent).
  useEffect(() => {
    const trigger = () => setGo(true);
    window.addEventListener("astralyn:ready", trigger);
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("astralyn_preloaded");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) setGo(true);
    const fallback = window.setTimeout(trigger, 1500);
    return () => {
      window.removeEventListener("astralyn:ready", trigger);
      window.clearTimeout(fallback);
    };
  }, []);

  // Live clock — rendered only after mount to avoid hydration mismatch.
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Africa/Nairobi",
      }).format(new Date());
    setClock(fmt());
    const id = window.setInterval(() => setClock(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-midnight">
      {/* A precise field of light — movement without a colour cast. */}
      <div className="grid-bg grid-bg-fade absolute inset-0 opacity-80" />
      <div className="hero-metal-logo" aria-hidden>
        {/* A faint perimeter remains while the metallic logo resolves. */}
        <svg
          className="hero-metal-logo__outline"
          viewBox="-30 -30 226.9 234"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter
              id="hero-metal-logo-outline-filter"
              x="-8%"
              y="-8%"
              width="116%"
              height="116%"
              colorInterpolationFilters="sRGB"
            >
              <feMorphology in="SourceAlpha" operator="dilate" radius="0.72" result="expanded" />
              <feComposite in="expanded" in2="SourceAlpha" operator="out" result="edge" />
              <feFlood floodColor="#f5f5f0" floodOpacity="0.3" result="outlineColor" />
              <feComposite in="outlineColor" in2="edge" operator="in" />
            </filter>
          </defs>
          <image
            href="/astralyn_logo_metal.svg"
            x="-30"
            y="-30"
            width="226.9"
            height="234"
            filter="url(#hero-metal-logo-outline-filter)"
          />
        </svg>
        <div className="hero-metal-logo__paint">
          <MetallicPaint
            imageSrc="/astralyn_logo_metal.svg"
            seed={42}
            scale={3.2}
            patternSharpness={1.1}
            noiseScale={0.45}
            speed={0.16}
            liquid={0.48}
            brightness={1.45}
            contrast={0.72}
            refraction={0.006}
            blur={0.012}
            chromaticSpread={1.25}
            fresnel={0.82}
            waveAmplitude={0.72}
            distortion={0.35}
            contour={0.28}
            lightColor="#f5f5f0"
            darkColor="#2d3034"
            tintColor="#d9e7e3"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_52%_at_12%_88%,rgba(245,245,240,0.07),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.96)_0%,rgba(8,8,8,0.78)_43%,rgba(8,8,8,0.2)_78%,rgba(8,8,8,0)_100%)]" />

      {/* Top HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-10 mx-auto flex max-w-[1600px] items-center justify-between px-6 md:top-28 md:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: go ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="font-mono text-[0.6rem] tracking-[0.32em] text-silver uppercase"
        >
          Technology House
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: go ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="font-mono text-[0.6rem] tracking-[0.28em] text-silver uppercase tabular-nums"
        >
          Nairobi — {clock || "--:--:--"} EAT
        </motion.p>
      </div>

      {/* Center — the statement */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: go ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mb-7 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-chrome/60" />
          <span className="font-mono text-[0.62rem] tracking-[0.32em] text-chrome uppercase">
            Strategy · Design · Technology
          </span>
        </motion.div>

        <h1 className="display-black headline-lit text-[clamp(2.75rem,min(8.75vw,14svh),9rem)] leading-[0.84] uppercase">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${i === 1 ? "text-chrome-sheen" : "text-white"}`}
                initial={{ y: "115%" }}
                animate={go ? { y: 0 } : { y: "115%" }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease: EASE }}
              >
                {i === 0 ? (
                  <>
                    <EnergyWord>Power</EnergyWord>
                    {" the"}
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={go ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
          className="mt-8 flex max-w-2xl flex-col gap-7"
        >
          <p className="text-base leading-relaxed text-chrome md:text-lg">
            A technology house. We architect businesses, engineer products, and
            shape the future — through strategy, design, and technology.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href={CTA.href} className="btn-core btn-solid">
              Start Something
            </Link>
            <Link href="/work" className="btn-core">
              Selected Work
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: go ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1, ease: EASE }}
          className="font-mono text-[0.6rem] tracking-[0.3em] text-silver uppercase"
        >
          Est. 2023
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: go ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1, ease: EASE }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[0.58rem] tracking-[0.34em] text-silver uppercase">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="block h-10 w-px bg-gradient-to-b from-chrome to-transparent"
          />
        </motion.div>
        <span className="hidden w-[88px] md:block" />
      </div>
    </section>
  );
}
