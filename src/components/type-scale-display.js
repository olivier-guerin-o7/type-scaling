const OPTICAL_FONTS = [
  'Fraunces', 'Literata', 'Newsreader', 'Source Serif 4',
  'Playfair Display', 'Crimson Pro',
];

/**
 * Type scale preview: one row per token, with inline-editable sample text.
 * Also renders font capability tags at the top.
 */
export function createTypeScaleDisplay(container, { getSampleText, onSampleTextChange }) {
  let currentTokens = [];
  let currentFontFamily = 'Inter';
  let currentMetrics = null;

  function buildCapsTags() {
    if (!currentMetrics) return '';
    const caps = [];

    const hasOptical = currentMetrics.familyName && OPTICAL_FONTS.includes(currentMetrics.familyName);
    let xRatio = '';
    if (currentMetrics.xHeight && currentMetrics.unitsPerEm) {
      xRatio = `${Math.round((currentMetrics.xHeight / currentMetrics.unitsPerEm) * 100)}%`;
    }

    return `<div class="font-caps-bar"><button class="font-caps-tag font-caps-tag--btn" data-caps-optical>Optical sizing: ${hasOptical ? 'Yes' : 'No'}</button>${xRatio ? `<button class="font-caps-tag font-caps-tag--btn" data-caps-xheight>x-height: ${xRatio}</button>` : ''}<a class="caps-bar__link" href="#" data-scale-help-btn>Learn more</a></div>`;
  }

  function render() {
    container.innerHTML = `
      <div class="type-scale-header">
        ${buildCapsTags()}
        <button class="btn-outlined" data-edit-scale>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Edit scale
        </button>
      </div>
      <div class="type-scale" data-type-scale>
        <div class="type-scale__legend">
          <span>Token</span>
          <span>HTML</span>
          <span>Sample</span>
          <span>Size / Line</span>
        </div>
        ${currentTokens.map(({ token, html, fontSize, lineHeight }) => `
          <div class="type-scale__row" data-token="${token}">
            <span class="type-scale__token">${token}</span>
            <span class="type-scale__html">${html}</span>
            <span
              class="type-scale__sample"
              style="font-family: '${currentFontFamily}', serif; font-size: ${fontSize}px; line-height: ${lineHeight}px;"
              contenteditable="plaintext-only"
              spellcheck="false"
              data-sample
            >${escapeHTML(getSampleText())}</span>
            <span class="type-scale__meta"><span class="type-scale__meta-tag">${fontSize}</span><span class="type-scale__meta-tag">${lineHeight}</span></span>
          </div>
        `).join('')}
      </div>

      <!-- Scale help modal -->
      <div class="modal-overlay" hidden data-scale-help-modal>
        <div class="modal">
          <div class="modal__header">
            <span class="modal__title">How type scaling works</span>
            <button class="modal__close" data-scale-help-close aria-label="Close">&times;</button>
          </div>
          <div class="modal__body">
            <p>This tool generates a type scale optimized for vertical rhythm on an 8pt baseline grid. Here's the approach:</p>
            <p><strong>1. Font metrics analysis</strong> — Each font's internal metrics (ascender, descender, x-height, units-per-em) are read from Capsize data. These differ significantly between fonts.</p>
            <p><strong>2. Scale generation</strong> — Starting from a base body size (typically 16px), sizes are calculated using a modular ratio. Each step multiplies or divides by this ratio to produce harmonious size relationships.</p>
            <p><strong>3. Grid snapping</strong> — Every line-height is snapped to the nearest multiple of 8px, ensuring all text sits on the baseline grid. This creates consistent vertical spacing throughout an interface.</p>
            <p><strong>4. Optical compensation</strong> — Fonts with high x-heights appear larger at the same pixel size. The algorithm adjusts for this, so the perceived size remains balanced regardless of the font chosen.</p>
          </div>
          <div class="modal__footer">
            <button class="btn btn--primary" data-scale-help-close>Got it, close</button>
          </div>
        </div>
      </div>

      <!-- Optical sizing definition modal -->
      <div class="modal-overlay" hidden data-optical-modal>
        <div class="modal">
          <div class="modal__header">
            <span class="modal__title">Optical sizing</span>
            <button class="modal__close" data-optical-modal-close aria-label="Close">&times;</button>
          </div>
          <div class="modal__body">
            <p>Optical sizing is a font feature that automatically adjusts stroke thickness, contrast, and letterform details based on the rendered size of the text.</p>
            <p>At small sizes, letters become slightly thicker and more open for readability. At large display sizes, finer details and higher contrast are revealed.</p>
            <p>Fonts that support optical sizing produce more polished results across the full type scale — from small captions to large headings — without manual weight adjustments.</p>
          </div>
          <div class="modal__footer">
            <button class="btn btn--primary" data-optical-modal-close>Got it, close</button>
          </div>
        </div>
      </div>

      <!-- x-height definition modal -->
      <div class="modal-overlay" hidden data-xheight-modal>
        <div class="modal">
          <div class="modal__header">
            <span class="modal__title">x-height</span>
            <button class="modal__close" data-xheight-modal-close aria-label="Close">&times;</button>
          </div>
          <div class="modal__body">
            <p>The x-height is the height of lowercase letters (like "x", "a", "e") relative to the font's total em-square. It's expressed here as a percentage of the units-per-em.</p>
            <p>Fonts with a high x-height (above 50%) appear larger and more readable at the same pixel size. Fonts with a lower x-height feel more elegant and compact.</p>
            <p>This metric directly influences the type scale: the algorithm compensates for x-height differences so that the perceived optical size stays balanced across different fonts.</p>
          </div>
          <div class="modal__footer">
            <button class="btn btn--primary" data-xheight-modal-close>Got it, close</button>
          </div>
        </div>
      </div>

    `;

    // Inline editing events — edits propagate to ALL rows
    container.querySelectorAll('[data-sample]').forEach(el => {
      function commitEdit() {
        const text = el.textContent.trim() || 'Aa Bb Cc';
        onSampleTextChange?.(text);
        container.querySelectorAll('[data-sample]').forEach(s => {
          if (s !== el) s.textContent = text;
        });
      }

      el.addEventListener('blur', commitEdit);

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          el.blur();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          el.blur();
        }
      });
    });

    // Scale help modal events
    const scaleHelpBtn = container.querySelector('[data-scale-help-btn]');
    const scaleHelpModal = container.querySelector('[data-scale-help-modal]');
    const scaleHelpCloseButtons = container.querySelectorAll('[data-scale-help-close]');

    if (scaleHelpBtn && scaleHelpModal) {
      scaleHelpBtn.addEventListener('click', (e) => { e.preventDefault(); scaleHelpModal.hidden = false; });
      scaleHelpCloseButtons.forEach(b => b.addEventListener('click', () => { scaleHelpModal.hidden = true; }));
      scaleHelpModal.addEventListener('click', (e) => { if (e.target === scaleHelpModal) scaleHelpModal.hidden = true; });
      scaleHelpModal.addEventListener('keydown', (e) => { if (e.key === 'Escape') scaleHelpModal.hidden = true; });
    }

    // Optical sizing definition modal
    const opticalBtn = container.querySelector('[data-caps-optical]');
    const opticalModal = container.querySelector('[data-optical-modal]');
    const opticalCloseButtons = container.querySelectorAll('[data-optical-modal-close]');

    if (opticalBtn && opticalModal) {
      opticalBtn.addEventListener('click', () => { opticalModal.hidden = false; });
      opticalCloseButtons.forEach(b => b.addEventListener('click', () => { opticalModal.hidden = true; }));
      opticalModal.addEventListener('click', (e) => { if (e.target === opticalModal) opticalModal.hidden = true; });
      opticalModal.addEventListener('keydown', (e) => { if (e.key === 'Escape') opticalModal.hidden = true; });
    }

    // x-height definition modal
    const xheightBtn = container.querySelector('[data-caps-xheight]');
    const xheightModal = container.querySelector('[data-xheight-modal]');
    const xheightCloseButtons = container.querySelectorAll('[data-xheight-modal-close]');

    if (xheightBtn && xheightModal) {
      xheightBtn.addEventListener('click', () => { xheightModal.hidden = false; });
      xheightCloseButtons.forEach(b => b.addEventListener('click', () => { xheightModal.hidden = true; }));
      xheightModal.addEventListener('click', (e) => { if (e.target === xheightModal) xheightModal.hidden = true; });
      xheightModal.addEventListener('keydown', (e) => { if (e.key === 'Escape') xheightModal.hidden = true; });
    }

    // Edit Scale button — shows "coming soon" placeholder
    const editScaleBtn = container.querySelector('[data-edit-scale]');
    const typeScaleEl = container.querySelector('[data-type-scale]');
    const headerEl = container.querySelector('.type-scale-header');

    if (editScaleBtn) {
      editScaleBtn.addEventListener('click', () => {
        headerEl.style.display = 'none';
        typeScaleEl.innerHTML = `
          <div class="coming-soon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p class="coming-soon__text">Coming soon</p>
            <button class="btn btn--primary" data-back-to-scale>Back to my type scale</button>
          </div>
        `;
        container.querySelector('[data-back-to-scale]').addEventListener('click', () => {
          render();
        });
      });
    }
  }

  return {
    update(tokens, fontFamily, metrics) {
      currentTokens = tokens;
      currentFontFamily = fontFamily;
      currentMetrics = metrics || null;
      render();
    },

    updateSampleText(text) {
      container.querySelectorAll('[data-sample]').forEach(el => {
        el.textContent = text;
      });
    },
  };
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
