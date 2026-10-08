const menuButton=document.querySelector('.c-menu');
const menu=document.querySelector('#c-nav');
const header=document.querySelector('.c-header');
function closeMenu(){menu.classList.remove('open');header.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','메뉴 열기');}
menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');header.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});
let lastHeaderScroll=window.scrollY;
window.addEventListener('scroll',()=>{const y=Math.max(0,window.scrollY),delta=y-lastHeaderScroll;if(y>80&&Math.abs(delta)<10)return;header.classList.toggle('nav-hidden',y>80&&delta>0);lastHeaderScroll=y;},{passive:true});
const mobileNav=document.querySelector('.c-mobile-nav');
const currentMobileLink=mobileNav.querySelector('[aria-current="page"]');
if(currentMobileLink)mobileNav.scrollLeft=Math.max(0,currentMobileLink.offsetLeft-(mobileNav.clientWidth-currentMobileLink.offsetWidth)/2);
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
const surface=document.querySelector('.surface-study');
if(surface){
 const copy=[['눈으로는 보기 어려운 변화','정상 거리에서는 평탄한 바닥. 표면의 미세한 구조를 확대해 살펴보세요.'],['기존 바닥의 표면을 확대하면','별도의 층을 덮지 않고 기존 바닥의 표면에 직접 작용하는 공법입니다.'],['표면을 미세하게 처리합니다','기술 안내자료는 2~6㎛의 미세 구조를 설명합니다. 재질과 마감에 맞춰 작업 조건을 조절합니다.']];
 surface.querySelectorAll('[data-surface-step]').forEach(button=>button.addEventListener('click',()=>{
  surface.dataset.surface=button.dataset.surfaceStep;
  surface.querySelector('[data-surface-title]').textContent=copy[Number(button.dataset.surfaceStep)][0];
  surface.querySelector('[data-surface-copy]').textContent=copy[Number(button.dataset.surfaceStep)][1];
  surface.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
}
const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}}),{threshold:.15});
document.querySelectorAll('[data-reveal]').forEach(el=>reveal.observe(el));
function openPortfolio(){const id=decodeURIComponent(location.hash.slice(1));const target=document.getElementById(id);if(target?.matches('.portfolio-tile')){filterCases('all');requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}}
window.addEventListener('hashchange',openPortfolio);
const caseFilters=[...document.querySelectorAll('[data-case-filter]')];
function filterCases(value){
 if(!caseFilters.length)return;
 const chosen=caseFilters.some(b=>b.dataset.caseFilter===value)?value:'all';
 caseFilters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.caseFilter===chosen)));
 const cards=[...document.querySelectorAll('.portfolio-tile')];
 cards.forEach(card=>card.hidden=chosen!=='all'&&card.dataset.category!==chosen);
 document.querySelector('.portfolio-count').textContent=chosen==='all'?'전체 현장 사진':caseFilters.find(b=>b.dataset.caseFilter===chosen).textContent+' 현장 사진';
}
caseFilters.forEach(b=>b.addEventListener('click',()=>{const url=new URL(location.href);url.searchParams.set('category',b.dataset.caseFilter);history.replaceState(null,'',url);filterCases(b.dataset.caseFilter);}));
filterCases(new URLSearchParams(location.search).get('category'));
openPortfolio();
window.addEventListener('popstate',()=>filterCases(new URLSearchParams(location.search).get('category')));
const consultation=document.querySelector('#consult-form');
if(consultation){
 const params=new URLSearchParams(location.search),space=params.get('space'),caseName=params.get('case');
 const spaceMap={'관공서·기업·상업시설':'관공서·기업','학교·유치원':'유치원·학교','요양·재활·복지시설':'요양원·병원'};
 if(space){const select=consultation.querySelector('[name="space"]');const value=spaceMap[space]||space;if([...select.options].some(o=>o.value===value))select.value=value;}
 if(params.get('purpose')==='aftercare')consultation.querySelector('[name="request"]').value='유지관리';
 if(space||caseName){const context=document.createElement('p');context.className='consult-context';context.textContent=caseName?`살펴본 사례: ${caseName}`:`상담할 공간: ${space}`;consultation.prepend(context);if(caseName)consultation.querySelector('[name="situation"]').value=`${caseName} 적용 사례를 보고 문의합니다. `;}
}
document.querySelectorAll('.faq-wrap details[id]').forEach(detail=>{if(location.hash==='#'+detail.id)detail.open=true;});
const stage=document.querySelector('.grip-stage');
if(stage){
  const button=stage.querySelector('.detail-button');
  button.addEventListener('click',()=>{const open=stage.dataset.detail!=='true';stage.dataset.detail=String(open);button.setAttribute('aria-pressed',String(open));button.innerHTML=open?'전체 표면으로 보기 <span aria-hidden="true">−</span>':'표면 확대해서 보기 <span aria-hidden="true">＋</span>';});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let active=false,queued=false;
  function update(){queued=false;if(reduced.matches)return;const rect=stage.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));stage.style.setProperty('--progress',progress.toFixed(3));}
  new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)update();}).observe(stage);
  window.addEventListener('scroll',()=>{if(active&&!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
}
const sample=document.querySelector('.sample-visual');
if(sample){const captions={'1':'바닥 재질과 면적 확인','2':'작은 구역에 샘플 시공','3':'효과와 외관을 직접 확인'};sample.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{sample.dataset.step=button.dataset.step;sample.querySelector('.sample-status').textContent=captions[button.dataset.step];sample.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));}

const caseRail=document.querySelector('.case-rail');
if(caseRail){
 const buttons=[...document.querySelectorAll('[data-case-direction]')];
 const updateButtons=()=>buttons.forEach(b=>b.disabled=Number(b.dataset.caseDirection)<0 ? caseRail.scrollLeft<2 : caseRail.scrollLeft+caseRail.clientWidth>=caseRail.scrollWidth-2);
 buttons.forEach(b=>b.addEventListener('click',()=>caseRail.scrollBy({left:Number(b.dataset.caseDirection)*caseRail.clientWidth*.8,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})));
 caseRail.addEventListener('scroll',updateButtons,{passive:true});window.addEventListener('resize',updateButtons);updateButtons();
}
const hero=document.querySelector('.hero-slides');
if(hero){
 const slides=[...hero.querySelectorAll('.hero-slide')],buttons=[...document.querySelectorAll('[data-hero-slide]')],pause=document.querySelector('[data-hero-pause]');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,paused=reduced.matches,timer;
 function show(index){current=index;slides.forEach((slide,i)=>{slide.classList.toggle('is-current',i===index);slide.setAttribute('aria-hidden',String(i!==index));});buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
 function schedule(){clearInterval(timer);pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'자동 전환 재생':'자동 전환 일시정지');if(!paused&&!document.hidden)timer=setInterval(()=>show((current+1)%slides.length),6500);}
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{show(i);paused=true;schedule();}));
 pause.addEventListener('click',()=>{paused=!paused;schedule();});
 document.addEventListener('visibilitychange',schedule);
 reduced.addEventListener('change',()=>{paused=reduced.matches;schedule();});
 document.querySelector('.c-hero').addEventListener('focusin',()=>{paused=true;schedule();});
 schedule();
}

document.querySelectorAll('.reaction-demo').forEach(lab=>{
 const copy=[['전용 약제를 고르게 도포합니다.','바닥 재질과 샘플 결과에 맞춰 약제의 도포량을 조절합니다.'],['약제가 표면에 작용해 미세 공극을 만듭니다.','표면 상태와 작업 환경을 살피며 반응 시간을 관리합니다.'],['반응을 마무리하고 잔여액을 세척·회수합니다.','새 코팅층을 덮지 않고, 기존 바닥에 형성된 미세 표면 구조를 활용합니다.']];
 const play=lab.querySelector('[data-reaction-play]');
 let timer=null,step=0;
 function stop(){clearInterval(timer);timer=null;play.textContent='▶ 과정 재생';play.setAttribute('aria-label','공법 애니메이션 재생');}
 function show(i){step=i;lab.dataset.reaction=String(i);lab.querySelector('[data-reaction-title]').textContent=copy[i][0];lab.querySelector('[data-reaction-copy]').textContent=copy[i][1];lab.querySelectorAll('[data-reaction-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.reactionStep)===i)));}
 lab.querySelectorAll('[data-reaction-step]').forEach(b=>b.addEventListener('click',()=>{stop();show(Number(b.dataset.reactionStep));}));
 play.addEventListener('click',()=>{if(timer){stop();return;}show(0);play.textContent='Ⅱ 일시정지';play.setAttribute('aria-label','공법 애니메이션 일시정지');timer=setInterval(()=>{show(step+1);if(step===2)stop();},3200);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
});

// Venue cards settle into a readable grid once they enter the viewport.
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 document.querySelectorAll('.venue-showcase').forEach(grid=>{
  const cards=[...grid.querySelectorAll('.venue-card')];
  let remaining=cards.length;
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
    if(--remaining===0)observer.disconnect();
   });
  },{threshold:.12});
  grid.classList.add('motion-ready');
  cards.forEach(card=>observer.observe(card));
 });
}

const form = document.querySelector('#consult-form');
// Technical links open the relevant answer, including when entered from another page.
const openLinkedAnswer = () => {
  const target = document.getElementById(location.hash.slice(1));
  if (target && target.tagName === 'DETAILS') target.open = true;
};
openLinkedAnswer();
window.addEventListener('hashchange', openLinkedAnswer);

if (form) {
  let memo = '';
  const status = document.querySelector('#memo-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const value = name => String(data.get(name) || '').trim() || '상담 시 확인';
    memo = `닥터 논슬립 · 현장 방문 상담 메모\n\n상담 희망 내용: ${value('request')}\n공간 유형: ${value('space')}\n지역: ${value('region')}\n대략적인 규모: ${value('area')}\n방문 희망 일정: ${value('schedule')}\n\n미끄러운 상황\n${value('situation')}\n\n기존 코팅·왁스 / 청소 방식\n${value('care')}\n\n준비된 참고자료: ${data.getAll('photos').join(', ') || '없음 · 현장 방문으로 확인 희망'}\n\n※ 이 메모는 상담 접수 내역이 아닙니다. 상담 채널 연결 후 전달해 주세요. 사진은 선택 사항입니다.`;
    document.querySelector('#consult-memo').textContent = memo;
    document.querySelector('#consult-result').hidden = false;
    status.textContent = '메모를 정리했습니다. 내용을 복사하거나 저장할 수 있습니다.';
  });
  document.querySelector('#copy-memo').addEventListener('click', async () => {
    let copyTimer;
    try {
      await Promise.race([
        navigator.clipboard.writeText(memo),
        new Promise((_, reject) => { copyTimer = setTimeout(reject, 1500); })
      ]);
      status.textContent = '상담 메모를 복사했습니다.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#consult-memo'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = '자동 복사를 사용할 수 없어 메모를 선택했습니다. 선택된 내용을 복사해 주세요.';
    } finally { clearTimeout(copyTimer); }
  });
  document.querySelector('#save-memo').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + memo], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = '닥터논슬립-상담메모.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = '상담 메모 저장을 시작했습니다.';
  });
}
