# Implementation Plan — ds-type-scale

> This was the initial plan created before building the project iteratively. It captures the starting intent — the actual result evolved significantly through real-time feedback and design refinement.

## Context
First round of UI feedback on ds-type-scale. The changes cover: removing the compare feature, header tweaks, left/right panel scroll restructuring, combobox improvements, preview enhancements, and a new font "Details" section. All changes are in the existing Vite + Vanilla JS app.

---

## Phase 1: Remove compare feature

**Files:**
- Delete `src/components/comparison.js`
- `index.html` — remove `<div id="comparison-slot"></div>` from header
- `src/main.js` — remove import, state fields (`compareFont`, `compareMode`), `createComparisonToggle` call, and `$comparisonSlot` ref
- `src/utils/url-state.js` — remove `compareFont`/`compareMode` from PARAM_MAP, readURLState, writeURLState
- `src/styles/components.css` — remove `.comparison-toggle*` styles (~45 lines)

## Phase 2: Header — dark mode label

**File:** `src/components/theme-toggle.js`
- Change label from `"Dark mode"` → `"Switch to Dark mode"`, `"Light mode"` → `"Switch to Light mode"`

## Phase 3: Left panel — restructure scroll zones

### 3a. Layout restructure

**File:** `index.html` — split `panel-left__content` into 3 zones:
```
.panel-left
  .panel-left__header  → font-selector-slot (tabs + combobox + helper) — FIXED
  .panel-left__body    → font-preview-slot — SCROLLABLE
  .panel-left__footer  → actions-slot — FIXED (already exists)
```

**File:** `src/styles/layout.css` — add styles:
- `.panel-left__header` → `flex-shrink: 0;` with padding, no overflow
- `.panel-left__body` → `flex: 1; overflow-y: auto;` with padding
- Remove/rename `.panel-left__content`

### 3b. Combobox improvements

**File:** `src/components/font-selector.js`:
- Change label text: `"Choose a font"` → `"Search and select a font"`
- Remove search icon from label (it's now a plain text label)
- Add help button (icon `?`) after the label → triggers a modal
- Clear button: already has `hidden` attribute, but ensure it only shows when `query` is non-empty

**File:** `src/styles/components.css`:
- `.combobox__input` border: increase contrast by using `var(--color-border-strong)` or a darker fallback
- Add `.help-btn` styles (small round icon button)
- Add `.modal` / `.modal-overlay` styles for the help modal

**Modal content** (triggered by help button):
> Google Fonts is a library of 1,500+ open-source font families. For this tool, a curated subset of 50 fonts has been selected — focusing on typefaces well-suited for interface design in SaaS products.

### 3c. Font name on initial load

**File:** `src/components/font-selector.js`:
- In `setSelected()`, the font name display already works. The issue is that on initial load, `updateFontName` isn't called before the first `selectFont`.
- Need to verify if the `.font-name[data-font-name]` element has `hidden` by default and fix initial render.

## Phase 4: Preview improvements

### 4a. Default glyph

**File:** `src/components/font-preview.js`:
- Change `GLYPH_PAIRS` to start with `'Aa'` as the default preview

### 4b. Arrow buttons — increase size

**File:** `src/styles/components.css`:
- `.font-preview__nav` → increase from `width/height: 32px` to `36px`
- SVG inside: increase from `width/height: 20px` to `24px`

### 4c. Remove "How it works"

**Files:**
- Delete `src/components/metrics-info.js`
- `index.html` — remove `<div id="metrics-slot"></div>`
- `src/main.js` — remove import, `$metricsSlot`, `createMetricsInfo`, and `metricsInfo.update()` call
- `src/styles/components.css` — remove `.metrics-info*` styles

### 4d. Add "Details" section

**File:** `src/components/font-preview.js`:
- After the Numbers specimen, add a "Details" section displaying: Languages (subsets), Weights, Designer, Year
- Data comes from `fonts.json` (enriched — see Phase 6)

**File:** `src/data/fonts.json`:
- Enrich each font entry with: `subsets` (array of strings), `weights` (number), `designer` (string), `year` (number or null)

**File:** `src/styles/components.css`:
- Add `.font-preview__details` styles (similar to specimen section, using key-value pairs)

### 4e. Wire details to preview

**File:** `src/components/font-preview.js`:
- `update(fontFamily, metrics)` needs access to the font object from fonts.json for details
- Simplest: import fonts.json and look up by `fontFamily` name

## Phase 5: Right panel restructure

### 5a. New layout

**File:** `src/components/code-output.js`:
- Header: tabs only (remove copy button and close button from header)
- Body: scrollable code (unchanged)
- Footer: Copy (primary) + Download X (secondary) side by side

### 5b. Collapse/expand instead of close

**File:** `src/components/code-output.js`:
- Replace close button with a collapse/expand toggle (chevron icon)
- On desktop: collapses the right panel (center panel expands)
- On medium: closes the overlay

**File:** `src/main.js`:
- Add collapse/expand logic: toggle a class on `.panel-right` and update grid template

**File:** `src/styles/layout.css`:
- `.panel-right.is-collapsed` → `width: 0` with transition
- When collapsed, `.app-main` grid changes to `320px 1fr`

### 5c. Footer actions layout

**File:** `src/components/code-output.js` — footer becomes:
```html
<div class="panel-right__footer">
  <button class="btn btn--primary">Copy</button>
  <button class="btn btn--secondary">Download CSS</button>
</div>
```

## Phase 6: Enrich fonts.json

**File:** `src/data/fonts.json`
- Add to each of the 50 font entries: `designer`, `subsets`, `weights`, `year`
- Data sourced from Google Fonts metadata

---

## Implementation order

1. Phase 1 (remove compare) — clean deletion, low risk
2. Phase 6 (enrich fonts.json) — data prerequisite for Phase 4d
3. Phase 2 (header label) — trivial
4. Phase 3 (left panel restructure + combobox + modal)
5. Phase 4 (preview: glyph, arrows, remove metrics, add details)
6. Phase 5 (right panel restructure)

## Verification

After each phase:
- `npm run dev` and verify in browser
- Check desktop (3-col), medium (overlay), mobile (scroll) layouts
- Confirm URL state still works (no compare params polluting)
- Test font selection flow end-to-end
- Verify dark mode toggle works with new label
- Test combobox search, clear button, help modal
- Verify Details section populates for different fonts
- Test right panel collapse/expand on desktop
- Test copy and download buttons in new footer position
