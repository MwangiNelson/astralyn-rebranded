"use client";

import Link from "next/link";
import { Reveal, RevealWords, DrawnLine, MaskWipe } from "@/components/motion/Reveal";
import Plate from "@/components/Plate";
import NotifyForm from "@/components/security/NotifyForm";

/* ------------------------------------------------------------------
   SECURITY — the website exposure check, before it exists.

   The page says plainly that the check is coming, what it will and will
   not do, and takes a sign-up. Every limit is stated up front: a security
   page that oversells is worse than none, and the safeguards are what
   make a stranger willing to type their domain in.
------------------------------------------------------------------- */

const CHECKS = [
  {
    t: "TLS certificate",
    d: "Whether your certificate is valid, when it expires, and whether the connection settings are current.",
  },
  {
    t: "Security headers",
    d: "The instructions your site gives browsers about framing, scripts and secure connections, and which are missing.",
  },
  {
    t: "DNS records",
    d: "What your domain's public records show, and common misconfigurations in them.",
  },
  {
    t: "Email authentication",
    d: "Your SPF, DKIM and DMARC records, which decide whether someone else can send email that looks like it came from you.",
  },
];

const LIMITS = [
  "It does not attack or probe your site. It reads only what your site already shows anyone on the internet.",
  "It checks a site you own or are allowed to assess, and asks you to confirm that first.",
  "A clean result is not a certificate that you are secure. It covers the outside of your website, not the systems behind it.",
];

const REPORT = [
  "What we observed",
  "Why it may matter",
  "How urgent it is, where the evidence supports a view",
  "What to do about it",
  "Anything that limits the result",
];

export default function SecurityPage() {
  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-6 pt-40 pb-24 md:px-12 md:pt-48 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-24">
          <div>
            <Reveal>
              <span className="chrome-badge">
                <span aria-hidden className="status-blink block h-1.5 w-1.5 rotate-45 bg-white" />
                Coming soon
              </span>
            </Reveal>
            <h1 className="display headline-lit mt-8 text-[clamp(2.8rem,7vw,6.2rem)] text-balance">
              <RevealWords text="How exposed is" delay={0.1} />{" "}
              <RevealWords text="your website?" delay={0.3} chrome />
            </h1>
            <Reveal delay={0.4}>
              <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-silver md:text-lg">
                We are building a free check of your public website&apos;s
                security. It looks at what your site already shows anyone on
                the internet: its certificate, its security headers, its DNS
                records, and the records that stop others sending email as you.
              </p>
            </Reveal>
            <Reveal delay={0.5} className="mt-12">
              <NotifyForm />
            </Reveal>
          </div>
          <MaskWipe delay={0.3} className="hidden lg:block">
            <Plate
              variant="scan"
              seed={29}
              className="aspect-[4/5] w-full"
              label="Exposure check"
              readout="Passive · public signals only"
            />
          </MaskWipe>
        </div>
      </section>

      {/* ---------------- WHAT IT CHECKS ---------------- */}
      <section className="panel section-tex relative">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-24 md:grid-cols-[5fr_7fr] md:gap-24 md:px-12 md:py-36">
          <h2 className="display headline-lit text-[clamp(2rem,4.5vw,3.75rem)] text-balance">
            <RevealWords text="What the check" />{" "}
            <RevealWords text="looks at." delay={0.15} chrome />
          </h2>
          <div className="space-y-10">
            {CHECKS.map((c, i) => (
              <Reveal key={c.t} delay={0.05 * i}>
                <DrawnLine delay={0.05 * i} />
                <h3 className="display-title mt-6 text-[clamp(1.4rem,2.2vw,1.9rem)]">{c.t}</h3>
                <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-silver md:text-base">{c.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LIMITS + REPORT ---------------- */}
      <section className="section-tex relative">
        <div className="mx-auto grid max-w-[1600px] gap-20 px-6 py-24 md:grid-cols-2 md:gap-24 md:px-12 md:py-36">
          <div>
            <Reveal>
              <h2 className="display-title text-[clamp(1.8rem,3.4vw,2.8rem)]">What it does not do.</h2>
            </Reveal>
            <ul className="mt-10 space-y-6">
              {LIMITS.map((l, i) => (
                <Reveal key={l} delay={0.05 * i}>
                  <li className="border-t border-white/10 pt-6 text-base leading-relaxed text-chrome">{l}</li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <Reveal>
              <h2 className="display-title text-[clamp(1.8rem,3.4vw,2.8rem)]">What you get back.</h2>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-silver">
                A short report you can act on. For each finding, it covers:
              </p>
            </Reveal>
            <ul className="mt-8 border-t border-white/10">
              {REPORT.map((r, i) => (
                <Reveal key={r} delay={0.04 * i}>
                  <li className="border-b border-white/10 py-4 font-mono text-[0.72rem] tracking-[0.16em] text-chrome uppercase">
                    {r}
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-silver">
                If you want help, our engineers can look further and fix what
                they find.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- IN WHAT WE BUILD ---------------- */}
      <section className="panel relative">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-24 md:grid-cols-[5fr_7fr] md:gap-24 md:px-12 md:py-32">
          <Reveal>
            <h2 className="display-title text-[clamp(1.8rem,3.4vw,2.8rem)]">
              The same thinking goes into what we build.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="md:pt-2">
            <p className="max-w-[56ch] text-base leading-relaxed text-silver md:text-lg">
              Security is the first of the principles we build to. Sign-in,
              permissions and a permanent record of who did what are part of
              Astralyn Core, the foundation our products run on, rather than
              features added before launch.
            </p>
            <Link
              href="/#approach"
              className="mt-8 inline-block font-mono text-xs tracking-[0.25em] text-white uppercase underline-offset-8 transition-all duration-500 hover:underline"
            >
              How we build →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CLOSE ---------------- */}
      <section className="relative bg-white py-28 text-center text-black md:py-40">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <h2 className="display-black text-[clamp(2.6rem,7vw,6.5rem)] uppercase">
            <RevealWords text="Worried about" />
            <br />
            <span className="text-black/40">
              <RevealWords text="something now?" delay={0.2} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-black/70">
              You don&apos;t need to wait for the check. Tell us what concerns
              you and we&apos;ll tell you honestly what we would look at first.
            </p>
            <Link href="/start" className="cta-inverse mt-12">
              Talk to us
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
