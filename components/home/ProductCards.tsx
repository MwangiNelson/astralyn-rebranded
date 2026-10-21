"use client";

import Link from "next/link";
import { Reveal, MaskWipe } from "@/components/motion/Reveal";
import CardLit from "@/components/CardLit";
import Plate from "@/components/Plate";
import type { FieldVariant } from "@/components/Field";
import { PRODUCTS } from "@/lib/products";

/** The plate each product draws; a product with a screenshot shows that instead. */
const PRODUCT_FIELD: Record<string, FieldVariant> = {
  Relay: "flow",
  Ledger: "vector",
  Concierge: "network",
  Roster: "radiate",
};

/* Where each product stands against Core, stated plainly. Only Nyumbisha runs
   on it today; claiming the whole suite does would be the one sentence on the
   page a technical buyer could disprove. */
const ON_CORE: Record<string, string> = {
  Nyumbisha: "Built on Astralyn Core.",
  Relay: "Runs on its own stack for now.",
};

export default function ProductCards() {
  return (
    <div className="mt-24 md:mt-32">
      <Reveal>
        <h3 className="display-title text-[clamp(1.6rem,3vw,2.5rem)]">What we build on it.</h3>
      </Reveal>
      <div className="mt-10 space-y-6">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06}>
            <Link href="/products" className="group block">
              <CardLit className="glass chrome-edge flex flex-col gap-6 overflow-hidden transition-colors duration-700 hover:border-white/25 md:flex-row md:items-stretch">
                <MaskWipe delay={0.06} from="left" className="w-full md:w-2/5">
                  <Plate
                    variant={PRODUCT_FIELD[p.name] ?? "network"}
                    seed={71 + i * 17}
                    image={p.image}
                    className="aspect-[16/9] w-full border-0 md:aspect-auto md:h-full"
                  />
                </MaskWipe>
                <div className="flex flex-1 flex-col justify-center gap-4 p-8 md:p-12">
                  <span className="chrome-badge w-fit">{p.status}</span>
                  <p className="display text-4xl uppercase md:text-6xl">
                    <span className="text-chrome-sheen">{p.name}</span>
                  </p>
                  <p className="font-mono text-[0.65rem] tracking-[0.25em] text-steel-2 uppercase">
                    {p.category}
                  </p>
                  <p className="max-w-md text-sm leading-relaxed text-silver">
                    {p.line}
                    {ON_CORE[p.name] && (
                      <span className="mt-1 block text-steel-2">{ON_CORE[p.name]}</span>
                    )}
                  </p>
                </div>
              </CardLit>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
