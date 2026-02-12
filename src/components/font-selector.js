import fonts from '../data/fonts.json';

/**
 * Font selector combobox with search, category filtering,
 * and dropdown showing fonts rendered in their own typeface.
 */
export function createFontSelector(container, { onSelect, getLoadedFonts }) {
  let category = 'all';
  let query = '';
  let highlightedIndex = -1;
  let isOpen = false;
  let filtered = [];
  let selectedFontName = '';

  container.innerHTML = `
    <div class="panel-section">
      <span class="panel-section__title">Font type</span>
      <div class="chip-group" role="radiogroup" aria-label="Font category">
        <button class="chip is-active" data-category="all">All</button>
        <button class="chip" data-category="sans-serif">Sans-serif</button>
        <button class="chip" data-category="serif">Serif</button>
      </div>

      <div class="combobox-label">
        <span>Search and select a font</span>
        <button class="help-btn" aria-label="About the font library" data-help-btn>?</button>
      </div>

      <div class="combobox" aria-expanded="false" aria-haspopup="listbox">
        <input
          class="combobox__input"
          type="text"
          placeholder="Search fonts..."
          autocomplete="off"
          role="combobox"
          aria-label="Search fonts"
        />
        <button class="combobox__clear" aria-label="Clear search" hidden>&times;</button>
        <button class="combobox__toggle" aria-label="Toggle dropdown" data-combobox-toggle>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="combobox__dropdown" role="listbox" hidden></div>
      </div>
      <div class="font-name-row" hidden data-font-name-row>
        <div class="font-name" data-font-name></div>
        <button class="btn-icon-ghost btn-icon-ghost--primary" data-google-fonts-btn aria-label="Open in Google Fonts" title="Open in Google Fonts">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </button>
      </div>
    </div>

    <!-- Google Fonts confirmation modal -->
    <div class="modal-overlay" data-gf-modal hidden>
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">Open in Google Fonts</h2>
          <button class="modal__close" data-gf-modal-close aria-label="Close">&times;</button>
        </div>
        <div class="modal__body">
          <p>This will open the font page on Google Fonts in a new browser tab, where you can explore all its styles, pairings, and download options.</p>
        </div>
        <div class="modal__footer" style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
          <button class="btn btn--primary" data-gf-modal-confirm>Open in Google Fonts</button>
          <button class="btn btn--secondary" data-gf-modal-skip>Always open without asking</button>
        </div>
      </div>
    </div>

    <!-- Help modal -->
    <div class="modal-overlay" data-help-modal hidden>
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">About the font library</h2>
          <button class="modal__close" data-help-modal-close aria-label="Close">&times;</button>
        </div>
        <div class="modal__body">
          <p>Google Fonts is a library of 1,500+ open-source font families, freely available for any project.</p>
          <p>For this tool, a curated subset of 50 fonts has been selected — focusing on typefaces well-suited for interface design in SaaS products. The selection balances readability, versatility, and professional tone across both sans-serif and serif categories.</p>
        </div>
        <div class="modal__footer">
          <button class="btn btn--primary" data-help-modal-close>Got it, close this message</button>
        </div>
      </div>
    </div>
  `;

  const input = container.querySelector('.combobox__input');
  const clearBtn = container.querySelector('.combobox__clear');
  const toggleBtn = container.querySelector('[data-combobox-toggle]');
  const dropdown = container.querySelector('.combobox__dropdown');
  const combobox = container.querySelector('.combobox');
  const chips = container.querySelectorAll('.chip');
  const fontNameRow = container.querySelector('[data-font-name-row]');
  const fontNameEl = container.querySelector('[data-font-name]');
  const googleFontsBtn = container.querySelector('[data-google-fonts-btn]');
  const gfModal = container.querySelector('[data-gf-modal]');
  const gfModalClose = container.querySelector('[data-gf-modal-close]');
  const gfModalConfirm = container.querySelector('[data-gf-modal-confirm]');
  const gfModalSkip = container.querySelector('[data-gf-modal-skip]');
  let skipGfConfirmation = false;
  const helpBtn = container.querySelector('[data-help-btn]');
  const helpModal = container.querySelector('[data-help-modal]');
  const helpModalCloseButtons = container.querySelectorAll('[data-help-modal-close]');

  function getFiltered() {
    let list = [...fonts].sort((a, b) => a.name.localeCompare(b.name));
    if (category !== 'all') {
      list = list.filter(f => f.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }
    return list;
  }

  function renderDropdown() {
    filtered = getFiltered();
    highlightedIndex = -1;

    if (filtered.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 12px 16px; color: var(--color-text-muted); font-size: 13px;">
          No fonts found
        </div>
      `;
    } else {
      dropdown.innerHTML = filtered.map((font, i) => {
        const loadedFonts = getLoadedFonts?.() || new Set();
        const fontStyle = loadedFonts.has(font.googleId)
          ? `font-family: '${font.name}', sans-serif`
          : '';
        const isSelected = font.name === selectedFontName;
        return `
          <div class="combobox__option ${isSelected ? 'is-selected' : ''}"
               role="option"
               data-index="${i}"
               data-slug="${font.slug}"
               ${isSelected ? 'aria-selected="true"' : ''}>
            <span class="combobox__option-name">${font.name}</span>
            <span class="combobox__option-preview" style="${fontStyle}">Aa</span>
            <span class="combobox__option-category">${font.category}</span>
          </div>
        `;
      }).join('');
    }
  }

  function open() {
    isOpen = true;
    renderDropdown();
    dropdown.hidden = false;
    combobox.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('is-open');
  }

  function close() {
    isOpen = false;
    dropdown.hidden = true;
    combobox.setAttribute('aria-expanded', 'false');
    highlightedIndex = -1;
    toggleBtn.classList.remove('is-open');
  }

  function highlightOption(index) {
    const options = dropdown.querySelectorAll('.combobox__option');
    options.forEach(o => o.classList.remove('is-highlighted'));
    if (index >= 0 && index < options.length) {
      highlightedIndex = index;
      options[index].classList.add('is-highlighted');
      options[index].scrollIntoView({ block: 'nearest' });
    }
  }

  function selectFont(font) {
    selectedFontName = font.name;
    input.value = '';
    query = '';
    clearBtn.hidden = true;
    toggleBtn.hidden = false;
    close();
    updateFontName(font.name);
    onSelect?.(font);
  }

  function updateFontName(name) {
    fontNameEl.textContent = name;
    fontNameEl.style.fontFamily = name ? `'${name}', serif` : '';
    fontNameRow.hidden = !name;
  }

  function getGoogleFontsUrl() {
    const urlName = selectedFontName.replace(/ /g, '+');
    return `https://fonts.google.com/specimen/${urlName}`;
  }

  function openGoogleFonts() {
    window.open(getGoogleFontsUrl(), '_blank');
  }

  // Event: input
  input.addEventListener('input', () => {
    query = input.value.trim();
    clearBtn.hidden = !query;
    toggleBtn.hidden = !!query;
    open();
  });

  // Event: focus
  input.addEventListener('focus', () => {
    open();
  });

  // Event: keyboard navigation
  input.addEventListener('keydown', (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        open();
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightOption(Math.min(highlightedIndex + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightOption(Math.max(highlightedIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
        selectFont(filtered[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  });

  // Event: click option
  dropdown.addEventListener('click', (e) => {
    const option = e.target.closest('.combobox__option');
    if (!option) return;
    const index = parseInt(option.dataset.index, 10);
    if (filtered[index]) selectFont(filtered[index]);
  });

  // Event: clear
  clearBtn.addEventListener('click', () => {
    input.value = '';
    query = '';
    clearBtn.hidden = true;
    toggleBtn.hidden = false;
    input.focus();
    open();
  });

  // Event: toggle dropdown
  toggleBtn.addEventListener('click', () => {
    if (isOpen) {
      close();
    } else {
      input.focus();
      open();
    }
  });

  // Event: click outside
  document.addEventListener('click', (e) => {
    if (!combobox.contains(e.target)) close();
  });

  // Event: help modal
  helpBtn.addEventListener('click', () => {
    helpModal.hidden = false;
  });

  helpModalCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      helpModal.hidden = true;
    });
  });

  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.hidden = true;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !helpModal.hidden) {
      helpModal.hidden = true;
    }
  });

  // Event: Google Fonts button
  googleFontsBtn.addEventListener('click', () => {
    if (skipGfConfirmation) {
      openGoogleFonts();
    } else {
      gfModal.hidden = false;
    }
  });

  gfModalClose.addEventListener('click', () => { gfModal.hidden = true; });
  gfModal.addEventListener('click', (e) => { if (e.target === gfModal) gfModal.hidden = true; });
  gfModalConfirm.addEventListener('click', () => {
    gfModal.hidden = true;
    openGoogleFonts();
  });
  gfModalSkip.addEventListener('click', () => {
    skipGfConfirmation = true;
    gfModal.hidden = true;
    openGoogleFonts();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !gfModal.hidden) {
      gfModal.hidden = true;
    }
  });

  // Event: category chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      category = chip.dataset.category;
      if (isOpen) renderDropdown();

      // Auto-select a default font if current selection doesn't match the new category
      if (selectedFontName) {
        const currentFont = fonts.find(f => f.name === selectedFontName);
        if (category === 'all' || (currentFont && currentFont.category === category)) {
          return; // already matches
        }
      }

      // Pick default: Inter for all/sans-serif, first alphabetical for serif
      let defaultFont;
      if (category === 'all' || category === 'sans-serif') {
        defaultFont = fonts.find(f => f.name === 'Inter');
      } else {
        defaultFont = [...fonts]
          .filter(f => f.category === category)
          .sort((a, b) => a.name.localeCompare(b.name))[0];
      }
      if (defaultFont) selectFont(defaultFont);
    });
  });

  return {
    setSelected(fontName) {
      selectedFontName = fontName;
      input.value = '';
      clearBtn.hidden = true;
      updateFontName(fontName);
    },
  };
}
