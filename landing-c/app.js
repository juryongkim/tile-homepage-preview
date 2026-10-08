const menuButton=document.querySelector('.c-menu');
const menu=document.querySelector('#c-nav');
function closeMenu(){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','메뉴 열기');}
menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
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
