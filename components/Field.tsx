"use client";

import { useEffect, useRef } from "react";

/**
 * Field — the instrument that replaced the stock gradient plates.
 *
 * Every "image" on this site used to be a blurred radial blob run through
 * grayscale(), which meant six chapters, three capabilities and three products
 * all rendered as the same grey smudge. A Field draws instead: seeded,
 * monochrome line-work where the *structure* carries the meaning of the section
 * it sits in — a dormant lattice for Potential, a vector field for Strategy, a
 * signal graph for Technology. Light is the only accent, so light is the only
 * thing that moves.
 *
 * Deterministic (same seed → same composition), paused when off-screen, and
 * reduced to a single static frame when the visitor asks for less motion.
 */

export type FieldVariant =
  | "dormant" // 01 Potential — stored charge in a still lattice
  | "vector" // 02 Strategy — a field finding its direction
  | "frame" // 03 Design — architectural subdivision
  | "network" // 04 Technology — signal travelling through structure
  | "radiate" // 05 Products — power broadcast outward
  | "compound" // 06 Impact — momentum accumulating
  | "flow" // value moving like light
  | "scan"; // every signal made visible

const INK = "245,245,240";

/** Ambient motion is slow; 30fps is indistinguishable and halves the cost. */
const FRAME_MS = 33;
const MAX_DPR = 1.5;

/** mulberry32 — small, fast, and stable across reloads. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ink = (a: number) => `rgba(${INK},${a})`;

type Draw = (
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  seed: number,
) => void;

/* ------------------------------------------------------------------
   01 — POTENTIAL
   A lattice at rest. A charge front crosses it on a long diagonal and
   the nodes it touches brighten, then settle back to dormant.
------------------------------------------------------------------- */
const dormant: Draw = (c, w, h, t) => {
  const gap = Math.max(16, Math.min(w, h) / 20);
  const front = ((t * 0.075) % 1.7) - 0.32;

  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      const p = (x / w) * 0.62 + (y / h) * 0.38;
      const charge = Math.max(0, 1 - Math.abs(p - front) / 0.15);
      const e = charge * charge;
      c.fillStyle = ink(0.17 + e * 0.8);
      const r = 1 + e * 1.9;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
  }
};

/* ------------------------------------------------------------------
   02 — STRATEGY
   Iron filings. Every segment in the field turns to face one drifting
   attractor: direction resolved before anything moves.
------------------------------------------------------------------- */
const vector: Draw = (c, w, h, t) => {
  const ax = w * (0.5 + 0.24 * Math.cos(t * 0.062));
  const ay = h * (0.5 + 0.2 * Math.sin(t * 0.049));
  const gap = Math.max(20, Math.min(w, h) / 15);

  c.lineCap = "round";
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      const dx = ax - x;
      const dy = ay - y;
      const d = Math.hypot(dx, dy);
      const pull = Math.min(1, 300 / (d + 120));
      const len = gap * (0.2 + 0.28 * pull);
      const a = Math.atan2(dy, dx);
      c.strokeStyle = ink(0.15 + 0.6 * pull);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len);
      c.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      c.stroke();
    }
  }

  c.fillStyle = ink(0.9);
  c.beginPath();
  c.arc(ax, ay, 2.2, 0, Math.PI * 2);
  c.fill();
};

/* ------------------------------------------------------------------
   03 — DESIGN
   Orthogonal subdivision around a slowly drifting focal point. A plan
   drawing: clarity engineered into form.
------------------------------------------------------------------- */
const frame: Draw = (c, w, h, t) => {
  const fx = w * (0.5 + 0.1 * Math.cos(t * 0.05));
  const fy = h * (0.5 + 0.08 * Math.sin(t * 0.041));
  const m = Math.min(w, h) * 0.06;

  let l = m;
  let r = w - m;
  let tp = m;
  let b = h - m;

  c.lineWidth = 1;
  for (let i = 0; i < 13; i++) {
    c.strokeStyle = ink(0.09 + i * 0.045);
    c.strokeRect(
      Math.round(l) + 0.5,
      Math.round(tp) + 0.5,
      Math.round(r - l),
      Math.round(b - tp),
    );
    const k = 0.11;
    l += (fx - l) * k;
    r += (fx - r) * k;
    tp += (fy - tp) * k;
    b += (fy - b) * k;
  }

  c.strokeStyle = ink(0.26);
  c.beginPath();
  c.moveTo(0, Math.round(fy) + 0.5);
  c.lineTo(w, Math.round(fy) + 0.5);
  c.moveTo(Math.round(fx) + 0.5, 0);
  c.lineTo(Math.round(fx) + 0.5, h);
  c.stroke();
};

/* ------------------------------------------------------------------
   04 — TECHNOLOGY
   A proximity graph with signal running the edges. The structure is
   fixed; the energy is what moves through it.
------------------------------------------------------------------- */
const network: Draw = (c, w, h, t, seed) => {
  const r = rng(seed);
  const n = 24;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    pts.push([
      w * (0.06 + r() * 0.88),
      h * (0.08 + r() * 0.84),
    ]);
  }

  // Each node links to its two nearest neighbours; dedupe by index order.
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < n; i++) {
    const near = pts
      .map((p, j) => ({ j, d: Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const o of near) {
      const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, o.j]);
    }
  }

  c.lineWidth = 1;
  c.strokeStyle = ink(0.22);
  c.beginPath();
  for (const [i, j] of edges) {
    c.moveTo(pts[i][0], pts[i][1]);
    c.lineTo(pts[j][0], pts[j][1]);
  }
  c.stroke();

  c.fillStyle = ink(0.55);
  for (const [x, y] of pts) c.fillRect(Math.round(x) - 1.5, Math.round(y) - 1.5, 3, 3);

  // Signal: a lit head with a short tail, on roughly half the edges.
  edges.forEach(([i, j], e) => {
    if ((e * 2654435761) % 100 > 46) return;
    const phase = ((t * 0.2 + e * 0.163) % 1.35) / 1;
    if (phase > 1) return;
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[j];
    const hx = x0 + (x1 - x0) * phase;
    const hy = y0 + (y1 - y0) * phase;
    const tail = Math.max(0, phase - 0.16);
    const tx = x0 + (x1 - x0) * tail;
    const ty = y0 + (y1 - y0) * tail;
    const g = c.createLinearGradient(tx, ty, hx, hy);
    g.addColorStop(0, ink(0));
    g.addColorStop(1, ink(0.85));
    c.strokeStyle = g;
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(tx, ty);
    c.lineTo(hx, hy);
    c.stroke();
  });
};

/* ------------------------------------------------------------------
   05 — PRODUCTS
   Emission. Rings leave the core and carry outward past the frame.
------------------------------------------------------------------- */
const radiate: Draw = (c, w, h, t) => {
  const cx = w / 2;
  const cy = h / 2;
  const max = Math.hypot(w, h) / 1.7;

  c.lineWidth = 1;
  for (const f of [0.22, 0.44, 0.72]) {
    c.strokeStyle = ink(0.11);
    c.beginPath();
    c.arc(cx, cy, max * f, 0, Math.PI * 2);
    c.stroke();
  }

  const rings = 6;
  for (let k = 0; k < rings; k++) {
    const phase = (t * 0.115 + k / rings) % 1;
    const a = 0.6 * (1 - phase) * Math.min(1, phase * 7);
    if (a <= 0.002) continue;
    c.strokeStyle = ink(a);
    c.lineWidth = 1 + (1 - phase) * 0.8;
    c.beginPath();
    c.arc(cx, cy, phase * max, 0, Math.PI * 2);
    c.stroke();
  }

  const pulse = 0.6 + 0.4 * Math.sin(t * 0.9);
  c.fillStyle = ink(0.5 + pulse * 0.45);
  c.beginPath();
  c.arc(cx, cy, 2.4 + pulse, 0, Math.PI * 2);
  c.fill();
};

/* ------------------------------------------------------------------
   06 — IMPACT
   A compounding curve read as measurement, with a highlight travelling
   the series so the growth is felt rather than asserted.
------------------------------------------------------------------- */
const compound: Draw = (c, w, h, t) => {
  const n = 40;
  const base = h * 0.84;
  const top = h * 0.16;
  const step = w / (n + 1);
  const head = ((t * 0.09) % 1.45) * n;

  const yAt = (i: number) => base - Math.pow(i / (n - 1), 2.2) * (base - top);

  c.strokeStyle = ink(0.16);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(0, Math.round(base) + 0.5);
  c.lineTo(w, Math.round(base) + 0.5);
  c.stroke();

  for (let i = 0; i < n; i++) {
    const x = step * (i + 1);
    const y = yAt(i);
    const near = Math.max(0, 1 - Math.abs(i - head) / 5);
    c.strokeStyle = ink(0.15 + (i / n) * 0.24 + near * near * 0.6);
    c.lineWidth = 1 + near * 1.2;
    c.beginPath();
    c.moveTo(Math.round(x) + 0.5, base);
    c.lineTo(Math.round(x) + 0.5, y);
    c.stroke();
  }

  c.strokeStyle = ink(0.6);
  c.lineWidth = 1.3;
  c.beginPath();
  for (let i = 0; i < n; i++) {
    const x = step * (i + 1);
    const y = yAt(i);
    i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
  }
  c.stroke();
};

/* ------------------------------------------------------------------
   FLOW — value moving through infrastructure, as light in lanes.
------------------------------------------------------------------- */
const flow: Draw = (c, w, h, t, seed) => {
  const r = rng(seed);
  const lanes = 13;
  c.lineWidth = 1;

  for (let i = 0; i < lanes; i++) {
    const y = Math.round(h * ((i + 0.5) / lanes)) + 0.5;
    c.strokeStyle = ink(0.12);
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(w, y);
    c.stroke();

    const speed = 0.07 + r() * 0.14;
    const offset = r();
    const packets = r() > 0.55 ? 2 : 1;
    for (let p = 0; p < packets; p++) {
      const x = (((t * speed + offset + p * 0.5) % 1.28) - 0.14) * w;
      const len = w * (0.08 + r() * 0.06);
      const g = c.createLinearGradient(x - len, 0, x, 0);
      g.addColorStop(0, ink(0));
      g.addColorStop(1, ink(0.72));
      c.strokeStyle = g;
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(x - len, y);
      c.lineTo(x, y);
      c.stroke();
    }
  }
};

/* ------------------------------------------------------------------
   SCAN — a sweep that finds signal in noise and brackets what it finds.
------------------------------------------------------------------- */
const scan: Draw = (c, w, h, t, seed) => {
  const g = 26;
  c.strokeStyle = ink(0.08);
  c.lineWidth = 1;
  c.beginPath();
  for (let x = g; x < w; x += g) {
    c.moveTo(Math.round(x) + 0.5, 0);
    c.lineTo(Math.round(x) + 0.5, h);
  }
  for (let y = g; y < h; y += g) {
    c.moveTo(0, Math.round(y) + 0.5);
    c.lineTo(w, Math.round(y) + 0.5);
  }
  c.stroke();

  const r = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < 40; i++) pts.push([w * r(), h * r()]);

  const sx = (((t * 0.12) % 1.3) - 0.15) * w;

  for (const [x, y] of pts) {
    const lag = sx - x;
    let b: number;
    if (lag >= 0) b = Math.exp(-lag / (w * 0.3));
    else b = Math.max(0, 1 + lag / (w * 0.015));

    c.fillStyle = ink(0.18 + b * 0.75);
    c.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);

    if (b > 0.35) {
      const s = 6;
      c.strokeStyle = ink((b - 0.35) * 0.85);
      c.lineWidth = 1;
      c.beginPath();
      // Corner brackets — a lock, not a box.
      c.moveTo(x - s, y - s + 3);
      c.lineTo(x - s, y - s);
      c.lineTo(x - s + 3, y - s);
      c.moveTo(x + s - 3, y + s);
      c.lineTo(x + s, y + s);
      c.lineTo(x + s, y + s - 3);
      c.stroke();
    }
  }

  const band = w * 0.06;
  const lg = c.createLinearGradient(sx - band, 0, sx, 0);
  lg.addColorStop(0, ink(0));
  lg.addColorStop(1, ink(0.22));
  c.fillStyle = lg;
  c.fillRect(sx - band, 0, band, h);
  c.fillStyle = ink(0.5);
  c.fillRect(Math.round(sx), 0, 1, h);
};

const DRAW: Record<FieldVariant, Draw> = {
  dormant,
  vector,
  frame,
  network,
  radiate,
  compound,
  flow,
  scan,
};

export default function Field({
  variant,
  seed = 7,
  className = "",
}: {
  variant: FieldVariant;
  /** Same seed → same composition, so layouts stay stable across reloads. */
  seed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = DRAW[variant];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    let w = 0;
    let h = 0;

    // Reduced motion still deserves a composition — just a fixed one, taken at
    // a moment where every variant is mid-gesture rather than empty.
    const stillFrame = 6.2;

    const paint = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // A plate to draw on, so the frame reads as material rather than a hole.
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#0d0d0d");
      bg.addColorStop(0.55, "#070707");
      bg.addColorStop(1, "#101010");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      draw(ctx, w, h, t, seed);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      paint(stillFrame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (still) return () => ro.disconnect();

    let raf = 0;
    let last = 0;
    let live = false;
    const start = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      paint((now - start) / 1000);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === live) return;
        live = entry.isIntersecting;
        if (live) raf = requestAnimationFrame(loop);
        else cancelAnimationFrame(raf);
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [variant, seed]);

  return <canvas ref={ref} aria-hidden className={`field-canvas ${className}`} />;
}
