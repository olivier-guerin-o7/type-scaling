/**
 * Actions panel: just "Open in Google Fonts" as secondary button (left panel).
 * Download button is now in the right panel.
 * Copy URL and Compare are now in the header.
 */
export function createActions(container, { getState }) {
  container.innerHTML = `
    <div class="actions">
      <button class="btn btn--secondary btn--full" data-action="google-fonts">
        Open in Google Fonts
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </button>
    </div>
  `;

  container.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]');
    if (!action) return;

    const state = getState();

    if (action.dataset.action === 'google-fonts') {
      const fontName = state.font || 'Inter';
      const urlName = fontName.replace(/ /g, '+');
      window.open(`https://fonts.google.com/specimen/${urlName}`, '_blank');
    }
  });
}
