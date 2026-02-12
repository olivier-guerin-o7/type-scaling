const SUN_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const MOON_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

/**
 * Dark/Light theme toggle as a tertiary button with label.
 */
export function createThemeToggle(container, { getTheme, onToggle }) {
  function render() {
    const isDark = getTheme() === 'dark';
    container.innerHTML = `
      <button class="btn btn--tertiary" aria-label="Toggle theme" data-theme-toggle>
        ${isDark ? SUN_ICON : MOON_ICON}
        ${isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      </button>
    `;
  }

  render();

  container.addEventListener('click', (e) => {
    if (!e.target.closest('[data-theme-toggle]')) return;
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    onToggle(next);
    render();
  });

  return {
    update() {
      render();
    },
  };
}
