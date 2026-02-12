// Inter's x-height ratio as the reference baseline
const REFERENCE_X_RATIO = 1118 / 2048; // ≈ 0.546

/**
 * Compute the adjusted body font-size for a given font so that its
 * perceived size matches the reference font (Inter) at 16px.
 *
 * The adjustment is based on the x-height ratio: fonts with a smaller
 * x-height get a slightly larger size, and vice versa.
 *
 * Result is clamped to [15, 17] to keep things reasonable.
 */
export function adjustBodySize(metrics) {
  const { xHeight, unitsPerEm } = metrics;

  if (!xHeight || !unitsPerEm) return 16;

  const fontXRatio = xHeight / unitsPerEm;
  const adjusted = Math.round(16 * REFERENCE_X_RATIO / fontXRatio);

  return Math.max(15, Math.min(17, adjusted));
}

/**
 * Compute the x-height ratio for display/explanation purposes.
 */
export function getXHeightRatio(metrics) {
  if (!metrics.xHeight || !metrics.unitsPerEm) return null;
  return metrics.xHeight / metrics.unitsPerEm;
}

export { REFERENCE_X_RATIO };
