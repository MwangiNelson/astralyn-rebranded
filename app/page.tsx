import Hero from "@/components/Hero";
import StackCard from "@/components/home/StackCard";
import HowWeBuild from "@/components/home/HowWeBuild";
import CoreFoundation from "@/components/home/CoreFoundation";
import HomeClose from "@/components/home/HomeClose";

/* The homepage is the front door for how we think and build, nothing more.
   Client work, founders and figures live one level down (/work, /team,
   /about) where a visitor can examine them, rather than competing here.
   "What matters now" joins between Approach and Core once two articles are
   published; an empty shell of it would read as a promise not yet kept. */

const DISCIPLINES = [
  "Technology Strategy",
  "Digital Product Design",
  "Brand Strategy",
  "Software Engineering",
  "Artificial Intelligence",
  "Cybersecurity Solutions",
  "Enterprise Systems",
  "Digital Transformation",
];

export default function Home() {
  return (
    <>
      <StackCard>
        <Hero />
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
      </StackCard>
      <StackCard>
        <HowWeBuild />
      </StackCard>
      <StackCard>
        <CoreFoundation />
      </StackCard>
      <StackCard>
        <HomeClose />
      </StackCard>
    </>
  );
}
