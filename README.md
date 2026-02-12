# Type Scaling

A web tool that generates Design System type scales optimized for vertical rhythm. Pick any Google Font, and the tool computes heading and body sizes that snap to an 8pt baseline grid — adjusting automatically for each font's x-height and optical characteristics.

**Live demo:** https://olivier-guerin-o7.github.io/type-scaling/

## What it does

- **Font-aware scaling** — The engine reads each font's metrics (x-height ratio, units-per-em) and compensates so that a high-x-height font like Inter and a compact one like Playfair Display produce visually balanced scales at the same nominal sizes.
- **8pt grid snapping** — Every font size and line height is rounded to multiples of 8, enforcing vertical rhythm across the full scale (H1 through small text).
- **50 curated Google Fonts** — A subset of sans-serif and serif typefaces selected for interface design in SaaS products.
- **Live preview** — Glyph carousel, alphabet, numbers, and font metadata (weights, languages, designer, year).
- **Code export** — Copy or download the generated scale as CSS custom properties, Tailwind config, or raw JSON.
- **Shareable URL** — All state (font, theme, scale) is serialized into the URL. Copy it and anyone sees the same result.
- **Dark mode** — Full light/dark theme support.
- **Responsive** — 3-column desktop layout, slide-over panel on tablets, swipeable panels on mobile.

## Tech stack

- **Vite** + **Vanilla JS** (ES modules) — no framework, no build-time CSS processing
- **Custom CSS** with cascade layers (`@layer reset, tokens, base, layout, components`)
- **@capsizecss/metrics** — font metric data (x-height, units-per-em) used by the scaling engine
- **Google Fonts API** — fonts loaded on demand at runtime

## Project structure

```
src/
  engine/           Pure functions: scale generation, grid snapping, optical adjustment
  components/       UI: font selector, preview, type scale display, code output
  data/             Curated font directory (fonts.json) and metric loader
  styles/           CSS: tokens, layout (3-col grid), component styles
  utils/            Font loading, export formats, URL state, clipboard
```

## How it was built

This project was built iteratively through a designer-engineer conversation using Claude Code. Two files in the repo document the process:

- **[PLAN.md](PLAN.md)** — The initial implementation plan: 6 phases covering architecture, data enrichment, and UI structure.
- **[Feedback.md](Feedback.md)** — A real-time log of every design decision and refinement, from the first layout pass to final pixel adjustments. The plan set the direction; the feedback loop shaped the result.

## Run locally

```bash
npm install
npm run dev
```

## License

The tool itself has no license file (personal project). All Google Fonts used are open-source (SIL Open Font License or Apache 2.0) and loaded from Google's CDN at runtime.
