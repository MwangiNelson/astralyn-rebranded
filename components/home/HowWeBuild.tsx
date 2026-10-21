"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion, useScroll } from "framer-motion";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import ServiceLife from "@/components/home/ServiceLife";

/* Each principle is a decision we make on every build, stated so a buyer can
   hold us to it. Ordered along a system's life (day one, the first failure,
   the products that follow, the exit) so reading down the list walks the
   ServiceLife timeline. They link to the engineering philosophy once that
   page exists. */
const PRINCIPLES = [
  {
    t: "Security belongs in the design.",
    d: "Identity, permissions, data protection and security controls are architectural concerns, not tasks to leave until launch.",
  },
  {
    t: "Reliability is designed in.",
    d: "Systems fail. We plan for failure, limit its effects and make it possible to understand what happened and recover.",
  },
  {
    t: "Shared foundations, tested in practice.",
    d: "Astralyn Core provides common capabilities across our products. Improvements to that foundation can benefit more than one product, provided they are tested against each product's requirements.",
  },
  {
    t: "Your data should remain under your control.",
    d: "We consider data ownership, access, portability and exit arrangements when deciding how a system should be built.",
  },
];

export default function HowWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const full = useMotionValue(1);

  // The principle crossing the middle of the screen is the one being read.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      data-chapter="Approach"
      className="panel section-tex relative scroll-mt-20"
    >
      <div className="mx-auto grid max-w-[1600px] gap-16 px-6 py-24 md:grid-cols-[5fr_7fr] md:gap-24 md:px-12 md:py-0">
        <div className="md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:self-start md:pt-16">
          <h2 className="display headline-lit text-[clamp(2.2rem,5vw,4.25rem)] text-balance">
            <RevealWords text="Software has a" />{" "}
            <RevealWords text="long working life." delay={0.15} chrome />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-silver md:text-lg">
              The systems a business chooses today can shape how it operates for
              years. We design and engineer for that responsibility, from the
              first architectural decisions to the work of running and
              maintaining the system.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-14 hidden max-w-[520px] md:block">
            <ServiceLife progress={reduce ? full : scrollYProgress} active={active} />
          </Reveal>
        </div>

        <div className="space-y-12 md:space-y-0 md:py-[30svh]">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.t}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-i={i}
              className={`transition-opacity duration-500 md:py-14 ${
                active === i ? "md:opacity-100" : "md:opacity-40"
              }`}
            >
              <Reveal delay={0.05 * i}>
                <DrawnLine delay={0.05 * i} />
                <h3 className="display-title mt-8 max-w-[24ch] text-[clamp(1.5rem,2.4vw,2.1rem)]">
                  {p.t}
                </h3>
                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-silver md:text-base">
                  {p.d}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
