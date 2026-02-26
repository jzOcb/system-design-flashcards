// 统一导航栏组件
// 用法: <nav id="main-nav"></nav> 然后调用 renderNav('当前页面')

const NAV_ITEMS_ZH = [
  { href: 'learn.html', label: '学习', id: 'learn' },
  { href: 'flashcard.html', label: '闪卡', id: 'flashcard' },
  { href: 'neetcode.html', label: 'NeetCode', id: 'neetcode' },
  { href: 'quiz.html', label: 'Quiz', id: 'quiz' },
  { href: 'deepdive.html', label: '深入', id: 'deepdive' },
  { href: 'behavioral.html', label: 'BQ', id: 'behavioral' },
  { href: 'calculator.html', label: '计算器', id: 'calculator' },
  { href: 'progress.html', label: '进度', id: 'progress' },
];

const NAV_ITEMS_EN = [
  { href: 'learn.html', label: 'Learn', id: 'learn' },
  { href: 'flashcard-en.html', label: 'Flashcards', id: 'flashcard' },
  { href: 'neetcode.html', label: 'NeetCode', id: 'neetcode' },
  { href: 'quiz.html', label: 'Quiz', id: 'quiz' },
  { href: 'deepdive.html', label: 'Deep Dive', id: 'deepdive' },
  { href: 'behavioral.html', label: 'BQ', id: 'behavioral' },
  { href: 'calculator.html', label: 'Calc', id: 'calculator' },
  { href: 'progress.html', label: 'Progress', id: 'progress' },
];

function renderNav(currentPage, lang = 'zh') {
  const isEn = lang === 'en';
  const items = isEn ? NAV_ITEMS_EN : NAV_ITEMS_ZH;
  const brand = isEn ? 'SD Interview Prep' : 'SD 面试速成';
  const homeLink = isEn ? 'index-en.html' : 'index.html';
  const searchTitle = isEn ? 'Search (⌘K)' : '搜索 (⌘K)';
  const langSwitch = isEn 
    ? { href: currentPage.replace('-en', '').replace('index.html', 'index.html'), label: '🇨🇳 中文' }
    : { href: currentPage === 'index.html' ? 'index-en.html' : currentPage.replace('.html', '-en.html'), label: '🇺🇸 EN' };

  const nav = document.getElementById('main-nav');
  if (!nav) return;

  nav.className = 'nav';
  nav.innerHTML = `
    <a href="${homeLink}" class="nav-brand">${brand}</a>
    <button class="nav-toggle" onclick="toggleMobileNav()" aria-label="Menu">☰</button>
    <div class="nav-links">
      ${items.map(item => 
        `<a href="${item.href}" ${currentPage === item.id || currentPage === item.href ? 'class="active"' : ''}>${item.label}</a>`
      ).join('')}
      <a href="search.html" title="${searchTitle}" ${currentPage === 'search' ? 'class="active"' : ''}>🔍</a>
      <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" title="Toggle theme">🌙</button>
      <a href="${langSwitch.href}" class="lang-btn">${langSwitch.label}</a>
    </div>
  `;
}

function toggleMobileNav() {
  document.querySelector('.nav-links').classList.toggle('show');
}

// 自动检测当前页面并渲染
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  const isEn = page.includes('-en') || path.includes('/en/');
  
  if (document.getElementById('main-nav')) {
    renderNav(page, isEn ? 'en' : 'zh');
  }
});
