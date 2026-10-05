# Whamburg website

A one-page site for Whamburg (Windsor, ON) built with Vite, vanilla JS and GSAP ScrollTrigger.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs ./dist
npm run preview   # serves ./dist on http://localhost:4173
```

## How the hero works

- `src/main.js` stacks eight separate transparent SVG ingredient layers (`public/layers/*.svg`).
- **Desktop:** the hero is pinned for ~2.8 screens. One scrubbed GSAP timeline fades the dark
  background to light, pulls the layers apart (centre-out), then reveals the numbered labels.
- **Mobile (<= 768px), short landscape screens and `prefers-reduced-motion`:** no pinning or scrubbing.
  The dark hero shows the assembled burger, followed by a vertical ingredient list that fades in on scroll.
- Layers are regenerated with `node scripts/generate-layers.mjs`.

## Real details vs. placeholders

Verified from whamburg.com pages (via search results; the site itself was blocked from the build
environment): locations, hours, phone number, menu item names/descriptions, delivery areas and
flat delivery fee, catering and food truck details, and all outbound links.

Not available offline, so **not invented**:
- **Prices**: every card links to the real menu/order page instead.
- **Food photos**: the burger and cards use drawn SVG layers. Replace them with photos (below).
- **Brand colours and logo** were taken from a screenshot of the live header (`#fe4646`, `#183d58`);
  `public/logo.png` is that logo cut out onto a transparent background. Swap in the official file when available.

Re-check hours, delivery fee and links against whamburg.com before launch.

## Upgrading realism

Drop in studio photos of each ingredient shot from the side on a plain background, cut out as
transparent PNG/WebP (about 1200px wide, one per layer: top bun, sauce, tomato, lettuce, cheese,
patty, pickles/onion, bottom bun) and point the `file` entries in `L` at them in `src/main.js`.
A short GLB model of the burger would also work with a three.js scene driven by the same timeline.
