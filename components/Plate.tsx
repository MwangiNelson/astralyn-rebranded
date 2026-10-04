"use client";

import { ReactNode } from "react";
import CardLit from "@/components/CardLit";
import Field, { FieldVariant } from "@/components/Field";

/**
 * Plate — a framed generative artifact.
 *
 * Everywhere this site used to drop a stock gradient image, it now mounts an
 * instrument: a seeded Field under a chrome edge, with corner ticks and an
 * optional readout. Composed rather than styled with pseudo-elements because
 * CardLit already owns ::before on the same node for the cursor light.
 */
export default function Plate({
  variant,
  seed,
  className = "",
  label,
  readout,
  image,
  children,
}: {
  variant: FieldVariant;
  seed?: number;
  className?: string;
  /** A real screenshot. Replaces the Field once a product has something to show. */
  image?: string;
  /** Small mono caption, bottom-left. */
  label?: string;
  /** Right-aligned technical readout, e.g. a chapter index. */
  readout?: string;
  children?: ReactNode;
}) {
  return (
    <CardLit className={`img-frame img-frame--plate group ${className}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          loading="lazy"
          className="plate-shot absolute inset-0 object-top"
        />
      ) : (
        <Field variant={variant} seed={seed} />
      )}

      <span className="plate-tick top-2.5 left-2.5 border-t border-l" />
      <span className="plate-tick top-2.5 right-2.5 border-t border-r" />
      <span className="plate-tick bottom-2.5 left-2.5 border-b border-l" />
      <span className="plate-tick right-2.5 bottom-2.5 border-r border-b" />

      {(label || readout) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-4 px-5 pb-4">
          {label && (
            <p className="font-mono text-[0.6rem] tracking-[0.3em] text-white/75 uppercase">
              {label}
            </p>
          )}
          {readout && (
            /* Two mono lines will not share a phone-width plate without
               colliding; the readout is the expendable one. */
            <p className="hidden font-mono text-[0.6rem] tracking-[0.24em] text-white/45 tabular-nums uppercase sm:block">
              {readout}
            </p>
          )}
        </div>
      )}

      {children}
    </CardLit>
  );
}
