"use client";

import { Reveal, DrawnLine, MaskWipe, Parallax } from "@/components/motion/Reveal";
import Plate from "@/components/Plate";
import type { FieldVariant } from "@/components/Field";

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
    line: "Every business starts with an idea that hasn't moved yet. We find the direction.",
    tags: ["Discovery", "Research", "Opportunity Mapping"],
    field: "dormant",
    readout: "Charge / dormant lattice",
  },
  {
    n: "02",
    title: "Strategy",
    line: "We define your opportunity before a line is drawn or written. Direction before motion.",
    tags: ["Technology Strategy", "Brand Strategy", "Market Engineering"],
    field: "vector",
    readout: "Vector field / one attractor",
  },
  {
    n: "03",
    title: "Design",
    line: "Your customers and your staff understand it the first time they use it.",
    tags: ["Product Design", "Brand Identity", "Interaction Systems"],
    field: "frame",
    readout: "Subdivision / orthogonal",
  },
  {
    n: "04",
    title: "Technology",
    line: "Your systems run on architecture built to carry the load, not just pass the demo.",
    tags: ["Software Engineering", "AI Systems", "Enterprise Platforms"],
    field: "network",
    readout: "Signal graph / live",
  },
  {
    n: "05",
    title: "Products",
    line: "Your idea becomes something the market uses every day.",
    tags: ["Nyumbisha", "Relay", "Ledger"],
    field: "radiate",
    readout: "Emission / outward",
  },
  {
    n: "06",
    title: "Impact",
    line: "Systems that outlive the engagement. Momentum that compounds year after year.",
    tags: ["Multi-Year Partnerships", "Managed Deployments", "Owned Infrastructure"],
    field: "compound",
    readout: "Compounding curve",
  },
];

export default function Transformation() {
  return (
    <section data-chapter="Transformation" className="landing-bone relative overflow-hidden">
      <div className="relative mx-auto max-w-[1600px] px-6 py-36 md:px-12 md:py-44">
        <Reveal>
          <p className="label">The Transformation</p>
          <h2 className="display landing-bone__headline mt-6 mb-24 max-w-4xl text-[clamp(2.2rem,5vw,4rem)]">
            How an idea becomes a system people rely on.
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
                      <p className="display-outline text-[clamp(2.5rem,5vw,4.5rem)]">{c.n}</p>
                      <h3 className="display text-[clamp(2.8rem,7vw,6.5rem)] uppercase">
                        {c.title}
                      </h3>
                    </div>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-black/70">{c.line}</p>
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
                  <Parallax className="md:w-1/2" distance={flip ? -34 : 34}>
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
  );
}
