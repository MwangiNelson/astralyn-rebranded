import Link from "next/link";
import { NAV_LINKS, CTA, SIGNATURE } from "@/lib/site";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-midnight">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <div className="grid gap-16 md:grid-cols-3">
          <div>
            <Logo markClass="h-7 w-auto" wordClass="text-lg tracking-[0.2em]" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-silver">
              A technology house. We architect businesses. We engineer
              products. We shape the future.
            </p>
          </div>

          <div>
            <p className="label mb-6">Explore</p>
            <ul className="grid grid-cols-2 gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-silver transition-colors duration-500 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-6">Begin</p>
            <Link href={CTA.href} className="btn-core">
              {CTA.label}
            </Link>
          </div>
        </div>

        <div className="hairline my-16" />

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="text-chrome-sheen display text-2xl md:text-3xl">
            {SIGNATURE}
          </p>
          <p className="font-mono text-xs tracking-[0.2em] text-silver">
            © {new Date().getFullYear()} ASTRALYN GROUP
          </p>
        </div>
      </div>
    </footer>
  );
}
