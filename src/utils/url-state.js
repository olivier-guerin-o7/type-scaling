const PARAM_MAP = {
  font: 'font',
  theme: 'theme',
  sampleText: 'text',
  codeTab: 'tab',
};

/**
 * Read state from URL search params.
 * @returns {object} partial state
 */
export function readURLState() {
  const params = new URLSearchParams(window.location.search);
  const state = {};

  if (params.has(PARAM_MAP.font)) state.font = params.get(PARAM_MAP.font);
  if (params.has(PARAM_MAP.theme)) state.theme = params.get(PARAM_MAP.theme);
  if (params.has(PARAM_MAP.sampleText)) state.sampleText = params.get(PARAM_MAP.sampleText);
  if (params.has(PARAM_MAP.codeTab)) state.codeTab = params.get(PARAM_MAP.codeTab);

  return state;
}

/**
 * Write state to URL search params (replaces history entry).
 * @param {object} state
 */
export function writeURLState(state) {
  const params = new URLSearchParams();

  if (state.font && state.font !== 'Inter') params.set(PARAM_MAP.font, state.font);
  if (state.theme && state.theme !== 'light') params.set(PARAM_MAP.theme, state.theme);
  if (state.sampleText && state.sampleText !== 'Aa Bb Cc') params.set(PARAM_MAP.sampleText, state.sampleText);
  if (state.codeTab && state.codeTab !== 'css') params.set(PARAM_MAP.codeTab, state.codeTab);

  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}
