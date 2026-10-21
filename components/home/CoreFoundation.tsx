import { Reveal, RevealWords } from "@/components/motion/Reveal";
import ProductCards from "@/components/home/ProductCards";
import { CORE_SERVICES } from "@/lib/products";

/* Written for the business reading it, not for the product it was first used
   in. Client builds do not run on Core today, so the section promises how we
   think about these six concerns, and keeps Core itself to our own products. */
export default function CoreFoundation() {
  return (
    <section id="core" data-chapter="Core" className="section-tex relative scroll-mt-20">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-40">
        <div className="grid gap-10 md:grid-cols-[5fr_7fr] md:gap-24">
          <h2 className="display headline-lit text-[clamp(2.2rem,5vw,4.25rem)] text-balance">
            <RevealWords text="The products share" />{" "}
            <RevealWords text="a foundation." delay={0.15} chrome />
          </h2>
          <Reveal delay={0.2} className="space-y-6 text-base leading-relaxed text-silver md:pt-3 md:text-lg">
            <p className="max-w-[56ch]">
              Almost every business system needs the same six things underneath
              it: sign-in, payments, messaging, billing, documents and a record
              of who did what. Astralyn Core is those six, built once, so each
              of our products starts with them already solved and tested.
            </p>
            <p className="max-w-[56ch]">
              The same six questions shape the systems we build for clients. We
              design for them from the first conversation, not after launch.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-12 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
          {CORE_SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={0.04 * i} className="border-t border-white/10 py-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="display-title text-3xl md:text-4xl">{s.name}</h3>
                <p className="font-mono text-[0.62rem] tracking-[0.22em] text-steel-2 uppercase">
                  {s.role}
                </p>
              </div>
              <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-chrome md:text-base">
                {s.plain}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[70ch] border-t border-white/10 pt-8 text-sm leading-relaxed text-silver">
            <span className="text-white">In Nyumbisha, our first product on Core,</span>{" "}
            tenant sign-in, M-Pesa rent collection, WhatsApp receipts, owner
            statements and the full payment history all come from these six
            services.
          </p>
        </Reveal>

        <ProductCards />
      </div>
    </section>
  );
}
