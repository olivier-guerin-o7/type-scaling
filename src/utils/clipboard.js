let toastTimeout;

/**
 * Copy text to clipboard and show a toast notification.
 * @param {string} text
 * @param {string} [message='Copied!']
 */
export async function copyToClipboard(text, message = 'Copied!') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(message);
  }
}

/**
 * Show a brief toast notification.
 */
export function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2000);
}
