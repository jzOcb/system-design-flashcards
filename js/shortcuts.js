// Global Keyboard Shortcuts
(function() {
  document.addEventListener('keydown', function(e) {
    // ⌘K or Ctrl+K -> Search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      window.location.href = 'search.html';
    }
    
    // ? -> Show shortcuts help (when not typing)
    if (e.key === '?' && !isTyping()) {
      showShortcutsModal();
    }
  });

  function isTyping() {
    const active = document.activeElement;
    return active.tagName === 'INPUT' || 
           active.tagName === 'TEXTAREA' || 
           active.isContentEditable;
  }

  function showShortcutsModal() {
    // Check if modal already exists
    if (document.getElementById('shortcuts-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;" onclick="this.remove()">
        <div style="background:var(--card-bg);border-radius:12px;padding:2rem;max-width:400px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);" onclick="event.stopPropagation()">
          <h3 style="margin-bottom:1rem;font-size:1.25rem;">⌨️ 快捷键</h3>
          <div style="display:grid;gap:0.75rem;">
            <div style="display:flex;justify-content:space-between;">
              <span>搜索</span>
              <kbd style="background:var(--bg);padding:0.25rem 0.5rem;border-radius:4px;font-family:monospace;">⌘K</kbd>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>切换主题</span>
              <kbd style="background:var(--bg);padding:0.25rem 0.5rem;border-radius:4px;font-family:monospace;">⌘D</kbd>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>显示快捷键</span>
              <kbd style="background:var(--bg);padding:0.25rem 0.5rem;border-radius:4px;font-family:monospace;">?</kbd>
            </div>
          </div>
          <p style="margin-top:1.5rem;font-size:0.85rem;color:var(--text-secondary);text-align:center;">按任意键关闭</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on any key
    function closeModal(e) {
      modal.remove();
      document.removeEventListener('keydown', closeModal);
    }
    setTimeout(() => document.addEventListener('keydown', closeModal), 100);
  }

  // ⌘D -> Toggle theme
  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
      e.preventDefault();
      if (typeof toggleTheme === 'function') {
        toggleTheme();
      }
    }
  });
})();
