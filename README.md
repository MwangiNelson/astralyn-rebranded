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
| `/products` | Launch-style chapters for the suite (Nyumbisha, Relay, Ledger, Concierge, Roster) + Astralyn Core |
| `/work` | The client wall — logo, name, sector, link. Detail stays private by design |
| `/lab` | Research index with mono status tags |
| `/team` | Founders as an elastic strip (click twice for the dossier), then the house roster by discipline. `/founders` redirects here |
| `/start` | Multi-step intake — "Signal received." |
| `/contact` | Near-empty room. "Speak with Astralyn." |

## Fonts — self-hosted, deliberately

`site/fonts/` holds **Clash Display** and **Satoshi** as variable woff2, wired
through `next/font/local` in `app/layout.tsx`. Do not move these back to a CDN.

These previously loaded from `api.fontshare.com`. Fontshare started returning

```
/* Access to the Fontshare API has been temporarily restricted. */
```

to browser requests, which silently dropped all three display faces and
rendered the whole site in a system fallback. Nothing in the CSS had changed,
so it presented as a design regression rather than a dead CDN — the tell was
that mono labels still looked right, because IBM Plex Mono comes from Google.

Two consequences worth keeping:

- **Reference fonts only via the `--font-clash` / `--font-satoshi` variables**,
  never by raw family name. A bare `"Clash Display"` falls through to a system
  font silently; the variable does not exist if the font failed, which fails
  loudly.
- **IBM Plex Mono is still on Google Fonts** — the last external font
  dependency. Self-hosting it is a TODO in `layout.tsx`.

To verify fonts are really loading, check `document.fonts` in the console —
`document.fonts.check()` returns `true` even when it is falling back, so it is
not a valid test.

## Design system

Tokens live in `app/globals.css` (Tailwind v4 `@theme`):

- Base colors: `midnight`, `graphite`, `gunmetal`, `steel`, `chrome`, `silver`, `white`.
- **Accent = chrome, as a material.** The ramp is `chrome-hi → chrome-1 → chrome-mid → chrome-2 → chrome-lo`, exposed as two gradients:
  - `--gradient-chrome-surface` — for surfaces (rules, plates, edges). Free to go dark.
  - `--gradient-chrome-text` — for type. Floor is `#c9c8c2`, so clipped text is never dimmer than body copy. **Use this one for anything readable.**
- Chrome utilities: `.text-chrome-sheen`, `.chrome-rule`, `.chrome-edge`, `.chrome-badge`, `.chrome-plate`, `.stat-num`.
- The hero word POWER is the one place with **real colour** — `<EnergyWord>` renders fire → plasma → lightning in WebGL and masks it to the glyphs via `mix-blend-mode: darken`. Falls back to `.energy-word-fallback` (a static energy gradient) with no WebGL or reduced motion.
- Other utilities: `.display`, `.display-black`, `.label`, `.hairline`, `.glass`, `.glow`, `.btn-core`, `.btn-solid`, `.card-lit`, `.grain`, `.lit-room`, `.section-tex`.
- **No grid backgrounds.** Depth comes from off-axis light (`.lit-room`, `.section-tex`), never from wireframe line-work.
- Motion: easing `[0.22, 1, 0.36, 1]` everywhere. No bounce. Weight and momentum.
- Shared components: `Reveal`, `RevealWords`, `DrawnLine`, `MaskWipe`, `Parallax` (`components/motion/Reveal.tsx`), `CardLit`, `Plate`/`Field`, `WorkWall`, `MetallicPaint`.

### Clipping chrome to text — read this before using it

`background-clip: text` breaks on mobile WebKit if any *descendant* is
transformed: the gradient escapes the glyphs and the words vanish. So chrome
always lands on a **static leaf span**, never on an animated wrapper. That is
why `RevealWords` takes `chrome` / `lit` props instead of letting callers put
the class on the heading.

## Content

Products (`lib/products.ts`), clients (`lib/clients.ts`) and site config
(`lib/site.ts`) are real data — see [`../docs`](../docs) for the strategy and
PRDs behind the product suite. Founders and advisors are still partly
placeholder.

People live in `lib/team.ts`: `FOUNDERS` for the four, `TEAM` for everyone
else — both are real. A member's `kind` picks their discipline group and their
glyph (scales for legal, compass for consultants, lighthouse for advisors); add
a new discipline in `RoleKind` + `ROLE_META`, then wire its icon in
`components/RoleIcon.tsx`. `ROLE_META.order` numbers staff disciplines ahead of
the retained ones so hires always sort above consultants and advisors. Groups
with nobody in them never render, and `socials` is optional.

**Metrics on this site must be defensible.** An invented figure is the one
thing here that can cost a deal.

## Next iterations

- AI-generated cinematic video loops as section transitions (Veo / Runway / Luma) — drop into scroll sections, `<video>` with `preload="metadata"` + lazy load.
- Founder Experience deepening: camera-entry 3D scene per founder.
- Reduced-motion audit (`prefers-reduced-motion` already respected globally in CSS).
- Lighthouse pass once real media lands.
