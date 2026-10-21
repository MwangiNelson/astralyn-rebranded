import { Reveal, DrawnLine } from "@/components/motion/Reveal";

/* Not / Not / Is: the house defined against the two things buyers mistake it for. */
const POSITIONS = [
  {
    t: "Not a software company.",
    d: "Software is the output. We build the business behind it.",
  },
  {
    t: "Not an agency.",
    d: "Agencies execute briefs. We architect businesses and stay for the compounding.",
  },
  {
    t: "A technology house.",
    d: "Strategy, design and engineering under one roof. One standard, one signature.",
  },
];

export default function Positioning() {
  return (
    <section data-chapter="Position" className="panel section-tex relative">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-28 md:grid-cols-3 md:px-12 md:py-36">
        {POSITIONS.map((b, i) => (
          <Reveal key={b.t} delay={0.1 + i * 0.1}>
            <DrawnLine delay={0.1 + i * 0.1} />
            <h3 className="display mt-6 text-2xl md:text-3xl">{b.t}</h3>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-silver">{b.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
