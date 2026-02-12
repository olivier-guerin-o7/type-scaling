import metricsMap from '../data/font-metrics.js';

const loadedFonts = new Set();

/**
 * Load a Google Font by injecting a <link> tag.
 * Deduplicates — each font is loaded only once.
 *
 * @param {string} googleId - e.g. "Inter", "Open+Sans"
 * @returns {Promise<void>} resolves when the font is loaded
 */
export function loadGoogleFont(googleId) {
  if (loadedFonts.has(googleId)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${googleId}:wght@400;700&display=swap`;
    link.onload = () => {
      loadedFonts.add(googleId);
      resolve();
    };
    link.onerror = () => reject(new Error(`Failed to load font: ${googleId}`));
    document.head.appendChild(link);
  });
}

/**
 * Look up pre-loaded Capsize metrics for a font by its camelCase slug.
 * @param {string} slug - e.g. "inter", "openSans"
 * @returns {object} font metrics
 */
export function loadFontMetrics(slug) {
  const metrics = metricsMap[slug];
  if (!metrics) throw new Error(`No metrics found for slug: ${slug}`);
  return metrics;
}
