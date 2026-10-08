(() => {
  const current = new URL(location.href);
  const file = current.pathname.split('/').pop() || 'index.html';
  const detailKeys = ['method','spaces','safety','about','guide','consult'];
  const isC = file === 'landing-c.html' || file === 'technology-c.html' || detailKeys.some(key=>file===key+'-c.html');
  const variant = isC ? 'c' : file === 'landing-b.html' ? 'b' : ['b','c'].includes(current.searchParams.get('view')) ? current.searchParams.get('view') : 'a';
  const isHome = ['index.html','landing-b.html','landing-c.html'].includes(file);
  const key = file === 'technology-c.html' ? 'resources' : file.replace(/(?:-c)?\.html$/, '');
  const cFile = isHome ? 'landing-c.html' : key === 'resources' ? 'technology-c.html' : detailKeys.includes(key) ? key+'-c.html' : 'landing-c.html';
  if (variant==='c' && !isC) { location.replace(cFile+current.hash); return; }
  if(variant==='b') document.querySelectorAll('a[href]').forEach(link=>{
    const url=new URL(link.getAttribute('href'),current);
    if(url.origin!==current.origin || !url.pathname.endsWith('.html')) return;
    if(url.pathname.endsWith('/index.html')) url.pathname=url.pathname.replace(/index\.html$/,'landing-b.html');
    url.searchParams.set('view','b'); link.href=url.pathname+url.search+url.hash;
  });
  const original = isHome ? 'index.html' : key+'.html';
  const nav=document.createElement('nav');
  nav.className='preview-switch'; nav.setAttribute('aria-label','페이지 시안 비교');
  nav.innerHTML='<span>'+ (isHome?'랜딩 비교':'페이지 비교') +'</span>'+[['a',original,'기존'],['b',isHome?'landing-b.html':original+'?view=b','구성안'],['c',cFile,'새 스타일']].map(([v,url,label])=>'<a href="'+url+'"'+(variant===v?' aria-current="page"':'')+'>시안 '+v.toUpperCase()+'<small>'+label+'</small></a>').join('');
  document.body.classList.add('has-preview-switch'); document.body.append(nav);
})();
