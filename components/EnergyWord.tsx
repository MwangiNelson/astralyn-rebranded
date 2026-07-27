"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EnergyWord — masks a word of display type with living energy.
 * A WebGL canvas renders fire → plasma → lightning procedurally and crossfades
 * between them on a cycle; the canvas sits over the white glyphs with
 * mix-blend-mode: darken, so the energy shows only inside the letterforms
 * while the near-black hero behind stays untouched.
 *
 * Falls back to a static energy gradient (background-clip: text) when WebGL
 * is unavailable or the user prefers reduced motion.
 */

const CYCLE = 7; // seconds per mode
const FADE = 1.4; // seconds of crossfade between modes
const MAX_DPR = 1.5;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uW; // fire / plasma / lightning weights

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(11.3, 7.7); a *= 0.5; }
  return v;
}

vec3 fire(vec2 uv, float t) {
  vec2 p = vec2(uv.x * 4.0, uv.y * 1.6 - t * 1.2);
  float q = fbm(p + vec2(0.0, -t * 0.6));
  float n = fbm(p * 1.5 + q * 2.2 + vec2(t * 0.3, 0.0));
  float v = clamp(n * 1.55 - uv.y * 0.22, 0.0, 1.0);
  vec3 c = vec3(
    smoothstep(0.02, 0.52, v) * 1.25,
    smoothstep(0.24, 0.78, v) * 0.85,
    smoothstep(0.56, 0.98, v) * 0.45);
  return c + vec3(0.30, 0.07, 0.02); // ember floor keeps the glyphs readable
}

vec3 plasma(vec2 uv, float t) {
  vec2 p = uv * vec2(uRes.x / max(uRes.y, 1.0), 1.0) * 1.4;
  float n = fbm(p * 1.6 + vec2(t * 0.35, -t * 0.22));
  float v = sin(p.x * 2.4 + t * 0.9) + sin(p.y * 3.1 - t * 0.7)
          + sin((p.x + p.y) * 1.7 + t * 0.5) + n * 3.4;
  vec3 c = 0.55 + 0.45 * cos(v * 1.35 + vec3(0.2, 2.2, 4.4));
  c *= vec3(0.95, 0.55, 1.15); // grade toward magenta / violet
  return c + vec3(0.16, 0.05, 0.24);
}

vec3 bolt(vec2 uv, float t, float seed) {
  float seg = floor(t * 3.1 + seed * 9.7);
  float y0 = 0.5 + (hash(vec2(seg, seed)) - 0.5) * 0.55;
  float wob = (fbm(vec2(uv.x * 5.5 + seg * 13.1, seed * 31.7)) - 0.5) * 0.6;
  float d = abs(uv.y - (y0 + wob));
  float flick = 0.55 + 0.45 * sin(t * 26.0 + seed * 40.0 + sin(t * 7.0));
  return vec3(0.55, 0.7, 1.0) * (0.0022 / (d * d + 0.0018)) * flick * 0.55;
}

vec3 lightning(vec2 uv, float t) {
  vec3 c = vec3(0.10, 0.16, 0.40);
  c += vec3(0.26, 0.38, 0.80) * fbm(uv * 3.0 + vec2(t * 0.5, -t * 0.3)); // charged haze
  c += bolt(uv, t, 0.37);
  c += bolt(uv * vec2(1.0, 1.0) + vec2(0.31, 0.0), t * 1.18 + 3.7, 0.71);
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 col = vec3(0.0);
  if (uW.x > 0.001) col += uW.x * fire(uv, uTime);
  if (uW.y > 0.001) col += uW.y * plasma(uv, uTime);
  if (uW.z > 0.001) col += uW.z * lightning(uv, uTime);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Crossfade weights for the three modes at time t, wrapping fire→plasma→lightning→fire. */
function weights(t: number): [number, number, number] {
  const pos = (t / CYCLE) % 3;
  const fr = FADE / CYCLE;
  const w = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    let d = Math.abs(pos - (k + 0.5));
    d = Math.min(d, 3 - d);
    w[k] = Math.min(1, Math.max(0, (0.5 + fr / 2 - d) / fr));
  }
  const s = w[0] + w[1] + w[2];
  return [w[0] / s, w[1] / s, w[2] / s];
}

export default function EnergyWord({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFallback(true);
      return;
    }
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFallback(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFallback(true);
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }
    gl.useProgram(prog);

    // One oversized triangle covers the whole canvas.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uW = gl.getUniformLocation(prog, "uW");

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const [wf, wp, wl] = weights(t);
      gl.uniform1f(uTime, t);
      gl.uniform3f(uW, wf, wp, wl);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (fallback) {
    return <span className={`energy-word-fallback ${className}`}>{children}</span>;
  }

  return (
    <span className={`energy-word ${className}`}>
      <span className="energy-word-text">{children}</span>
      <canvas ref={canvasRef} aria-hidden />
    </span>
  );
}
