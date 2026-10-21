"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * SERVICE LIFE — an instrument for "Software has a long working life".
 * Ten years of a system's activity, drawn as the reader scrolls the
 * principles, with each principle marked at the moment it matters: controls
 * at year zero, a failure contained in year three, other products branching
 * off the shared foundation, and the exit path still open at year ten.
 * The trace is a schematic, not data; the readout says "year", never a metric.
 */

const W = 520;
const H = 230;
const AXIS = 196;
const BASE = 104;
const STEPS = 160;

const INCIDENT = 0.3;
const BRANCHES = [0.52, 0.64];

/** Steady activity with a little life in it, one contained dip, then recovery. */
function level(t: number) {
  const hum = Math.sin(t * 41) * 3 + Math.sin(t * 17 + 1.3) * 4 + Math.sin(t * 97) * 1.4;
  const d = (t - INCIDENT) / 0.022;
  const dip = 58 * Math.exp(-d * d);
  const rise = -t * 22; // the system carries more as the years go on
  return BASE + hum + dip + rise;
}

const pts = Array.from({ length: STEPS + 1 }, (_, i) => {
  const t = i / STEPS;
  return [t * W, level(t)] as const;
});
const MAIN = "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");

function branch(from: number, offset: number) {
  const seg = pts.filter(([x]) => x >= from * W);
  return (
    "M" +
    seg
      .map(([x, y], i) => {
        const k = Math.min(1, i / 14);
        return `${x.toFixed(1)},${(y + offset * k * k * (3 - 2 * k)).toFixed(1)}`;
      })
      .join(" L")
  );
}
const BRANCH_PATHS = [branch(BRANCHES[0], 30), branch(BRANCHES[1], 54)];

const at = (t: number) => pts[Math.round(t * STEPS)];

export default function ServiceLife({
  progress,
  active,
}: {
  /** 0 → 1 across the section's scroll. */
  progress: MotionValue<number>;
  /** Index of the principle being read: security, reliability, shared, data. */
  active: number;
}) {
  const draw = useTransform(progress, [0.04, 0.92], [0, 1], { clamp: true });
  const headX = useTransform(draw, (v) => at(v)[0]);
  const headY = useTransform(draw, (v) => at(v)[1]);
  const year = useTransform(draw, (v) => `Year ${Math.min(10, Math.floor(v * 10.0001))}`);
  // Reveal by year, not by path length: the dip adds length, so a length-based
  // reveal would leave the head running ahead of the line through the incident.
  const sweep = useTransform(draw, (v) => v * W + 1);

  const on = (i: number) => (active === i ? 1 : 0.32);
  const tone = (i: number) => (active === i ? "#f5f5f0" : "#6e6e6e");
  const fade = { transition: "opacity 400ms cubic-bezier(0.16,1,0.3,1), fill 400ms, stroke 400ms" };

  const [ix, iy] = at(INCIDENT);
  const [bx, by] = at(BRANCHES[0]);
  const [ex, ey] = at(1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full overflow-visible"
      role="img"
      aria-label="A system's ten-year working life: security controls from year zero, a failure contained and recovered, other products sharing the foundation, and an exit path kept open."
    >
      <defs>
        <clipPath id="service-life-sweep">
          <motion.rect x="-4" y="0" height={H} width={sweep} />
        </clipPath>
      </defs>

      {/* Axis: ten years, labelled where a reader needs a bearing. */}
      <line x1="0" x2={W} y1={AXIS} y2={AXIS} stroke="#3a3a38" strokeWidth="1" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={(i / 10) * W} x2={(i / 10) * W} y1={AXIS} y2={AXIS + (i % 5 ? 4 : 8)} stroke="#56554f" />
      ))}
      <g className="font-mono" fontSize="9" letterSpacing="2" fill="#6e6e6e">
        <text x="0" y={AXIS + 22}>0</text>
        <text x={W / 2} y={AXIS + 22} textAnchor="middle">5</text>
        <text x={W} y={AXIS + 22} textAnchor="end">10 YRS</text>
        <motion.text x={W} y="12" textAnchor="end" fill="#ababaa">{year}</motion.text>
      </g>

      {/* 01 Security: controls stand from year zero, the full height of the life. */}
      <g style={{ ...fade, opacity: on(0) }}>
        <rect x="0" y="22" width="3" height={AXIS - 22} fill={tone(0)} style={fade} />
        <text x="12" y="34" className="font-mono" fontSize="9" letterSpacing="1.6" fill={tone(0)} style={fade}>
          CONTROLS FROM DAY ONE
        </text>
      </g>

      {/* 02 Reliability: the dip is bracketed, and the trace comes back. */}
      <g style={{ ...fade, opacity: on(1) }}>
        <path
          d={`M${ix - 26},${iy + 10} v6 h52 v-6`}
          fill="none"
          stroke={tone(1)}
          strokeWidth="1"
          style={fade}
        />
        <text x={ix} y={iy + 30} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="1.6" fill={tone(1)} style={fade}>
          FAILURE CONTAINED
        </text>
      </g>

      {/* 03 Shared foundations: later products run off the same line. */}
      <g style={{ ...fade, opacity: active === 2 ? 1 : 0.4 }}>
        {BRANCH_PATHS.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={active === 2 ? "#d8d8d4" : "#56554f"}
            strokeWidth="1"
            strokeDasharray="2 3"
            clipPath="url(#service-life-sweep)"
            style={fade}
          />
        ))}
        <text x={bx + 8} y={by + 74} className="font-mono" fontSize="9" letterSpacing="1.6" fill={tone(2)} style={fade}>
          SHARED BY OTHER PRODUCTS
        </text>
      </g>

      {/* The life itself. */}
      <path d={MAIN} fill="none" stroke="#f5f5f0" strokeWidth="1.5" clipPath="url(#service-life-sweep)" />
      <motion.circle r="3.5" fill="#f5f5f0" cx={headX} cy={headY} />

      {/* 04 Data: at the end of the life the way out is still open. */}
      <g style={{ ...fade, opacity: on(3) }}>
        <path d={`M${ex + 4},${ey} h16 m-5,-5 l5,5 l-5,5`} fill="none" stroke={tone(3)} strokeWidth="1.2" style={fade} />
        <text x={ex + 20} y={ey - 14} textAnchor="end" className="font-mono" fontSize="9" letterSpacing="1.6" fill={tone(3)} style={fade}>
          EXIT PATH OPEN
        </text>
      </g>
    </svg>
  );
}
