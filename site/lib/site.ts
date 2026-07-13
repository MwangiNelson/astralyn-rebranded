export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/work", label: "Selected Work" },
  { href: "/lab", label: "Research Lab" },
  { href: "/founders", label: "Founders" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
];

export const CTA = { href: "/start", label: "Start Something Extraordinary" };

export const SIGNATURE = "Powered by Astralyn.";

/** Canonical production origin — used for metadata, sitemap and robots. */
export const SITE_URL = "https://astralyngroup.com";

/** Every indexable route, single source of truth for the sitemap. */
export const ROUTES = [
  "/",
  "/about",
  "/capabilities",
  "/products",
  "/work",
  "/lab",
  "/founders",
  "/partners",
  "/manifesto",
  "/contact",
  "/start",
] as const;
