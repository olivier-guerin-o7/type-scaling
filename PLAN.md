# Architecture Plan — Type Scaling

> This is the foundational plan that guided the initial build of the tool, before any design feedback iterations. It covers the core architecture, the scale engine, the UI structure, and the key decisions made upfront.

---

## Goal

Build a web tool that generates Design System type scales for any Google Font, optimized for vertical rhythm on an 8pt baseline grid. The tool should let a designer pick a font, see the computed scale, and export it as production-ready CSS, Tailwind config, or JSON tokens.

---

## 1. Tech decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | None — Vanilla JS (ES modules) | Minimal footprint, no abstraction tax, full control |
| Bundler | Vite | Fast HMR, native ESM, zero-config for this scope |
| Font metrics | @capsizecss/metrics | Pre-computed x-height and units-per-em for every Google Font |
| Styling | Custom CSS with cascade layers | Full control over token system, no utility-class overhead |
| State | Plain object + URL params | No store library needed — state is small and shareable |

## 2. Engine design

Three pure-function modules with zero side effects, composable and independently testable.

### `type-scale.js` — Scale generation

- Input: font metrics object + optional ratio (default: 1.2, minor third)
- 11 predefined tokens mapping to semantic HTML: `display` (H1) down to `caption` (small)
- Each token has a step offset from body (step 0). Font size = `bodySize * ratio^step`, rounded
- Special case: `label-md` at step 0.5 as midpoint
- Minimum font size enforced at 11px
- Adaptive line-height ratio: tighter for large sizes (1.15), looser for small (1.5)
- Output: `{ tokens: [...], meta: { fontFamily, bodySize, ratio, xHeightPercent, summary } }`

### `grid-snap.js` — Vertical rhythm alignment

- Input: raw line-height + font size
- Strategy: prefer 8px grid, fall back to 4px, last resort raw rounding
- Valid ratio bounds: 1.15–1.8 (prevents extreme stretching or compression)
- Output: snapped line-height value

### `font-adjust.js` — Optical compensation

- Reference: Inter's x-height ratio (1118/2048 ≈ 0.546)
- Formula: `adjusted = round(16 * referenceXRatio / fontXRatio)`
- Clamped to [15, 17] to prevent extreme adjustments
- Purpose: a font with a small x-height (like Playfair) gets a slightly larger base size so it appears optically balanced with Inter at the same nominal size

## 3. Data model

### `fonts.json` — Curated font directory

50 fonts (30 sans-serif, 20 serif) selected for SaaS interface design. Each entry:

```json
{
  "name": "Inter",
  "slug": "inter",
  "category": "sans-serif",
  "googleId": "Inter",
  "designer": "Rasmus Andersson",
  "year": 2016,
  "weights": 9,
  "subsets": ["latin", "latin-ext", "cyrillic", "greek"]
}
```

### `font-metrics.js` — Static metric loader

Pre-imports all 50 font metrics from @capsizecss/metrics at build time. Keyed by slug for O(1) lookup. No runtime network calls for metrics.

## 4. Layout — 3-column responsive grid

```
┌──────────────────────────────────────────────────┐
│  Header: title, subtitle, copy URL, theme toggle │
├────────┬─────────────────────┬───────────────────┤
│  Left  │      Center         │      Right        │
│ 320px  │       1fr           │      360px        │
│        │                     │                   │
│ Font   │   Type scale        │   Code output     │
│ select │   visualization     │   (CSS/TW/JSON)   │
│ +      │   (11 tokens)       │                   │
│ Preview│                     │   Copy + Download  │
├────────┴─────────────────────┴───────────────────┤
```

**Desktop (1280px+):** 3-column CSS grid. Left and right panels have fixed headers/footers with scrollable bodies.

**Tablet (768–1279px):** 2-column. Right panel becomes a slide-in overlay from the right edge, triggered by a floating "View Code" button.

**Mobile (<768px):** Horizontal scroll-snap. Three full-viewport sections side by side. Bottom tab bar for navigation (Font / Scale / Code).

## 5. Component architecture

Factory functions (not classes). Each takes a container element and callbacks, returns a public API object. Components own their DOM and events.

| Component | Responsibility | Public API |
|---|---|---|
| `font-selector` | Category tabs, searchable combobox, font picker | `setSelected(name)` |
| `font-preview` | Glyph carousel, specimen, font details | `update(family, metrics)` |
| `type-scale-display` | Scale table, editable sample text, capability pills | `update(tokens, family, metrics)` |
| `code-output` | Tabbed code view (CSS/TW/JSON), copy, download | `update(tokens)` |
| `theme-toggle` | Light/dark mode switch | `update()` |

**Communication pattern:** Callbacks up, data down. Components never import each other or the main state. `main.js` orchestrates: receives callbacks from components, updates state, pushes new data to all components.

## 6. State and URL serialization

Flat state object:

```js
{ font, theme, sampleText, tokens, metrics, codeTab, loading }
```

URL params store only non-default values (`font`, `theme`, `text`, `tab`). Uses `history.replaceState` — no page reloads, no history pollution. Any URL can be shared to reproduce the exact view.

## 7. CSS architecture

Cascade layers in order of specificity:

```css
@layer reset, tokens, base, layout, components;
```

**Tokens** define the design language: 8pt spacing scale (4px–64px), border radii, shadows, transitions, font stacks. Light and dark themes via `[data-theme]` attribute toggling CSS custom properties.

**No utility classes.** Every component styled with semantic class names in the `components` layer.

## 8. Font loading strategy

1. Load the selected font from Google Fonts CDN (inject `<link>` tag)
2. Deduplicate: track loaded fonts in a Set
3. After initial load, batch-preload all 50 fonts in the background (fire-and-forget)
4. Font metrics are bundled at build time — no network call needed for metrics

## 9. Export formats

| Format | Output |
|---|---|
| CSS | `:root` block with `--type-{token}-size` and `--type-{token}-line-height` custom properties |
| Tailwind | `module.exports` config with `fontSize` theme entries |
| JSON | `{ typography: { token: { fontSize, lineHeight } } }` |

Each format auto-updates when the font changes. Copy to clipboard or download as file.

## 10. Key principles

- **Pure engine, presentation shell** — The scale math is decoupled from the UI. Swap the interface without touching the algorithm.
- **URL as state** — No backend, no database, no localStorage. Share a link, get the same result.
- **8pt grid as constraint** — Every line height snaps to the grid. The tool enforces what designers would do manually.
- **Optical honesty** — The engine compensates for x-height differences between fonts, producing visually balanced scales rather than numerically identical ones.
- **Minimal dependencies** — Vite for dev, Capsize for metrics. Everything else is hand-written.
