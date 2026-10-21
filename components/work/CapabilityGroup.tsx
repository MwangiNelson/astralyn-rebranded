import Link from "next/link";
import { Reveal, RevealWords, MaskWipe } from "@/components/motion/Reveal";
import Plate from "@/components/Plate";
import CaseCard from "@/components/work/CaseCard";
import { CLIENTS } from "@/lib/clients";
import type { Capability } from "@/lib/work";

/** One thing we build: what it is, then the work that proves it. */
export default function CapabilityGroup({ cap, index }: { cap: Capability; index: number }) {
  const cases = cap.cases
    .map((c) => ({ ...c, client: CLIENTS.find((k) => k.name === c.client) }))
    .filter((c): c is typeof c & { client: NonNullable<typeof c.client> } => !!c.client);

  return (
    <section id={cap.id} data-chapter={cap.title} className="relative scroll-mt-24 border-t border-white/10">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-10 md:grid-cols-[5fr_7fr] md:gap-24">
          <div>
            <h2 className="display headline-lit text-[clamp(2rem,4.4vw,3.6rem)] text-balance">
              <RevealWords text={cap.title} chrome={index % 2 === 1} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-silver md:text-lg">
                {cap.intro}
              </p>
              <Link
                href={cap.next.href}
                className="mt-8 inline-block font-mono text-xs tracking-[0.25em] text-white uppercase underline-offset-8 transition-all duration-500 hover:underline"
              >
                {cap.next.label} →
              </Link>
            </Reveal>
          </div>

          {cases.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {cases.map((c, i) => (
                <Reveal key={c.client.name} delay={0.06 * i}>
                  <CaseCard client={c.client} summary={c.summary} />
                </Reveal>
              ))}
            </div>
          ) : (
            <MaskWipe delay={0.1}>
              <Link href={cap.next.href} className="group block">
                <Plate
                  variant={cap.field}
                  seed={37 + index * 11}
                  className="aspect-[16/9] w-full"
                  label={cap.title}
                  readout={cap.next.label}
                />
              </Link>
            </MaskWipe>
          )}
        </div>
      </div>
    </section>
  );
}
