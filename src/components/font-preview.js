import fonts from '../data/fonts.json';

const GLYPH_PAIRS = ['Aa', 'Gg', 'Qq', 'Rr', '@&', 'àé', 'îö'];

/**
 * Font preview: navigable glyph hero, paragraph, alphabet, details, font capabilities.
 */
export function createFontPreview(container) {
  let currentGlyphIndex = 0;
  let currentFontFamily = 'Inter';

  container.innerHTML = `
    <div class="panel-section">
      <div class="font-preview">
        <div class="font-preview__hero">
          <button class="font-preview__nav font-preview__nav--prev" aria-label="Previous glyph" data-glyph-prev>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="font-preview__glyph" data-glyph-display>${GLYPH_PAIRS[0]}</div>
          <button class="font-preview__nav font-preview__nav--next" aria-label="Next glyph" data-glyph-next>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div class="font-preview__paragraph" data-font-preview-paragraph>
          The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible and appealing.
        </div>

        <div class="font-preview__specimens">
          <div>
            <div class="font-preview__specimen-label">Alphabet</div>
            <div class="font-preview__specimen-row" data-specimen="alpha">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz</div>
          </div>
          <div>
            <div class="font-preview__specimen-label">Numbers</div>
            <div class="font-preview__specimen-row" data-specimen="numbers">0123456789</div>
          </div>
        </div>

        <div class="font-preview__details" data-font-details></div>

      </div>
    </div>
  `;

  const glyphDisplay = container.querySelector('[data-glyph-display]');
  const paragraph = container.querySelector('[data-font-preview-paragraph]');
  const specimens = container.querySelectorAll('.font-preview__specimen-row');
  const details = container.querySelector('[data-font-details]');
  const prevBtn = container.querySelector('[data-glyph-prev]');
  const nextBtn = container.querySelector('[data-glyph-next]');

  function navigateGlyph(direction) {
    currentGlyphIndex = (currentGlyphIndex + direction + GLYPH_PAIRS.length) % GLYPH_PAIRS.length;

    // Slide-out in the navigation direction, then slide-in from opposite side
    const offset = direction > 0 ? -20 : 20;
    glyphDisplay.style.transition = 'transform 120ms ease-out, opacity 120ms ease-out';
    glyphDisplay.style.transform = `translateX(${offset}px)`;
    glyphDisplay.style.opacity = '0';

    setTimeout(() => {
      glyphDisplay.textContent = GLYPH_PAIRS[currentGlyphIndex];
      glyphDisplay.style.transition = 'none';
      glyphDisplay.style.transform = `translateX(${-offset}px)`;
      glyphDisplay.style.opacity = '0';

      requestAnimationFrame(() => {
        glyphDisplay.style.transition = 'transform 120ms ease-out, opacity 120ms ease-out';
        glyphDisplay.style.transform = 'translateX(0)';
        glyphDisplay.style.opacity = '1';
      });
    }, 120);
  }

  prevBtn.addEventListener('click', () => navigateGlyph(-1));
  nextBtn.addEventListener('click', () => navigateGlyph(1));

  function applyFont(fontFamily) {
    const style = `font-family: '${fontFamily}', serif`;
    glyphDisplay.style.cssText = style;
    paragraph.style.cssText = style;
    specimens.forEach(s => s.style.cssText = style);
  }

  function renderDetails(fontFamily) {
    const fontData = fonts.find(f => f.name === fontFamily);
    if (!fontData) {
      details.innerHTML = '';
      return;
    }

    const parts = [];
    if (fontData.weights) parts.push(`${fontData.weights} weights`);
    if (fontData.subsets && fontData.subsets.length > 0) parts.push(`${fontData.subsets.length} languages`);

    if (parts.length) {
      details.innerHTML = `<div class="font-preview__detail-item"><span class="font-preview__detail-label">Variants</span><span class="font-preview__detail-value">${parts.join(' · ')}</span></div>`;
    } else {
      details.innerHTML = '';
    }
  }

  return {
    update(fontFamily, metrics) {
      currentFontFamily = fontFamily;
      applyFont(fontFamily);
      renderDetails(fontFamily);
    },
  };
}
