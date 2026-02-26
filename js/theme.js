// Theme Management
(function() {
  const THEME_KEY = 'sd-theme';
  
  // Get saved theme or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateToggleIcon();
  }

  // Toggle between light/dark
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Update toggle button icon
  function updateToggleIcon() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.title = isDark ? '切换到亮色模式' : '切换到暗色模式';
    }
  }

  // Initialize on page load
  function init() {
    setTheme(getPreferredTheme());
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Expose to global
  window.toggleTheme = toggleTheme;

  // Run init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
