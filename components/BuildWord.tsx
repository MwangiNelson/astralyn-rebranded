"use client";

import { useEffect, useRef } from "react";

/**
 * BuildWord — a word of display type that is surveyed, then laid course by
 * course in running bond, ground up, each brick landing hot and cooling to
 * white. When it tops out the scaffolding comes down and the mortar cures, so
 * the finished word keeps its joints as proof of how it was made.
 *
 * The bricks draw on a canvas over white glyphs with mix-blend-mode: darken,
 * the same mask EnergyWord used, so they show only inside the letterforms
 * without tracing a single glyph outline. A second canvas, blended normally,
 * carries the guides that sit outside the type. The loop stops once the word
 * is built rather than running for the life of the page.
 */

const COURSES = 6;
const LAY = 0.34; // seconds for one brick to drop and settle
const COOL = 0.5; // seconds from hot to cured
const ROW_GAP = 0.2; // a course starts this long after the one below it
const SWEEP = 0.4; // seconds to lay one course left to right
const SURVEY = 0.45; // guides draw before the first brick
const CURE = 0.5;
const STRIKE = 0.7; // scaffolding fade
const MAX_DPR = 2;

// Unlaid ground is the page colour, so nothing shows before a brick lands.
const GROUND = [8, 8, 8];
const HOT = [255, 168, 64];
const JOINT = [168, 167, 161];

type Brick = { x: number; y: number; w: number; t0: number; tone: number };
type Geo = {
  w: number;
  h: number;
  base: number;
  top: number;
  course: number;
  gap: number;
  bricks: Brick[];
  laid: number[]; // time each course finishes
  end: number;
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const expoOut = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
const mix = (a: number[], b: number[], k: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;

/** Deterministic per-brick tone so a rebuild lays the same wall. */
const tone = (r: number, i: number) => {
  const s = Math.sin(r * 127.1 + i * 311.7) * 43758.5453;
  return 0.84 + (s - Math.floor(s)) * 0.16;
};

function measure(text: HTMLElement, probe: HTMLElement): Geo {
  const { width: w, height: h } = text.getBoundingClientRect();
  const cs = getComputedStyle(text);
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = ctx.measureText((text.textContent || "").toUpperCase());
  // The probe is a 0×0 inline-block, so its top sits on the text baseline.
  const baseline = probe.offsetTop;
  const base = baseline + m.actualBoundingBoxDescent + 1;
  const top = baseline - m.actualBoundingBoxAscent - 1;
  const course = (base - top) / COURSES;
  const len = course * 2.15;
  const gap = Math.max(1.25, course * 0.08);

  const bricks: Brick[] = [];
  const laid: number[] = [];
  for (let r = 0; r < COURSES; r++) {
    const y = base - (r + 1) * course;
    const start = SURVEY + r * ROW_GAP;
    let i = 0;
    for (let x = r % 2 ? -len / 2 : 0; x < w; x += len, i++) {
      bricks.push({ x, y, w: len, t0: start + clamp(x / w) * SWEEP, tone: tone(r, i) });
    }
    laid.push(start + SWEEP + LAY);
  }
  const topped = laid[COURSES - 1] + COOL;
  return { w, h, base, top, course, gap, bricks, laid, end: topped + Math.max(CURE, STRIKE) };
}

export default function BuildWord({
  children,
  start,
  delay = 0,
}: {
  children: React.ReactNode;
  /** Begin the build; the word holds as scaffolding until then. */
  start: boolean;
  delay?: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLCanvasElement>(null);
  const rigRef = useRef<HTMLCanvasElement>(null);
  const outlineRef = useRef<HTMLSpanElement>(null);
  const rebuild = useRef<() => void>(() => {});

  useEffect(() => {
    const text = textRef.current!;
    const probe = probeRef.current!;
    const fill = fillRef.current!;
    const rig = rigRef.current!;
    const outline = outlineRef.current!;
    const fctx = fill.getContext("2d");
    const rctx = rig.getContext("2d");
    if (!fctx || !rctx) return; // the white word stands as it is

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let geo: Geo | null = null;
    let pad = 0;
    let raf = 0;
    let t0 = 0;
    let running = false;
    let begun = false;

    const size = () => {
      geo = measure(text, probe);
      pad = Math.round(geo.course * 1.4);
      fill.width = Math.round(geo.w * dpr);
      fill.height = Math.round(geo.h * dpr);
      rig.width = Math.round((geo.w + pad * 2) * dpr);
      rig.height = Math.round(geo.h * dpr);
      rig.style.left = `${-pad}px`;
      rig.style.width = `${geo.w + pad * 2}px`;
    };

    const draw = (t: number) => {
      if (!geo) return;
      const g = geo;
      const topped = g.laid[COURSES - 1] + COOL;

      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.fillStyle = `rgb(${GROUND.join(",")})`;
      fctx.fillRect(0, 0, g.w, g.h);
      // Mortar: ground-coloured (invisible) while laying, so each brick reads on its own.
      const cure = expoOut(clamp((t - topped) / CURE));
      if (cure > 0) {
        fctx.fillStyle = mix(GROUND, JOINT, cure);
        fctx.fillRect(0, g.top, g.w, g.base - g.top);
      }
      for (const b of g.bricks) {
        const p = clamp((t - b.t0) / LAY);
        if (p <= 0) continue;
        const drop = (1 - expoOut(p)) * g.course * 0.9;
        const heat = expoOut(clamp((t - b.t0 - LAY * 0.6) / COOL));
        const final = [255 * b.tone, 255 * b.tone, 250 * b.tone];
        fctx.globalAlpha = clamp(p / 0.3);
        fctx.fillStyle = mix(HOT, final, heat);
        fctx.fillRect(b.x + g.gap / 2, b.y - drop + g.gap / 2, b.w - g.gap, g.course - g.gap);
      }
      fctx.globalAlpha = 1;

      // Scaffolding: two level lines, two plumb lines and a course gauge.
      const strike = 1 - clamp((t - topped) / STRIKE);
      outline.style.opacity = String(0.6 * strike * clamp(t / 0.3));
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rctx.clearRect(0, 0, g.w + pad * 2, g.h);
      if (strike <= 0) return;
      rctx.globalAlpha = strike;
      const survey = expoOut(clamp(t / SURVEY));
      const span = (g.w + pad * 2) * survey;
      rctx.fillStyle = "rgba(171,171,170,0.55)";
      for (const y of [g.base, g.top]) rctx.fillRect(0, Math.round(y), span, 1);
      const plumb = (g.base - g.top + pad) * survey;
      for (const x of [pad, pad + g.w]) rctx.fillRect(Math.round(x), g.top - pad / 2, 1, plumb);
      for (let k = 0; k < COURSES; k++) {
        const lit = clamp((t - g.laid[k]) / 0.15) - clamp((t - g.laid[k] - 0.15) / 0.6) * 0.6;
        rctx.fillStyle = `rgba(245,245,240,${(0.35 + 0.65 * lit) * survey})`;
        rctx.fillRect(pad * 0.35, Math.round(g.base - (k + 1) * g.course), pad * 0.35, 1);
      }
      rctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      draw(t);
      if (geo && t < geo.end) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const build = () => {
      if (running || !geo) return;
      if (still) return draw(geo.end);
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    };
    rebuild.current = () => {
      if (begun && !running && !still) build();
    };

    let timer = 0;
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      size();
      draw(0);
      if (start) {
        timer = window.setTimeout(() => {
          begun = true;
          build();
        }, delay * 1000);
      }
    });

    const ro = new ResizeObserver(() => {
      if (!geo) return;
      size();
      if (!running) draw(begun ? geo!.end : 0);
    });
    ro.observe(text);

    return () => {
      alive = false;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [start, delay]);

  return (
    <span
      className="build-word"
      onPointerEnter={(e) => e.pointerType === "mouse" && rebuild.current()}
    >
      <span ref={textRef} className="build-word-text">
        {children}
        <span ref={probeRef} className="build-word-probe" />
      </span>
      <canvas ref={fillRef} className="build-word-fill" aria-hidden />
      <span ref={outlineRef} className="build-word-outline" aria-hidden>
        {children}
      </span>
      <canvas ref={rigRef} className="build-word-rig" aria-hidden />
    </span>
  );
}
