import { snapLineHeight } from './grid-snap.js';
import { adjustBodySize, getXHeightRatio, REFERENCE_X_RATIO } from './font-adjust.js';

/**
 * Token definitions in order from largest to smallest.
 * Each token has a semantic HTML mapping and a scale step
 * relative to the body size (step 0).
 */
const TOKEN_DEFS = [
  { token: 'display',   html: '—',     step: 7 },
  { token: 'title-lg',  html: 'H1',    step: 5 },
  { token: 'title-md',  html: 'H2',    step: 4 },
  { token: 'title-sm',  html: 'H3',    step: 3 },
  { token: 'title-xs',  html: 'H4',    step: 2 },
  { token: 'label-lg',  html: 'H5',    step: 1 },
  { token: 'label-md',  html: 'H6',    step: 0.5 },
  { token: 'body',      html: 'p',     step: 0 },
  { token: 'body-sm',   html: 'small', step: -1 },
  { token: 'caption',   html: '—',     step: -2 },
  { token: 'overline',  html: '—',     step: -3 },
];

/**
 * Generate a complete type scale for a given font's metrics.
 *
 * @param {object} metrics - Capsize font metrics
 * @param {object} [options]
 * @param {number} [options.ratio=1.2] - Modular scale ratio (minor third)
 * @returns {{ tokens: Array, meta: object }}
 */
export function generateScale(metrics, options = {}) {
  const ratio = options.ratio || 1.2;
  const bodySize = adjustBodySize(metrics);
  const bodyLineHeight = 24; // anchor

  const tokens = TOKEN_DEFS.map(({ token, html, step }) => {
    let fontSize;

    if (step === 0) {
      fontSize = bodySize;
    } else if (step === 0.5) {
      // label-md: halfway between body and label-lg
      const labelLgSize = Math.round(bodySize * Math.pow(ratio, 1));
      fontSize = Math.round((bodySize + labelLgSize) / 2);
    } else {
      fontSize = Math.round(bodySize * Math.pow(ratio, step));
    }

    // Ensure minimum size
    fontSize = Math.max(11, fontSize);

    let lineHeight;
    if (token === 'body') {
      lineHeight = bodyLineHeight;
    } else {
      // Compute ideal line-height and snap to grid
      const idealRatio = fontSize > 32 ? 1.15 : fontSize > 20 ? 1.3 : 1.5;
      const idealLH = fontSize * idealRatio;
      lineHeight = snapLineHeight(idealLH, fontSize);
    }

    return { token, html, fontSize, lineHeight };
  });

  // Validate: no sudden jumps (ratio between consecutive line-heights ≤ 1.5)
  for (let i = 0; i < tokens.length - 1; i++) {
    const lhRatio = tokens[i].lineHeight / tokens[i + 1].lineHeight;
    if (lhRatio > 1.5) {
      // Adjust the larger one down
      tokens[i].lineHeight = snapLineHeight(
        tokens[i + 1].lineHeight * 1.4,
        tokens[i].fontSize
      );
    }
  }

  const xRatio = getXHeightRatio(metrics);
  const xPercent = xRatio ? Math.round(xRatio * 100) : null;

  // Build grid snap summary
  const nonEightSnapped = tokens.filter(t => t.lineHeight % 8 !== 0);
  let gridNote = 'All line-heights snap to 8pt grid.';
  if (nonEightSnapped.length > 0) {
    const names = nonEightSnapped.map(t => t.token).join(', ');
    gridNote = `All line-heights snap to 8pt grid except ${names} (4pt grid).`;
  }

  const meta = {
    fontFamily: metrics.familyName || 'Unknown',
    bodySize,
    ratio,
    xPercent,
    adjustedFrom16: bodySize !== 16,
    summary: buildSummary(metrics, bodySize, ratio, gridNote),
  };

  return { tokens, meta };
}

function buildSummary(metrics, bodySize, ratio, gridNote) {
  const name = metrics.familyName || 'This font';
  const xRatio = getXHeightRatio(metrics);
  const xPercent = xRatio ? Math.round(xRatio * 100) : null;

  let xDesc = '';
  if (xPercent !== null) {
    const refPercent = Math.round(REFERENCE_X_RATIO * 100);
    if (xPercent > refPercent + 2) {
      xDesc = `has a large x-height (${xPercent}% of em)`;
    } else if (xPercent < refPercent - 2) {
      xDesc = `has a small x-height (${xPercent}% of em)`;
    } else {
      xDesc = `has a moderate x-height (${xPercent}% of em)`;
    }
  }

  let sizeNote = '';
  if (bodySize === 16) {
    sizeNote = 'so body stays at 16px';
  } else if (bodySize > 16) {
    sizeNote = `so body is bumped to ${bodySize}px for optical balance`;
  } else {
    sizeNote = `so body is reduced to ${bodySize}px for optical balance`;
  }

  return `${name} ${xDesc}, ${sizeNote}. Scale uses ${ratio} ratio. ${gridNote}`;
}

export { TOKEN_DEFS };
