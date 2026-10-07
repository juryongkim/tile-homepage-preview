(() => {
  const current = new URL(window.location.href);
  const file = current.pathname.split('/').pop() || 'index.html';
  const isB = file === 'landing-b.html' || current.searchParams.get('view') === 'b';
  const isHome = file === 'index.html' || file === 'landing-b.html';
  // Carry the selected landing through the shared detail pages, also under GitHub Pages' subpath.
  if (isB) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, current);
      if (url.origin !== current.origin || !url.pathname.endsWith('.html')) return;
      if (url.pathname.endsWith('/index.html')) {
        url.pathname = url.pathname.replace(/index\.html$/, 'landing-b.html');
      }
      url.searchParams.set('view', 'b');
      link.href = url.pathname + url.search + url.hash;
    });
  }
  const nav = document.createElement('nav');
  nav.className = 'preview-switch';
  nav.setAttribute('aria-label', '랜딩페이지 시안 비교');
  nav.innerHTML = `<span>${isHome ? '랜딩 비교' : '상세페이지 공통'}</span><a href="index.html"${isHome && !isB ? ' aria-current="page"' : ''}>시안 A<small>기존</small></a><a href="landing-b.html"${isHome && isB ? ' aria-current="page"' : ''}>시안 B<small>새 구성</small></a>`;
  document.body.classList.add('has-preview-switch');
  document.body.append(nav);
})();
