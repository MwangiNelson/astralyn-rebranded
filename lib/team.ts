import type { FieldVariant } from "@/components/Field";

/* ------------------------------------------------------------
   THE TEAM — one roster, two registers.

   The founders keep the dossier treatment: portraits, signals,
   full records. Everyone else is listed the way a house lists its
   people — name, discipline, a way to reach them. No pretend bios.

   This file is the single source of truth for /team. Adding a
   person is one object; the page needs no edits.
------------------------------------------------------------ */

/* ---------------- ROLES ---------------- */

/** The discipline a person is filed under. Drives their icon and the
 *  group they appear in on the roster. Add a kind here, give it a row in
 *  ROLE_META, and wire the glyph in components/RoleIcon.tsx. */
export type RoleKind =
  | "legal"
  | "consultant"
  | "engineering"
  | "design"
  | "product"
  | "operations"
  | "finance"
  | "research"
  | "growth"
  | "partnerships"
  | "security"
  | "advisor";

/** Display metadata per discipline. `order` fixes the roster sequence so the
 *  list doesn't reshuffle as people are added. Staff disciplines are numbered
 *  ahead of the retained ones, so hires always land above the consultants and
 *  advisors however late they arrive. */
export const ROLE_META: Record<
  RoleKind,
  { label: string; blurb: string; order: number }
> = {
  engineering: {
    label: "Engineering",
    blurb: "The systems under everything.",
    order: 1,
  },
  design: { label: "Design", blurb: "Form, motion, and the brand.", order: 2 },
  product: { label: "Product", blurb: "What gets built, and why.", order: 3 },
  operations: { label: "Operations", blurb: "The machine that keeps time.", order: 4 },
  finance: { label: "Finance", blurb: "Capital, controls, reporting.", order: 5 },
  growth: { label: "Growth", blurb: "Markets entered, demand built.", order: 6 },
  security: { label: "Security", blurb: "Trust, enforced.", order: 7 },
  partnerships: {
    label: "Partnerships",
    blurb: "The register of allied houses.",
    order: 8,
  },
  consultant: {
    label: "Consultants",
    blurb: "Specialists retained on the work that needs them.",
    order: 9,
  },
  legal: { label: "Legal", blurb: "Counsel, contracts, compliance.", order: 10 },
  research: {
    label: "Research & Development",
    blurb: "The Lab. Applied, not academic.",
    order: 11,
  },
  advisor: { label: "Advisory", blurb: "Long counsel, no day-to-day.", order: 12 },
};

/* ---------------- SOCIALS ---------------- */

export type SocialKind =
  | "linkedin"
  | "x"
  | "github"
  | "dribbble"
  | "behance"
  | "instagram"
  | "website"
  | "email";

export type Social = { kind: SocialKind; href: string };

/* ---------------- PEOPLE ---------------- */

export type TeamMember = {
  name: string;
  /** The person's actual title — free text, shown verbatim. */
  role: string;
  /** The discipline they're filed under. Drives icon + grouping. */
  kind: RoleKind;
  /** ponytail: optional glyph override for people whose craft doesn't match
   *  the discipline they're filed under. Add literals as they're needed. */
  glyph?: "art";
  /** Optional. Omitted entries simply render no links. */
  socials?: Social[];
};

/* Real people. `socials` is optional — David has no public profile on file,
   and his row renders cleanly without one. Disciplines with nobody in them
   never reach the page, so the staff groups above stay defined and dormant
   until there are hires to put in them. */
export const TEAM: TeamMember[] = [
  {
    name: "Danroy Ndung'u Mwangi",
    role: "AI/ML Expert",
    kind: "consultant",
    socials: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/danroy-mwangi/" },
    ],
  },
  {
    name: "Abigael Kirwa",
    role: "AI/ML Expert",
    kind: "consultant",
    socials: [
      {
        kind: "linkedin",
        href: "https://www.linkedin.com/in/abigael-kirwa-40647219b/",
      },
    ],
  },
  {
    name: "Natasha Wangui Gichuhi",
    role: "Frontend Consultant & Creative Consultant",
    kind: "consultant",
    glyph: "art",
    socials: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/natasha-gichuhi/" },
      { kind: "website", href: "https://gichuhi-wangui.vercel.app/" },
    ],
  },
  {
    name: "David Mungwana Kimathi",
    role: "Legal Practitioner",
    kind: "legal",
  },
  {
    name: "James Brian Kariuki",
    role: "Researcher",
    kind: "research",
    socials: [
      {
        kind: "linkedin",
        href: "https://www.linkedin.com/in/james-brian-kariuki/",
      },
    ],
  },
  {
    name: "Andrew Kamau",
    role: "Manager, Equity Bank",
    kind: "advisor",
    socials: [
      {
        kind: "linkedin",
        href: "https://www.linkedin.com/in/andrew-kamau-81950818/",
      },
    ],
  },
];

/** The roster, bucketed by discipline in ROLE_META order. Empty
 *  disciplines are dropped, so the page never renders a bare heading. */
export function groupedTeam(): { kind: RoleKind; members: TeamMember[] }[] {
  const buckets = new Map<RoleKind, TeamMember[]>();
  for (const m of TEAM) {
    const list = buckets.get(m.kind);
    if (list) list.push(m);
    else buckets.set(m.kind, [m]);
  }
  return [...buckets.entries()]
    .map(([kind, members]) => ({ kind, members }))
    .sort((a, b) => ROLE_META[a.kind].order - ROLE_META[b.kind].order);
}

/* ---------------- FOUNDERS ---------------- */

export type Founder = {
  n: string;
  name: string;
  title: string;
  signal: string;
  accent: string; // seam + glow tint
  field: FieldVariant; // the signature drawn behind the slab
  photo?: string; // portrait — layered over the signature field when present
  origin: string; // dossier telemetry
  philosophy: string;
  focus: string[];
  technologies: string[];
  timeline: { year: string; event: string }[];
  projects: { name: string; x: string; y: string; drift: number }[];
};

const SHARED_TIMELINE = [
  { year: "2023", event: "Astralyn founded. Strategy, design and engineering, fused." },
  { year: "2024", event: "First platforms shipped. One standard, one signature." },
  { year: "2025", event: "The house expands across markets and disciplines." },
  { year: "2026", event: "Powering the next generation of business." },
];

/* NOTE (Nelson): titles are neutral "Co-Founder & Partner" placeholders and the
   copy is generic on purpose — swap in each founder's real bio and links when
   ready. Structure stays the same. */
export const FOUNDERS: Founder[] = [
  {
    n: "01",
    name: "Nelson Mwangi",
    title: "Co-Founder & Partner",
    signal: "Systems",
    accent: "#f5f5f0",
    field: "network",
    photo: "/team/nelson.jpg",
    origin: "Nairobi, KE",
    philosophy:
      "Power without direction is noise. We engineer the systems that turn potential into momentum.",
    focus: ["Technology", "Engineering", "Infrastructure", "Architecture"],
    technologies: ["TypeScript", "Rust", "Cloud", "AI Systems", "Edge", "Data"],
    timeline: SHARED_TIMELINE,
    projects: [
      { name: "MERIDIAN", x: "8%", y: "18%", drift: 14 },
      { name: "AXIOM RAIL", x: "72%", y: "12%", drift: 18 },
      { name: "OBSIDIAN", x: "82%", y: "58%", drift: 12 },
      { name: "CORE", x: "5%", y: "66%", drift: 16 },
    ],
  },
  {
    n: "02",
    name: "Adrian Mang'are",
    title: "Co-Founder & Partner",
    signal: "Direction",
    accent: "#d0d0ca",
    field: "vector",
    photo: "/team/adrian.jpg",
    origin: "Nairobi, KE",
    philosophy:
      "We define the opportunity before a line is drawn. Direction before motion, always.",
    focus: ["Strategy", "Ventures", "Market Engineering", "Growth"],
    technologies: ["Strategy", "Research", "Modeling", "Positioning", "Ventures"],
    timeline: SHARED_TIMELINE,
    projects: [
      { name: "STRATEGY", x: "10%", y: "14%", drift: 16 },
      { name: "VENTURES", x: "76%", y: "20%", drift: 12 },
      { name: "MARKETS", x: "80%", y: "62%", drift: 18 },
      { name: "GROWTH", x: "6%", y: "70%", drift: 14 },
    ],
  },
  {
    n: "03",
    name: "Angelo Makory",
    title: "Co-Founder & Partner",
    signal: "Form",
    accent: "#ababaa",
    field: "frame",
    photo: "/team/angelo.jpg",
    origin: "Nairobi, KE",
    philosophy:
      "Design is the moment technology becomes human — and stays that way.",
    focus: ["Design", "Brand", "Interaction", "Design Systems"],
    technologies: ["Product Design", "Motion", "Design Tokens", "Type", "Brand"],
    timeline: SHARED_TIMELINE,
    projects: [
      { name: "OBSIDIAN UI", x: "9%", y: "16%", drift: 16 },
      { name: "BRAND", x: "74%", y: "18%", drift: 12 },
      { name: "MONO/CHROME", x: "80%", y: "60%", drift: 18 },
      { name: "LUMEN", x: "6%", y: "68%", drift: 14 },
    ],
  },
  {
    n: "04",
    name: "Cyprian Kibet",
    title: "Co-Founder & Partner",
    signal: "Momentum",
    accent: "#777775",
    field: "compound",
    photo: "/team/cyprian.jpg",
    origin: "Nairobi, KE",
    philosophy:
      "Intelligence is leverage. We build products that compound long after launch.",
    focus: ["AI", "Product", "Automation", "Platforms"],
    technologies: ["AI", "ML", "Product", "Automation", "Platforms", "Data"],
    timeline: SHARED_TIMELINE,
    projects: [
      { name: "MERIDIAN", x: "10%", y: "15%", drift: 16 },
      { name: "AUTONOMY", x: "75%", y: "20%", drift: 12 },
      { name: "SIGNAL", x: "81%", y: "62%", drift: 18 },
      { name: "PRODUCT", x: "5%", y: "69%", drift: 14 },
    ],
  },
];
