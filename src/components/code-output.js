import { generateCSS, generateTailwind, generateJSON } from '../utils/export.js';

// Sidebar panel icon — rectangle with vertical divider on right side
const SIDEBAR_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`;

/**
 * Tabbed code output panel: CSS / Tailwind / JSON.
 * Header has tabs + collapse/expand toggle.
 * Footer has Copy (primary) + Download (secondary).
 */
export function createCodeOutput(container, footerContainer) {
  let currentTokens = [];
  let activeTab = 'css';

  container.innerHTML = `
    <div class="code-output">
      <div class="code-output__header">
        <div class="code-output__tabs" role="tablist">
          <button class="code-output__tab is-active" role="tab" data-tab="css" aria-selected="true">CSS</button>
          <button class="code-output__tab" role="tab" data-tab="tailwind" aria-selected="false">Tailwind</button>
          <button class="code-output__tab" role="tab" data-tab="json" aria-selected="false">JSON</button>
        </div>
        <button class="panel-toggle" data-toggle-panel aria-label="Collapse panel">${SIDEBAR_ICON}</button>
      </div>
      <div class="code-output__body">
        <pre class="code-output__pre" data-code-pre></pre>
      </div>
    </div>
  `;

  // Render footer with Copy + Download
  footerContainer.innerHTML = `
    <div class="panel-right__actions">
      <button class="btn btn--primary" data-copy-btn>Copy</button>
      <button class="btn btn--secondary" data-download-btn>Download CSS</button>
    </div>
  `;

  const tabs = container.querySelectorAll('.code-output__tab');
  const pre = container.querySelector('[data-code-pre]');
  const copyBtn = footerContainer.querySelector('[data-copy-btn]');
  const downloadBtn = footerContainer.querySelector('[data-download-btn]');
  const toggleBtn = container.querySelector('[data-toggle-panel]');

  function getCode() {
    switch (activeTab) {
      case 'css': return generateCSS(currentTokens);
      case 'tailwind': return generateTailwind(currentTokens);
      case 'json': return generateJSON(currentTokens);
      default: return '';
    }
  }

  function renderCode() {
    pre.textContent = getCode();
  }

  function updateDownloadLabel() {
    const labels = { css: 'Download CSS', tailwind: 'Download Tailwind', json: 'Download JSON' };
    downloadBtn.textContent = labels[activeTab] || 'Download';
  }

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      activeTab = tab.dataset.tab;
      renderCode();
      updateDownloadLabel();
    });
  });

  // Copy button (no floating toast — button itself shows success state)
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getCode());
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = getCode();
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('is-copied');
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('is-copied');
    }, 2000);
  });

  // Download button
  downloadBtn.addEventListener('click', () => {
    const code = getCode();
    let filename, mime;

    switch (activeTab) {
      case 'css':
        filename = 'type-scale.css';
        mime = 'text/css';
        break;
      case 'tailwind':
        filename = 'tailwind.config.js';
        mime = 'text/javascript';
        break;
      case 'json':
        filename = 'type-tokens.json';
        mime = 'application/json';
        break;
    }

    const blob = new Blob([code], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });

  return {
    update(tokens) {
      currentTokens = tokens;
      renderCode();
    },

    getCode,
    getActiveTab() { return activeTab; },
    getToggleBtn() { return toggleBtn; },
  };
}
