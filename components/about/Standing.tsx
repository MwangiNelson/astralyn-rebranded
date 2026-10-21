import { Reveal } from "@/components/motion/Reveal";

/* Every figure here has to survive someone checking it. The previous set
   claimed 18 markets across four continents and 12+ market-defining products;
   an invented number is the one thing on a page like this that can cost a
   deal, so these are the four we can stand behind. */
const STATS = [
  { v: "4", l: "Founders. Strategy, design and engineering" },
  { v: "7", l: "Platforms live and open to inspection" },
  // A duration, not a year: a bare "2020" read as a founding date beside "Est. 2023".
  { v: `${new Date().getFullYear() - 2020} yrs`, l: "Longest partnership, still deployed by us" },
  { v: "5", l: "Products on one platform we own" },
];

export default function Standing() {
  return (
    <section
      data-chapter="Standing"
      className="section-tex mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-28"
    >
      <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08}>
            <p className="stat-num text-[clamp(3.5rem,6vw,5.5rem)]">{s.v}</p>
            <div className="hairline my-4" />
            <p className="max-w-[26ch] text-sm leading-relaxed text-silver">{s.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
