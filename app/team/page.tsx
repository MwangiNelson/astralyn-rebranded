"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, RevealWords, DrawnLine } from "@/components/motion/Reveal";
import Field from "@/components/Field";
import ExpandCards from "@/components/ui/expand-cards";
import { RoleIcon, SocialLink } from "@/components/RoleIcon";
import { FOUNDERS, ROLE_META, groupedTeam, type Founder } from "@/lib/team";

const EASE = [0.22, 1, 0.36, 1] as const;
const LAYOUT_TX = { layout: { duration: 0.72, ease: EASE } } as const;

/* ------------------------------------------------------------
   THE TEAM — two registers on one page.

   Above: the founders, as an elastic strip. Opening one runs the
   surveillance-style "dossier acquisition" — the portrait flies to
   centre stage under a scanning reticle and the operator's data
   decrypts field by field.

   Below: the house. Everyone else, listed by discipline, each carrying
   the glyph of the work they do. No portraits, no invented bios — a
   register, not a stage.
------------------------------------------------------------ */

/* ------------------------------------------------------------
   SCRAMBLE — a decrypting-text readout. Characters resolve
   left-to-right out of random glyphs, the way a terminal unmasks
   a classified field.
------------------------------------------------------------ */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/\\<>*+";

function Scramble({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [out, setOut] = useState("");

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOut(text);
      return;
    }

    let raf = 0;
    let frame = 0;
    const hold = 2; // frames locked per character
    const start = window.setTimeout(() => {
      const tick = () => {
        const revealed = Math.floor(frame / hold);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") s += " ";
          else if (i < revealed) s += text[i];
          else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOut(s);
        frame++;
        if (revealed <= text.length) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      window.clearTimeout(start);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return (
    <span className={className} aria-label={text}>
      {out || " "}
    </span>
  );
}

/* Corner brackets — the framing ticks around a targeted subject. */
function Brackets({ accent }: { accent: string }) {
  const common = "pointer-events-none absolute h-6 w-6 md:h-8 md:w-8";
  const style = { borderColor: accent };
  return (
    <>
      <span className={`${common} left-3 top-3 border-l border-t md:left-4 md:top-4`} style={style} />
      <span className={`${common} right-3 top-3 border-r border-t md:right-4 md:top-4`} style={style} />
      <span className={`${common} bottom-3 left-3 border-b border-l md:bottom-4 md:left-4`} style={style} />
      <span className={`${common} bottom-3 right-3 border-b border-r md:bottom-4 md:right-4`} style={style} />
    </>
  );
}

/* ------------------------------------------------------------
   FOUNDER DOSSIER — the slab, fractured open and filling the screen.
   Left: the portrait under a live scanning reticle.
   Right: the operator's file, decrypting field by field.
------------------------------------------------------------ */
function FounderDossier({
  founder,
  onClose,
}: {
  founder: Founder;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);

  // "Acquiring target" → "locked" once the portrait has flown into place.
  useEffect(() => {
    const id = window.setTimeout(() => setLocked(true), 950);
    return () => window.clearTimeout(id);
  }, []);

  const fields: { k: string; v: string }[] = [
    { k: "Designation", v: founder.title },
    { k: "Signal", v: founder.signal },
    { k: "Discipline", v: founder.focus[0] },
    { k: "Clearance", v: "Partner" },
    { k: "Origin", v: founder.origin },
    { k: "Status", v: "Active" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE } }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed inset-0 z-[80] bg-midnight"
    >
      {/* Native-scrolling surface. data-lenis-prevent stops the smooth-scroll
          engine from stealing the wheel and moving the page behind us. */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="dossier-grid h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain"
      >
        {/* Ambient signature glow, tinted to the founder */}
        <div
          className="pointer-events-none fixed inset-0 opacity-60"
          style={{
            background: `radial-gradient(60% 55% at 78% 8%, ${founder.accent}14, transparent 60%), radial-gradient(50% 50% at 4% 92%, ${founder.accent}10, transparent 65%)`,
          }}
        />

        {/* -------- HUD header bar -------- */}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[85] flex items-center justify-between px-6 py-6 font-mono text-[0.6rem] tracking-[0.28em] text-silver uppercase md:px-12">
          <span className="flex items-center gap-3">
            <span className="text-white">◢ Astralyn</span>
            <span className="hidden text-steel sm:inline">Personnel Dossier</span>
          </span>
          <span className="hidden text-steel md:inline">
            File No. AX-00{founder.n} · Clearance: Partner
          </span>
        </div>

        <button
          onClick={onClose}
          className="fixed top-5 right-6 z-[90] flex items-center gap-2 border border-white/20 bg-midnight/70 px-5 py-3 font-mono text-[0.62rem] tracking-[0.25em] text-silver uppercase backdrop-blur-md transition-all duration-500 hover:border-white/60 hover:text-white hover:shadow-[0_0_30px_rgba(245,246,247,0.15)] md:right-12"
        >
          Close <span className="text-steel">Esc</span>
        </button>

        {/* ================= THE SPLIT ================= */}
        <section className="relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          {/* -------- PORTRAIT PANEL -------- */}
          <div className="relative min-h-[56svh] overflow-hidden border-white/10 lg:min-h-0 lg:border-r">
            {/* The portrait itself, morphing in from the card */}
            <motion.div layoutId={`portrait-${founder.n}`} transition={LAYOUT_TX} className="absolute inset-0">
              {founder.photo ? (
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="h-full w-full object-cover object-[center_16%] grayscale contrast-[1.1]"
                />
              ) : (
                <div aria-hidden className="relative h-full w-full opacity-70">
                  <Field variant={founder.field} seed={23} />
                </div>
              )}
            </motion.div>

            {/* Legibility scrims */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.5)_0%,transparent_28%,transparent_60%,rgba(8,9,10,0.85)_100%)]" />

            {/* Operator overlays — fade in once the subject is acquired */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
              className="pointer-events-none absolute inset-0"
            >
              <div className="dossier-scanlines absolute inset-0 opacity-40" />
              <div
                className="dossier-scan absolute inset-x-0 top-0 h-24"
                style={{
                  background: `linear-gradient(180deg, transparent, ${founder.accent}22 60%, ${founder.accent}55 100%)`,
                  borderBottom: `1px solid ${founder.accent}aa`,
                }}
              />
              <Brackets accent={founder.accent} />

              {/* Reticle over the face */}
              <div className="reticle-pulse absolute left-1/2 top-[30%] h-28 w-28 md:h-36 md:w-36">
                <span className="absolute inset-0 rounded-full border" style={{ borderColor: `${founder.accent}88` }} />
                <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2" style={{ background: founder.accent }} />
                <span className="absolute left-1/2 bottom-0 h-4 w-px -translate-x-1/2" style={{ background: founder.accent }} />
                <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2" style={{ background: founder.accent }} />
                <span className="absolute top-1/2 right-0 h-px w-4 -translate-y-1/2" style={{ background: founder.accent }} />
              </div>

              {/* Edge telemetry */}
              <div className="absolute bottom-4 left-4 font-mono text-[0.58rem] leading-relaxed tracking-[0.22em] text-silver uppercase md:bottom-6 md:left-6">
                <p>OPR-00{founder.n} · {founder.origin}</p>
                <p className="flex items-center gap-2 text-white">
                  <span
                    className="status-blink inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: locked ? founder.accent : "#f5f5f0" }}
                  />
                  {locked ? "Target Locked" : "Acquiring…"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* -------- DATA PANEL -------- */}
          <div className="relative flex flex-col justify-center px-6 py-28 md:px-12 lg:px-16">
            {/* Floating project tags */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              {founder.projects.map((p, i) => (
                <motion.span
                  key={p.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.28, y: [0, -p.drift, 0] }}
                  transition={{
                    opacity: { duration: 1.4, delay: 1.2 + i * 0.15, ease: EASE },
                    y: { duration: 7 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 },
                  }}
                  style={{ left: p.x, top: p.y, color: founder.accent }}
                  className="absolute font-mono text-[0.6rem] tracking-[0.3em] uppercase"
                >
                  {p.name}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
              className="label mb-6"
              style={{ color: founder.accent }}
            >
              Subject — Founder {founder.n}
            </motion.p>

            <h1 className="display-black headline-lit text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.9] uppercase">
              <RevealWords text={founder.name} delay={0.65} />
            </h1>

            {/* Decrypting field grid */}
            <motion.dl
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/[0.09] pt-8 sm:grid-cols-3"
            >
              {fields.map((f, i) => (
                <div key={f.k}>
                  <dt className="font-mono text-[0.56rem] tracking-[0.26em] text-steel uppercase">
                    {f.k}
                  </dt>
                  <dd className="mt-2 font-mono text-sm tracking-[0.08em] text-white uppercase">
                    <Scramble text={f.v} delay={1.05 + i * 0.12} />
                  </dd>
                </div>
              ))}
            </motion.dl>

            {/* Directive / philosophy */}
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
              className="mt-12 border-l pl-6 md:pl-8"
              style={{ borderColor: `${founder.accent}55` }}
            >
              <p className="label mb-4">Directive</p>
              <p className="text-xl leading-relaxed font-light text-chrome md:text-2xl">
                “{founder.philosophy}”
              </p>
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6, ease: EASE }}
              className="mt-10 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.28em] text-steel uppercase"
            >
              Scroll for full record
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block h-4 w-px"
                style={{ background: founder.accent }}
              />
            </motion.p>
          </div>
        </section>

        {/* ================= FULL RECORD (scroll) ================= */}
        <section className="relative mx-auto max-w-[1600px] px-6 pb-40 pt-16 md:px-12">
          <div className="mb-16 h-px w-full bg-white/[0.08]" />

          {/* Focus + Technologies */}
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <p className="label mb-8">Focus</p>
              <ul className="space-y-4">
                {founder.focus.map((e) => (
                  <li
                    key={e}
                    className="display border-b border-white/[0.07] pb-4 text-xl text-white md:text-2xl"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-8">Technologies</p>
              <div className="flex flex-wrap gap-3">
                {founder.technologies.map((t) => (
                  <span
                    key={t}
                    className="border border-white/15 px-4 py-2 font-mono text-[0.65rem] tracking-[0.2em] text-silver uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-28">
            <p className="label mb-12">Milestones</p>
            <div className="space-y-0">
              {founder.timeline.map((m) => (
                <div
                  key={m.year}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-8 border-t border-white/[0.07] py-6 md:gap-16"
                >
                  <p className="font-mono text-sm text-steel">{m.year}</p>
                  <p className="text-base leading-relaxed text-silver md:text-lg">
                    {m.event}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-28 font-mono text-xs tracking-[0.3em] text-silver uppercase">
            Powered by Astralyn.
          </p>
        </section>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------
   THE HOUSE — the rest of the roster.
   Discipline on the left, people on the right. Each person carries
   the glyph of their work: scales for counsel, a compass for the
   consultants brought in to set a bearing, a lighthouse for advisors.
------------------------------------------------------------ */
function Roster() {
  const groups = groupedTeam();

  if (groups.length === 0) return null;

  return (
    <section
      id="the-house"
      className="section-tex relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32"
    >
      <Reveal>
        <p className="label mb-8">The House</p>
        <h2 className="display headline-lit max-w-3xl text-[clamp(2.2rem,5.5vw,4.5rem)]">
          The rest of the team.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-silver">
          The specialists we retain, the counsel we keep and the people who
          advise the house. Filed by discipline, each carrying the mark of what
          they do.
        </p>
      </Reveal>

      <div className="mt-20 space-y-20 md:mt-28 md:space-y-28">
        {groups.map(({ kind, members }, gi) => (
          <Reveal key={kind} delay={Math.min(gi, 3) * 0.06}>
            <div className="grid gap-8 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:gap-16">
              {/* Discipline */}
              <div className="md:sticky md:top-32 md:self-start">
                <p className="label">{ROLE_META[kind].label}</p>
                <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-steel">
                  {ROLE_META[kind].blurb}
                </p>
                <p className="mt-5 font-mono text-[0.6rem] tracking-[0.28em] text-steel uppercase">
                  {String(members.length).padStart(2, "0")}{" "}
                  {members.length === 1 ? "Person" : "People"}
                </p>
              </div>

              {/* People */}
              <ul className="border-b border-white/[0.07]">
                {members.map((m) => (
                  <li
                    key={`${m.name}-${m.role}`}
                    className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-3 border-t border-white/[0.07] py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  >
                    <RoleIcon kind={m.kind} plated />
                    <div className="min-w-0">
                      <p className="display truncate text-lg text-white transition-colors duration-500 group-hover:text-chrome md:text-xl">
                        {m.name}
                      </p>
                      <p className="mt-1.5 font-mono text-[0.6rem] tracking-[0.22em] text-steel uppercase">
                        {m.role}
                      </p>
                    </div>
                    {m.socials && m.socials.length > 0 && (
                      <div className="col-start-2 -ml-2 flex items-center gap-0.5 sm:col-start-3 sm:ml-0 sm:justify-end">
                        {m.socials.map((s) => (
                          <SocialLink
                            key={s.kind}
                            kind={s.kind}
                            href={s.href}
                            name={m.name}
                          />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   PAGE
------------------------------------------------------------ */
export default function TeamPage() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock the page and pause smooth scroll while the dossier is open, so the
  // overlay scrolls natively instead of the wheel leaking to the page behind.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (active !== null) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [active]);

  return (
    <>
      {/* ---------------- ARRIVAL ---------------- */}
      <section className="relative overflow-hidden">
        <div className="aurora opacity-50" />
        <div className="relative mx-auto max-w-[1600px] px-6 pt-40 pb-24 md:px-12 md:pt-52">
          <Reveal>
            <p className="label mb-10">The Team</p>
          </Reveal>
          <h1 className="display-black headline-lit text-[clamp(3rem,9vw,8.5rem)] uppercase">
            <RevealWords text="Four minds." delay={0.2} />
            <br />
            <RevealWords text="One house." delay={0.5} chrome />
          </h1>
          <Reveal delay={0.7} className="mt-12 max-w-md">
            <p className="text-base leading-relaxed text-silver">
              Four founders, presented as dossiers rather than profiles — and
              behind them the people who do the work. Approach a founder and the
              band opens; activate it and the file fills the screen.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <DrawnLine />
      </div>

      {/* ---------------- THE FOUNDERS ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        <Reveal>
          <p className="label mb-10">The Founders — 04</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ExpandCards founders={FOUNDERS} onOpen={setActive} />
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-10 text-center font-mono text-xs tracking-[0.3em] text-steel uppercase">
            Hover to open a band. Click it again for the dossier.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <DrawnLine />
      </div>

      {/* ---------------- THE HOUSE ---------------- */}
      <Roster />

      {/* ---------------- THE DOSSIER ---------------- */}
      <AnimatePresence>
        {active !== null && (
          <FounderDossier
            key={FOUNDERS[active].n}
            founder={FOUNDERS[active]}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
