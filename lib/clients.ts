/**
 * The work wall.
 *
 * What we built for a client is their business, not our marketing. Every
 * engagement here is reduced to four public facts — who, what discipline,
 * when, and where it lives. The transformation stays between us and them.
 *
 * `logo` is optional on purpose: where we do not hold a usable mark, the tile
 * sets the client's name in chrome instead of showing a broken image.
 */
export type Client = {
  name: string;
  /** Discipline, not deliverable. */
  sector: string;
  /** Path under /public. Omit when no usable mark exists. */
  logo?: string;
  /** Public address. Omitted for systems that run behind a client's sign-in. */
  href?: string;
  /** Shipped year, only where we can date it honestly. */
  year?: string;
  status: "Live" | "In Build" | "Maintained";
  /** Astralyn-owned builds, flagged so the wall never implies a client. */
  inHouse?: boolean;
};

export const CLIENTS: Client[] = [
  {
    name: "Gamaag",
    sector: "Finance & Operations",
    year: "2025",
    status: "Maintained",
  },
  {
    name: "HERA Conceive",
    sector: "Product Design · App",
    logo: "/clients/hera.png",
    href: "https://www.heraconceive.com/",
    year: "2025",
    status: "Live",
  },
  {
    name: "Impexicon EA",
    sector: "Commerce Platform",
    logo: "/clients/impexicon.png",
    href: "https://impexicon.com/",
    status: "Live",
  },
  {
    name: "Sustainable Kenya",
    sector: "National Platform",
    logo: "/clients/sustainable-kenya.webp",
    href: "https://sustainable.co.ke/",
    status: "Live",
  },
  {
    name: "Alientag VR",
    sector: "Game Platform",
    logo: "/clients/alientag.png",
    href: "https://alientagvr.com/",
    year: "2024",
    status: "Live",
  },
  {
    name: "Salama Mama",
    sector: "Applied AI",
    logo: "/clients/salama-mama.png",
    href: "https://salama-mama.vercel.app/",
    year: "2024",
    status: "Live",
  },
  {
    name: "Gizmo",
    sector: "AI Shopping Assistant",
    href: "https://gizmo-delta.vercel.app/",
    year: "2025",
    status: "In Build",
    inHouse: true,
  },
  {
    name: "Recette",
    sector: "Applied AI",
    href: "https://recette.astralyngroup.com/",
    year: "2026",
    status: "In Build",
    inHouse: true,
  },
];
