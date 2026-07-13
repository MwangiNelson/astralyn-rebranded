# Astralyn Group — Website

A digital brand experience. Not a website. **Powered by Astralyn.**

## Quick start

```bash
cd site
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion 12 · React Three Fiber + Drei · Lenis smooth scrolling · TypeScript.

## Routes

| Route | Experience |
|---|---|
| `/` | Hero Power Core (R3F, scroll-driven activation) + transformation chapters |
| `/manifesto` | Cinematic belief rooms, massive editorial type |
| `/capabilities` | Strategy / Design / Technology expanding pillars |
| `/products` | Launch-style product chapters (Meridian, Axiom Rail, Obsidian) |
| `/work` | Case studies: Challenge → Strategy → Design → Technology → Outcome |
| `/lab` | Research index with mono status tags |
| `/founders` | Monolith experience — hover fractures, click enters their world |
| `/partners` | Quiet engineered advisor register |
| `/start` | Multi-step intake — "Signal received." |
| `/contact` | Near-empty room. "Speak with Astralyn." |

## Design system

Tokens live in `app/globals.css` (Tailwind v4 `@theme`):

- Colors: `midnight`, `graphite`, `gunmetal`, `steel`, `chrome`, `silver`, `white`. Accent = light itself (white glow), never color.
- Utilities: `.display`, `.label`, `.text-chrome-sheen`, `.hairline`, `.glass`, `.glow`, `.btn-core`, `.btn-solid`, `.card-lit`, `.grain`.
- Motion: easing `[0.22, 1, 0.36, 1]` everywhere. No bounce. Weight and momentum.
- Shared components: `Reveal`, `RevealWords`, `DrawnLine` (`components/motion/Reveal.tsx`), `CardLit`, `PowerCore` (R3F, `activation` 0→1).

## Content

Founders, products, work, and advisors are placeholder content written in brand voice — swap in real names and engagements in each page's data arrays (top of the page files).

## Next iterations

- AI-generated cinematic video loops as section transitions (Veo / Runway / Luma) — drop into scroll sections, `<video>` with `preload="metadata"` + lazy load.
- Founder Experience deepening: camera-entry 3D scene per founder.
- Reduced-motion audit (`prefers-reduced-motion` already respected globally in CSS).
- Lighthouse pass once real media lands.
