import { generateScale } from './engine/type-scale.js';
import { loadGoogleFont, loadFontMetrics } from './utils/font-loader.js';
import { readURLState, writeURLState } from './utils/url-state.js';
import { copyToClipboard } from './utils/clipboard.js';
import { createFontSelector } from './components/font-selector.js';
import { createFontPreview } from './components/font-preview.js';
import { createTypeScaleDisplay } from './components/type-scale-display.js';
import { createCodeOutput } from './components/code-output.js';
import { createThemeToggle } from './components/theme-toggle.js';
import fonts from './data/fonts.json';

// ─── State ───
const state = {
  font: 'Inter',
  theme: 'light',
  sampleText: 'Aa Bb Cc',
  tokens: [],
  metrics: null,
  loading: false,
};

// Track which Google Fonts have been loaded
const loadedGoogleFonts = new Set();

// ─── DOM refs ───
const $fontSelectorSlot = document.getElementById('font-selector-slot');
const $fontPreviewSlot = document.getElementById('font-preview-slot');
const $scaleSlot = document.getElementById('scale-slot');
const $codeSlot = document.getElementById('code-slot');
const $downloadSlot = document.getElementById('download-slot');
const $themeSlot = document.getElementById('theme-toggle-slot');
const $copyUrlBtn = document.getElementById('copy-url-btn');
const $panelRight = document.querySelector('.panel-right');
const $viewCodeBtn = document.querySelector('.view-code-btn');
const $backdrop = document.querySelector('.panel-overlay-backdrop');
const $loadingOverlay = document.querySelector('.loading-overlay');
const $fontMetaSlot = document.getElementById('font-meta-slot');

// ─── Components ───
const fontSelector = createFontSelector($fontSelectorSlot, {
  onSelect: (font) => selectFont(font),
  getLoadedFonts: () => loadedGoogleFonts,
});

const fontPreview = createFontPreview($fontPreviewSlot);

const typeScaleDisplay = createTypeScaleDisplay($scaleSlot, {
  getSampleText: () => state.sampleText,
  onSampleTextChange: (text) => {
    state.sampleText = text;
    writeURLState(state);
  },
});

const codeOutput = createCodeOutput($codeSlot, $downloadSlot);

const themeToggle = createThemeToggle($themeSlot, {
  getTheme: () => state.theme,
  onToggle: (theme) => {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    writeURLState(state);
  },
});

// ─── Copy URL (header) ───
const $copyUrlFeedback = document.getElementById('copy-url-feedback');
let copyUrlTimeout;
$copyUrlBtn?.addEventListener('click', async () => {
  writeURLState(state);
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = window.location.href;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  if ($copyUrlFeedback) {
    $copyUrlFeedback.textContent = 'Link copied!';
    $copyUrlFeedback.classList.add('is-visible');
    clearTimeout(copyUrlTimeout);
    copyUrlTimeout = setTimeout(() => {
      $copyUrlFeedback.classList.remove('is-visible');
    }, 2000);
  }
});

// ─── Font meta footer (designer + year) ───
function updateFontMeta(font) {
  if (!$fontMetaSlot) return;
  const designer = font.designer || '';
  const year = font.year || '';
  $fontMetaSlot.innerHTML = `
    <span class="font-meta__designer">${designer}</span>
    <span class="font-meta__year">${year}</span>
  `;
}

// ─── Core logic ───
async function selectFont(font) {
  state.font = font.name;
  state.loading = true;
  setLoading(true);

  // Show font name immediately (before async font loading)
  fontSelector.setSelected(font.name);

  try {
    const [, metrics] = await Promise.all([
      loadGoogleFont(font.googleId).then(() => loadedGoogleFonts.add(font.googleId)),
      loadFontMetrics(font.slug),
    ]);

    state.metrics = metrics;
    const result = generateScale(metrics);
    state.tokens = result.tokens;
    fontPreview.update(font.name, metrics);
    updateFontMeta(font);
    typeScaleDisplay.update(result.tokens, font.name, metrics);
    codeOutput.update(result.tokens);

    writeURLState(state);
  } catch (err) {
    console.error('Failed to load font:', err);
  } finally {
    state.loading = false;
    setLoading(false);
  }
}

function setLoading(isLoading) {
  $loadingOverlay?.classList.toggle('is-loading', isLoading);
}

// ─── Right panel: slide-in (medium) + collapse/expand (desktop) ───
const $appMain = document.querySelector('.app-main');
const $toggleBtn = codeOutput.getToggleBtn();

function openCodePanel() {
  $panelRight?.classList.add('is-open');
  $backdrop?.classList.add('is-visible');
}

function closeCodePanel() {
  $panelRight?.classList.remove('is-open');
  $backdrop?.classList.remove('is-visible');
}

function toggleCollapsePanel() {
  const isCollapsed = $panelRight?.classList.toggle('is-collapsed');
  $appMain?.classList.toggle('panel-right-collapsed', isCollapsed);
  if ($toggleBtn) {
    $toggleBtn.setAttribute('aria-label', isCollapsed ? 'Expand panel' : 'Collapse panel');
  }
}

// Toggle button: collapse on desktop, close overlay on medium
$toggleBtn?.addEventListener('click', () => {
  const isMedium = window.matchMedia('(min-width: 768px) and (max-width: 1279px)').matches;
  if (isMedium) {
    closeCodePanel();
  } else {
    toggleCollapsePanel();
  }
});

// Expand button: reopen collapsed panel on desktop
const $expandBtn = document.querySelector('[data-expand-panel]');
$expandBtn?.addEventListener('click', () => {
  toggleCollapsePanel();
});

$viewCodeBtn?.addEventListener('click', openCodePanel);
$backdrop?.addEventListener('click', closeCodePanel);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $panelRight?.classList.contains('is-open')) {
    closeCodePanel();
  }
});

// ─── Mobile nav ───
const mobileNavTabs = document.querySelectorAll('.mobile-nav__tab');

mobileNavTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.panel;
    const panel = document.querySelector(`.${target}`);
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', inline: 'start' });
      mobileNavTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
    }
  });
});

// ─── Preload curated fonts for dropdown preview ───
async function preloadCuratedFonts() {
  const batchSize = 5;
  for (let i = 0; i < fonts.length; i += batchSize) {
    const batch = fonts.slice(i, i + batchSize);
    await Promise.all(
      batch.map(f =>
        loadGoogleFont(f.googleId)
          .then(() => loadedGoogleFonts.add(f.googleId))
          .catch(() => {})
      )
    );
  }
}

// ─── Init ───
async function init() {
  const urlState = readURLState();
  Object.assign(state, urlState);

  document.documentElement.setAttribute('data-theme', state.theme);
  themeToggle.update();

  const initialFont = fonts.find(f => f.name === state.font) || fonts[0];
  await selectFont(initialFont);

  preloadCuratedFonts();
}

init();
