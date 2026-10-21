import Link from "next/link";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { CTA } from "@/lib/site";

export default function HomeClose() {
  return (
    <section data-chapter="Start" className="relative">
      <div className="panel">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-24 md:grid-cols-[5fr_7fr] md:gap-24 md:px-12 md:py-32">
          <h2 className="display headline-lit text-[clamp(2rem,4.2vw,3.5rem)] text-balance">
            <RevealWords text="A technology house," />{" "}
            <RevealWords text="from strategy to engineering." delay={0.15} chrome />
          </h2>
          <Reveal delay={0.2} className="space-y-6 text-base leading-relaxed text-silver md:pt-3 md:text-lg">
            <p className="max-w-[56ch]">
              Astralyn brings strategy, design and engineering together to build
              software, business platforms and products. We work across the
              decisions that shape a system, from what it needs to do to how it
              will be built, deployed and maintained.
            </p>
            <p className="max-w-[56ch]">
              Our work includes technology built for individual organisations
              and products developed on Astralyn Core. In both cases, the aim is
              to understand the operation behind the brief and make sound
              decisions about the system that supports it.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="bg-white py-28 text-black md:py-44">
        <div className="mx-auto max-w-[1800px] px-6 text-center md:px-12">
          <h2 className="display-black text-[clamp(3rem,10vw,10rem)] uppercase">
            <RevealWords text="What are you" />
            <br />
            <span className="text-black/40">
              <RevealWords text="building?" delay={0.2} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <Link href={CTA.href} className="cta-inverse mt-14">
              Start something
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
