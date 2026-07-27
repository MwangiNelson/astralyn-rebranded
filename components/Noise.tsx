"use client";

import { useEffect, useRef } from "react";

type NoiseProps = {
  /** Internal texture size in px — stretched to the viewport, so smaller = chunkier grain. */
  patternSize?: number;
  /** Frames to wait between grain refreshes (2 ≈ 30fps on a 60Hz display). */
  patternRefreshInterval?: number;
  /** Grain opacity, 0–255. */
  patternAlpha?: number;
  /** Pre-generated grain frames cycled at runtime (keeps per-frame cost near zero). */
  frameCount?: number;
  className?: string;
};

/**
 * Live film grain — a canvas of true random static, redrawn continuously so the
 * texture feels alive rather than printed on. Adapted from React Bits <Noise />;
 * frames are pre-generated once and cycled instead of re-randomised per frame.
 */
export default function Noise({
  patternSize = 512,
  patternRefreshInterval = 2,
  patternAlpha = 14,
  frameCount = 10,
  className = "",
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = patternSize;
    canvas.height = patternSize;

    const frames: ImageData[] = [];
    for (let f = 0; f < frameCount; f++) {
      const img = ctx.createImageData(patternSize, patternSize);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = patternAlpha;
      }
      frames.push(img);
    }

    ctx.putImageData(frames[0], 0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let raf = 0;
    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        const idx = Math.floor(frame / patternRefreshInterval) % frameCount;
        ctx.putImageData(frames[idx], 0, 0);
      }
      frame++;
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => window.cancelAnimationFrame(raf);
  }, [patternSize, patternRefreshInterval, patternAlpha, frameCount]);

  return <canvas ref={grainRef} aria-hidden className={`noise-live ${className}`} />;
}
