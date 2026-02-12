# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A standalone web tool that generates Design System type scales optimized for vertical rhythm (8pt grid).

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

- **Vite** + **Vanilla JS** (ES modules), no framework
- **@capsizecss/metrics** — font metrics for all Google Fonts (dynamic import by slug)
- 3-column layout: left (font selector/preview), center (type scale), right (code output)
- All state in a simple store object, serialized to URL search params

## Key files

- `src/engine/` — Pure functions: type scale generation, grid snapping, body size adjustment
- `src/components/` — UI components (font-selector, type-scale-display, code-output, etc.)
- `src/data/fonts.json` — Curated 50-font directory (30 sans-serif, 20 serif)
- `src/utils/` — Font loading, export formats (CSS/Tailwind/JSON), URL state, clipboard
