import {
  BehanceLogoIcon,
  ChartLineUpIcon,
  CompassIcon,
  CubeIcon,
  DribbbleLogoIcon,
  EnvelopeSimpleIcon,
  FlaskIcon,
  GearSixIcon,
  GithubLogoIcon,
  GlobeIcon,
  HandshakeIcon,
  InstagramLogoIcon,
  LighthouseIcon,
  LinkedinLogoIcon,
  PaintBrushIcon,
  PenNibIcon,
  ScalesIcon,
  ShieldCheckIcon,
  TerminalWindowIcon,
  TrendUpIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { ROLE_META, type RoleKind, type SocialKind, type TeamMember } from "@/lib/team";

/* ------------------------------------------------------------
   ROLE ICON — the glyph that stands in for a discipline.

   Phosphor rather than a generic set: it ships a `thin` weight on a
   256 grid, which lands at roughly the same optical weight as the
   hairlines everywhere else on this site. A 2px rounded icon set would
   read as if it had been pasted in from another product.

   Imported from the /ssr entry so the icons render without the client
   context provider — these are static marks, they never need a theme.
------------------------------------------------------------ */

const ROLE_GLYPH: Record<RoleKind, Icon> = {
  legal: ScalesIcon, // the weighing scale — counsel and compliance
  consultant: CompassIcon, // brought in to set a bearing
  engineering: TerminalWindowIcon,
  design: PenNibIcon,
  product: CubeIcon,
  operations: GearSixIcon,
  finance: ChartLineUpIcon,
  research: FlaskIcon,
  growth: TrendUpIcon,
  partnerships: HandshakeIcon,
  security: ShieldCheckIcon,
  advisor: LighthouseIcon, // fixed light, seen from a distance
};

/** Per-person overrides, for craft that the discipline glyph doesn't cover. */
const EXTRA_GLYPH: Record<NonNullable<TeamMember["glyph"]>, Icon> = {
  art: PaintBrushIcon,
};

const SOCIAL_GLYPH: Record<SocialKind, Icon> = {
  linkedin: LinkedinLogoIcon,
  x: XLogoIcon,
  github: GithubLogoIcon,
  dribbble: DribbbleLogoIcon,
  behance: BehanceLogoIcon,
  instagram: InstagramLogoIcon,
  website: GlobeIcon,
  email: EnvelopeSimpleIcon,
};

export const SOCIAL_LABEL: Record<SocialKind, string> = {
  linkedin: "LinkedIn",
  x: "X",
  github: "GitHub",
  dribbble: "Dribbble",
  behance: "Behance",
  instagram: "Instagram",
  website: "Website",
  email: "Email",
};

/** The discipline mark. `plated` wraps it in the hairline square used
 *  for roster rows; bare is for inline use in headings. */
export function RoleIcon({
  kind,
  glyph,
  size = 20,
  plated = false,
  className = "",
}: {
  kind: RoleKind;
  glyph?: TeamMember["glyph"];
  size?: number;
  plated?: boolean;
  className?: string;
}) {
  const Glyph = glyph ? EXTRA_GLYPH[glyph] : ROLE_GLYPH[kind];
  const mark = (
    <Glyph
      size={size}
      weight="thin"
      aria-hidden
      className={plated ? "" : className}
    />
  );

  if (!plated) return mark;

  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center border border-white/[0.12] bg-white/[0.02] text-silver transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/[0.05] group-hover:text-white ${className}`}
      title={ROLE_META[kind].label}
    >
      {mark}
    </span>
  );
}

/** A social link. Label is visually hidden but read out, so a row of
 *  four marks isn't four unlabelled links to a screen reader. */
export function SocialLink({
  kind,
  href,
  name,
}: {
  kind: SocialKind;
  href: string;
  /** Whose profile this is — folded into the accessible name. */
  name: string;
}) {
  const Glyph = SOCIAL_GLYPH[kind];
  const external = !href.startsWith("mailto:");

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={`${name} on ${SOCIAL_LABEL[kind]}`}
      className="flex h-8 w-8 items-center justify-center text-steel transition-colors duration-500 hover:text-white focus-visible:text-white"
    >
      <Glyph size={17} weight="thin" aria-hidden />
    </a>
  );
}
