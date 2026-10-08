(() => {
  const current = new URL(window.location.href);
  const file = current.pathname.split('/').pop() || 'index.html';
  const variant = file === 'landing-c.html' || file === 'technology-c.html' ? 'c' : file === 'landing-b.html' ? 'b' : ['b','c'].includes(current.searchParams.get('view')) ? current.searchParams.get('view') : 'a';
  const isHome = ['index.html','landing-b.html','landing-c.html'].includes(file);
  // Carry the selected landing through the shared detail pages, also under GitHub Pages' subpath.
  if (variant !== 'a') {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, current);
      if (url.origin !== current.origin || !url.pathname.endsWith('.html')) return;
      if (url.pathname.endsWith('/index.html')) {
        url.pathname = url.pathname.replace(/index\.html$/, `landing-${variant}.html`);
      }
      url.searchParams.set('view', variant);
      link.href = url.pathname + url.search + url.hash;
    });
  }
  const nav = document.createElement('nav');
  nav.className = 'preview-switch';
  nav.setAttribute('aria-label', '랜딩페이지 시안 비교');
  nav.innerHTML = `<span>${isHome ? '랜딩 비교' : file === 'technology-c.html' ? 'C 기술자료' : '상세페이지 공통'}</span><a href="index.html"${isHome && variant === 'a' ? ' aria-current="page"' : ''}>시안 A<small>기존</small></a><a href="landing-b.html"${isHome && variant === 'b' ? ' aria-current="page"' : ''}>시안 B<small>구성안</small></a><a href="landing-c.html"${isHome && variant === 'c' ? ' aria-current="page"' : ''}>시안 C<small>새 스타일</small></a>`;
  document.body.classList.add('has-preview-switch');
  document.body.append(nav);
})();
