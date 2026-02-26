// Theme Management - Apply immediately to prevent flash
(function() {
  const THEME_KEY = 'sd-theme';
  
  // Get saved theme or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply theme immediately
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Apply saved theme IMMEDIATELY (before DOM ready)
  setTheme(getPreferredTheme());

  // Toggle between light/dark
  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateToggleIcon();
  };

  // Update toggle button icon
  function updateToggleIcon() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  // Update icon when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateToggleIcon);
  } else {
    updateToggleIcon();
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
      updateToggleIcon();
    }
  });
})();
