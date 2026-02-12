/**
 * Snap a value to the nearest multiple of `preferredMultiple` (default 8).
 * Falls back to `fallback` (default 4) when the preferred snap would
 * produce a line-height / font-size ratio outside the acceptable range.
 */
export function snapToGrid(value, preferredMultiple = 8, fallback = 4) {
  const snapped8 = Math.round(value / preferredMultiple) * preferredMultiple;
  if (snapped8 === 0) return fallback;
  return snapped8;
}

/**
 * Snap a line-height to the grid, validating that the ratio to fontSize
 * stays within an acceptable range (1.15–1.8).
 * Prefers multiples of 8; falls back to multiples of 4 when 8 produces
 * a ratio that's too tight or too loose.
 */
export function snapLineHeight(rawLineHeight, fontSize) {
  const minRatio = 1.15;
  const maxRatio = 1.8;

  // Try multiples of 8 first
  const snapped8 = snapToGrid(rawLineHeight, 8);
  const ratio8 = snapped8 / fontSize;

  if (ratio8 >= minRatio && ratio8 <= maxRatio) {
    return snapped8;
  }

  // Fall back to multiples of 4
  const snapped4 = snapToGrid(rawLineHeight, 4);
  const ratio4 = snapped4 / fontSize;

  if (ratio4 >= minRatio && ratio4 <= maxRatio) {
    return snapped4;
  }

  // If even 4pt snap is out of range, pick the closest valid value
  const minLH = Math.ceil(fontSize * minRatio);
  const maxLH = Math.floor(fontSize * maxRatio);

  // Try 4-grid values within range
  for (let lh = snapToGrid(minLH, 4); lh <= maxLH; lh += 4) {
    if (lh / fontSize >= minRatio && lh / fontSize <= maxRatio) {
      return lh;
    }
  }

  // Last resort: use raw rounded value
  return Math.round(rawLineHeight);
}
