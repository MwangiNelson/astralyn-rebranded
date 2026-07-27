"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CLIENTS, type Client } from "@/lib/clients";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * WorkWall — the client grid.
 *
 * The wall is one material. Every mark rests as brushed metal and only returns
 * to its own colour when the visitor engages with it, so the grid reads as a
 * single engineered surface rather than as a pile of borrowed brand colours.
 *
 * Tiles rise on a diagonal stagger — column and row both feed the delay — so
 * the wall assembles as a plane rather than sweeping row by row.
 */

function Tile({ client, index }: { client: Client; index: number }) {
  return (
    <a
      href={client.href}
      target="_blank"
      rel="noopener noreferrer"
      className="client-tile chrome-edge group"
      aria-label={`${client.name} — opens in a new tab`}
    >
      {/* Top rail — index and provenance */}
      <div className="relative z-[4] flex items-start justify-between">
        <span className="font-mono text-[0.6rem] tracking-[0.24em] text-steel tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        {client.inHouse && (
          <span className="font-mono text-[0.52rem] tracking-[0.22em] text-steel uppercase">
            In-House
          </span>
        )}
      </div>

      {/* The mark */}
      <div className="relative z-[4] flex min-h-[4.5rem] items-center py-6">
        {client.logo ? (
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            loading="lazy"
            decoding="async"
            className="client-tile__logo"
          />
        ) : (
          <span className="client-tile__wordmark">{client.name}</span>
        )}
      </div>

      {/* Bottom rail — the four public facts */}
      <div className="relative z-[4]">
        <div className="chrome-rule mb-4" />
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="display truncate text-lg text-white transition-colors duration-700 group-hover:text-chrome">
              {client.name}
            </p>
            <p className="mt-1.5 truncate font-mono text-[0.58rem] tracking-[0.2em] text-steel-2 uppercase">
              {client.sector}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-steel uppercase tabular-nums">
              {client.year ?? client.status}
            </span>
            {/* The arrow leaves the tile on approach — the link is the payoff. */}
            <span
              aria-hidden
              className="inline-block text-sm text-silver transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
            >
              ↗
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function WorkWall({
  columns = 3,
  className = "",
}: {
  /** Used only to compute the diagonal stagger, not to set the grid. */
  columns?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {CLIENTS.map((c, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        return (
          <motion.div
            key={c.name}
            initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{
              duration: 0.7,
              delay: (col + row) * 0.07,
              ease: EASE,
            }}
            className="bg-midnight"
          >
            <Tile client={c} index={i} />
          </motion.div>
        );
      })}
    </div>
  );
}
