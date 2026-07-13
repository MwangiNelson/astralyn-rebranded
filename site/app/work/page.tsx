"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import CardLit from "@/components/CardLit";
import { CTA } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------
   SELECTED WORK — transformations, never feature lists.
   Challenge → Strategy → Design → Technology → Outcome → Signature.
------------------------------------------------------------------- */

type Stage = { label: string; text: string };

type CaseStudy = {
  index: string;
  client: string;
  sector: string;
  status: string;
  liveUrl: string;
  headline: [string, string];
  stages: Stage[];
  fact: { value: string; label: string };
  secondary: { value: string; label: string }[];
};

const CASES: CaseStudy[] = [
  {
    index: "01",
    client: "Impexicon EA Ltd",
    sector: "Web Development",
    status: "Live",
    liveUrl: "https://impexicon.com/",
    headline: ["Premium trucks,", "engineered trust."],
    stages: [
      {
        label: "Challenge",
        text: "A specialist truck importer and fabricator needed a digital presence as solid as its engineering — one home for sales, trailers and repairs.",
      },
      {
        label: "Strategy",
        text: "Position Impexicon as a single partner across the truck lifecycle: import, build and maintain — with the credibility of its public-institution clients up front.",
      },
      {
        label: "Design",
        text: "A confident, product-led site organised around three clear service lines, so buyers understand the full capability at a glance.",
      },
      {
        label: "Technology",
        text: "A vending platform for premium used trucks, sat alongside custom trailer fabrication and specialised repair services.",
      },
      {
        label: "Outcome",
        text: "Live — presenting Impexicon's imported trucks, custom trailers and repair capability to clients including the Kenya Airports Authority.",
      },
    ],
    fact: { value: "3", label: "Service lines: sales, trailers, repairs" },
    secondary: [
      { value: "UK", label: "Premium used-truck sourcing" },
      { value: "KAA", label: "Public-institution client" },
    ],
  },
  {
    index: "02",
    client: "Sustainable Kenya",
    sector: "Web Development",
    status: "Live",
    liveUrl: "https://sustainable.co.ke/",
    headline: ["A sustainable Kenya,", "connected in one place."],
    stages: [
      {
        label: "Challenge",
        text: "Consumers, youth, businesses and organisations pushing for sustainability had no shared home to find each other or be found.",
      },
      {
        label: "Strategy",
        text: "Build the connective tissue — a platform that gathers the whole movement and makes sustainable choices genuinely findable.",
      },
      {
        label: "Design",
        text: "An inviting, editorial platform anchored by a searchable directory of trusted sustainable brands, plus resources and events.",
      },
      {
        label: "Technology",
        text: "A business directory, resource library and events system, engineered to serve citizens, brands and organisations alike.",
      },
      {
        label: "Outcome",
        text: "Live and growing — a trusted directory of Kenyan sustainable brands and a community accelerating sustainable lifestyles.",
      },
    ],
    fact: { value: "Live", label: "Directory · Resources · Events" },
    secondary: [
      { value: "4", label: "Audiences: consumers, youth, business, orgs" },
      { value: "KE", label: "National sustainability platform" },
    ],
  },
  {
    index: "03",
    client: "Mark Infosys Ltd",
    sector: "Web Development",
    status: "Live",
    liveUrl: "https://www.markinfosys.com/",
    headline: ["An IT house's", "digital front door."],
    stages: [
      {
        label: "Challenge",
        text: "An established Nairobi IT consultancy needed a web presence that matched its depth of experience across strategy, security and software.",
      },
      {
        label: "Strategy",
        text: "Translate decades of consulting credibility into a clear, trustworthy digital identity that foregrounds the services that matter.",
      },
      {
        label: "Design",
        text: "A professional, no-nonsense site that leads with their offering — from IT strategy and business intelligence to cybersecurity.",
      },
      {
        label: "Technology",
        text: "Built in 2020 and maintained since — with Astralyn managing their deployment on an ongoing basis.",
      },
      {
        label: "Outcome",
        text: "Live and maintained — a long-running partnership, with Astralyn keeping the site deployed and current since 2020.",
      },
    ],
    fact: { value: "Since 2020", label: "Built & managed by Astralyn" },
    secondary: [
      { value: "Ongoing", label: "Deployment managed" },
      { value: "6", label: "Service areas presented" },
    ],
  },
  {
    index: "04",
    client: "Alientag VR",
    sector: "Web Development",
    status: "Live",
    liveUrl: "https://alientagvr.com/",
    headline: ["A VR game's", "home base."],
    stages: [
      {
        label: "Challenge",
        text: "Alien Tag, a shipped VR title, needed a hub for its players — mods, tutorials, competitive play and community, all in one place.",
      },
      {
        label: "Strategy",
        text: "Give the game a home that grows with it: distribution, content and a competitive scene, wired into the community it already had.",
      },
      {
        label: "Design",
        text: "A bold, game-native web platform that channels players to Steam, Meta Quest and the competitive league.",
      },
      {
        label: "Technology",
        text: "A web platform serving mods, tutorials and gaming assets, connected to the game's Discord and cash-prize tournaments.",
      },
      {
        label: "Outcome",
        text: "Live — supporting Alien Tag players across Steam and Meta Quest, with a competitive league running cash-prize tournaments.",
      },
    ],
    fact: { value: "2", label: "Platforms: Steam & Meta Quest" },
    secondary: [
      { value: "League", label: "Competitive cash-prize tournaments" },
      { value: "Discord", label: "Live player community" },
    ],
  },
  {
    index: "05",
    client: "Salama Mama",
    sector: "Artificial Intelligence",
    status: "Live",
    liveUrl: "https://salama-mama.vercel.app/",
    headline: ["Support for the", "hardest months."],
    stages: [
      {
        label: "Challenge",
        text: "Mothers facing postpartum depression and anxiety too often navigate it alone, without accessible, judgement-free support.",
      },
      {
        label: "Strategy",
        text: "Meet mothers where they are — a safe, private space for resources, community and real steps toward healing.",
      },
      {
        label: "Design",
        text: "A calm, reassuring interface that keeps support and community within reach, never behind clinical barriers.",
      },
      {
        label: "Technology",
        text: "An AI-powered platform pairing curated resources with community and personal accounts.",
      },
      {
        label: "Outcome",
        text: "Live — giving mothers a supportive companion, and a community, through postpartum depression and anxiety.",
      },
    ],
    fact: { value: "Live", label: "Maternal mental-health platform" },
    secondary: [
      { value: "AI", label: "Personalised support" },
      { value: "Community", label: "Peer connection & resources" },
    ],
  },
  {
    index: "06",
    client: "Recette",
    sector: "Artificial Intelligence",
    status: "In Progress",
    liveUrl: "https://recette.astralyngroup.com/",
    headline: ["Dinner, personalised", "to what you have."],
    stages: [
      {
        label: "Challenge",
        text: "Generic recipe sites ignore what's actually in your kitchen — your budget, your allergies, your dietary needs.",
      },
      {
        label: "Strategy",
        text: "An AI that starts from the person: preferences, resources and restrictions first, recipe second.",
      },
      {
        label: "Design",
        text: "A simple browse-and-generate experience — ask, and a tailored recipe appears.",
      },
      {
        label: "Technology",
        text: "An AI chatbot that generates personalised recipes from a growing library, filtered by allergies and dietary rules.",
      },
      {
        label: "Outcome",
        text: "In progress — already serving a library of 250+ recipes through browse and AI generation.",
      },
    ],
    fact: { value: "250+", label: "Recipes available" },
    secondary: [
      { value: "AI", label: "Personalised generation" },
      { value: "In build", label: "Actively developing" },
    ],
  },
  {
    index: "07",
    client: "Gizmo",
    sector: "Artificial Intelligence",
    status: "In Progress",
    liveUrl: "https://gizmo-delta.vercel.app/",
    headline: ["Every Kenyan marketplace,", "one search."],
    stages: [
      {
        label: "Challenge",
        text: "Online shopping in Kenya is scattered across dozens of marketplaces — buyers open ten tabs and still miss the best price.",
      },
      {
        label: "Strategy",
        text: "One intelligent front door to the whole market. Gizmo treats fragmented listings as a single, searchable index.",
      },
      {
        label: "Design",
        text: "A clean, intuitive search surface that collapses many marketplaces into one calm result set.",
      },
      {
        label: "Technology",
        text: "AI aggregation and matching across Kenyan online marketplaces, normalising listings into one catalogue.",
      },
      {
        label: "Outcome",
        text: "In active development — building toward a single place to discover and compare across the Kenyan market.",
      },
    ],
    fact: { value: "In Progress", label: "AI marketplace aggregator" },
    secondary: [
      { value: "KE", label: "Every online marketplace, unified" },
      { value: "AI", label: "Listing aggregation & matching" },
    ],
  },
];

function CaseStudySection({ cs, flip }: { cs: CaseStudy; flip: boolean }) {
  return (
    <article className="relative py-32 md:py-44">
      {/* Header — editorial masthead */}
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <p className="font-mono text-sm text-steel">{cs.index}</p>
            <p className="label">{cs.sector}</p>
            <p className="font-mono text-xs tracking-[0.25em] text-steel uppercase">
              {cs.status}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 font-mono text-xs tracking-[0.3em] text-chrome uppercase">
            {cs.client}
          </p>
        </Reveal>
        <h2 className="display mt-6 max-w-5xl text-[clamp(2.4rem,6vw,5.5rem)]">
          <RevealWords text={cs.headline[0]} delay={0.15} />
          <br />
          <span className="text-silver">
            <RevealWords text={cs.headline[1]} delay={0.35} />
          </span>
        </h2>
      </div>

      {/* Transformation + metric — alternating composition */}
      <div className="mx-auto mt-24 max-w-[1600px] px-6 md:mt-32 md:px-12">
        <div
          className={`flex flex-col gap-20 lg:flex-row lg:gap-28 ${
            flip ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* The five stages */}
          <div className="lg:w-3/5">
            {cs.stages.map((s, i) => (
              <div key={s.label}>
                <DrawnLine delay={i * 0.08} />
                <Reveal delay={i * 0.08}>
                  <div className="grid gap-4 py-10 md:grid-cols-[10rem_1fr] md:gap-10 md:py-12">
                    <p className="label pt-1">{s.label}</p>
                    <p
                      className={`max-w-xl text-base leading-relaxed md:text-lg ${
                        s.label === "Outcome" ? "text-white" : "text-silver"
                      }`}
                    >
                      {s.text}
                    </p>
                  </div>
                </Reveal>
              </div>
            ))}
            <DrawnLine delay={0.4} />
          </div>

          {/* Metric callout — the transformation, quantified */}
          <div className="lg:w-2/5">
            <Reveal delay={0.2} className="lg:sticky lg:top-40">
              <CardLit className="glass glow p-12 md:p-16">
                <p className="label mb-10">The Project</p>
                <p className="display text-chrome-sheen text-[clamp(3rem,6vw,5rem)] break-words">
                  {cs.fact.value}
                </p>
                <p className="mt-4 text-sm text-silver">{cs.fact.label}</p>
                <div className="mt-12 space-y-8">
                  {cs.secondary.map((m) => (
                    <div key={m.label}>
                      <div className="hairline mb-6" />
                      <p className="display text-2xl text-white md:text-3xl">
                        {m.value}
                      </p>
                      <p className="label mt-3">{m.label}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={cs.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-core mt-12 w-full justify-center"
                >
                  Visit live site ↗
                </a>
                <p className="mt-10 font-mono text-[0.65rem] tracking-[0.3em] text-steel uppercase">
                  Powered by Astralyn.
                </p>
              </CardLit>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WorkPage() {
  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_-20%,rgba(245,246,247,0.06),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-40 pb-24 md:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: EASE }}
            className="label mb-10"
          >
            Selected Work — Transformations, not features
          </motion.p>
          <h1 className="display max-w-6xl text-[clamp(2.8rem,8vw,7.5rem)] uppercase">
            <RevealWords text="Every engagement" delay={0.2} />
            <br />
            <span className="text-chrome-sheen">
              <RevealWords text="tells a story" delay={0.6} />
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.6, ease: EASE }}
            className="mt-12 max-w-md text-base leading-relaxed text-silver"
          >
            Challenge. Strategy. Design. Technology. Outcome. We take
            businesses through the same transformation, every time — and every
            one ends the same way.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1.6, ease: EASE }}
            className="mt-8 font-mono text-xs tracking-[0.3em] text-silver uppercase"
          >
            Powered by Astralyn.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <DrawnLine />
      </div>

      {/* ---------------- THE CASE STUDIES ---------------- */}
      {CASES.map((cs, i) => (
        <div key={cs.client}>
          <CaseStudySection cs={cs} flip={i % 2 === 1} />
          {i < CASES.length - 1 && (
            <div className="mx-auto max-w-[1600px] px-6 md:px-12">
              <div className="hairline" />
            </div>
          )}
        </div>
      ))}

      {/* ---------------- NEXT CHAPTER ---------------- */}
      <section className="relative overflow-hidden py-48 text-center md:py-64">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,246,247,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <Reveal>
            <p className="label mb-10">The Next Case Study</p>
          </Reveal>
          <h2 className="display text-[clamp(2.2rem,6vw,5.5rem)] uppercase">
            <RevealWords text="Yours is" />
            <br />
            <span className="text-chrome-sheen">
              <RevealWords text="unwritten" delay={0.3} />
            </span>
          </h2>
          <Reveal delay={0.5}>
            <Link href={CTA.href} className="btn-core btn-solid mt-16">
              Begin the transformation
            </Link>
          </Reveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 1.6, ease: EASE }}
            className="mt-20 font-mono text-xs tracking-[0.3em] text-silver uppercase"
          >
            Powered by Astralyn.
          </motion.p>
        </div>
      </section>
    </>
  );
}
