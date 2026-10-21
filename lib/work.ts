import type { FieldVariant } from "@/components/Field";

/* ------------------------------------------------------------
   /work — what we build, with the work as the evidence.

   Grouped by what a client commissions, not by date. Each case says
   what the thing is and what we did; the client's numbers, roadmap
   and internals stay with the client. A case appears only with a
   line we can stand behind. Names match CLIENTS in lib/clients.ts,
   which still holds the logo, link, year and status.
------------------------------------------------------------ */

export type Case = {
  /** Must match a name in CLIENTS. */
  client: string;
  /** What it is and what we did, in one or two plain sentences. */
  summary: string;
};

export type Capability = {
  id: string;
  title: string;
  /** What we build in this area, for the business reading it. */
  intro: string;
  field: FieldVariant;
  cases: Case[];
  /** Where the visitor goes next from this group. */
  next: { label: string; href: string };
};

export const CAPABILITIES: Capability[] = [
  {
    id: "commerce",
    title: "Commerce and payments",
    intro:
      "Websites, catalogues and ordering systems that customers buy through, with M-Pesa and card payments matched to the right order.",
    field: "flow",
    cases: [
      {
        client: "Impexicon EA",
        summary:
          "The company website and truck catalogue: stock, specifications and photo galleries buyers browse before they call.",
      },
    ],
    next: { label: "Discuss a commerce build", href: "/start" },
  },
  {
    id: "operations",
    title: "Operations platforms",
    intro:
      "The systems an organisation runs on every day: records, workflows, reporting and the people who use them, built to stay in service for years.",
    field: "network",
    cases: [
      {
        client: "Sustainable Kenya",
        summary:
          "A national sustainability platform for Kenyan businesses.",
      },
      {
        client: "Mark Infosys",
        summary:
          "A platform we deployed in 2020 and still run for them today.",
      },
    ],
    next: { label: "Discuss a platform build", href: "/start" },
  },
  {
    id: "ai",
    title: "Applied AI",
    intro:
      "AI built into a product where it does a specific job: answering questions from a business's own data, classifying, matching and recommending.",
    field: "vector",
    cases: [
      {
        client: "Salama Mama",
        summary:
          "Support for mothers after birth: a chat companion that responds to how the mother says she is feeling.",
      },
      {
        client: "Gizmo",
        summary:
          "Our own shopping assistant, which answers buyers' questions from a product catalogue instead of making them search it.",
      },
      {
        client: "Recette",
        summary: "Our own applied AI product, in build.",
      },
    ],
    next: { label: "Discuss an AI application", href: "/start" },
  },
  {
    id: "security",
    title: "Security",
    intro:
      "Security designed into the systems we build, and a free check of your public website's exposure, coming soon.",
    field: "scan",
    cases: [],
    next: { label: "See the website check", href: "/security" },
  },
];

/** Work that shows our range but does not belong in a group above. */
export const ALSO = ["Alientag VR"];

/* The approach, in the order an engagement actually runs. */
export const ENGAGEMENT = [
  {
    t: "We start with the operation.",
    d: "Before anything is designed, we learn how the business actually runs: who does the work, where the money moves, what breaks today. The brief is a starting point, not the specification.",
  },
  {
    t: "We build in stages you can use.",
    d: "Each stage ends in something working that your people can try, so decisions are made on real software rather than on documents.",
  },
  {
    t: "Security and reliability come first.",
    d: "Sign-in, permissions, records of who did what, and what happens when something fails are settled in the design, not added before launch.",
  },
  {
    t: "We stay to run it.",
    d: "We deploy and maintain what we build. Our longest partnership began in 2020 and we still run that platform today.",
  },
];
