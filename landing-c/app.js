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

const caseRail=document.querySelector('.case-rail');
if(caseRail){
 const buttons=[...document.querySelectorAll('[data-case-direction]')];
 const updateButtons=()=>buttons.forEach(b=>b.disabled=Number(b.dataset.caseDirection)<0 ? caseRail.scrollLeft<2 : caseRail.scrollLeft+caseRail.clientWidth>=caseRail.scrollWidth-2);
 buttons.forEach(b=>b.addEventListener('click',()=>caseRail.scrollBy({left:Number(b.dataset.caseDirection)*caseRail.clientWidth*.8,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})));
 caseRail.addEventListener('scroll',updateButtons,{passive:true});window.addEventListener('resize',updateButtons);updateButtons();
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
