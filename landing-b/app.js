const reviewToggle=document.querySelector('#review-toggle');
reviewToggle.addEventListener('click',()=>{const notes=document.querySelector('#review-notes');notes.hidden=!notes.hidden;reviewToggle.setAttribute('aria-expanded',String(!notes.hidden));});
const menu=document.querySelector('.menu');
const nav=document.querySelector('#site-nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
let lastScroll=window.scrollY;let scrollQueued=false;
window.addEventListener('scroll',()=>{if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{const y=window.scrollY;if(Math.abs(y-lastScroll)>6){document.body.classList.toggle('scrolling-down',y>lastScroll&&y>140&&!nav.classList.contains('open'));lastScroll=y;}scrollQueued=false;});},{passive:true});
const techCopy={1:['육안으로는 매끈한 바닥','일반 시야에서 큰 구멍이나 거친 요철로 보이지 않습니다.'],2:['표면에 형성되는 2~6㎛ 미세 구조','전용 약제로 기존 타일·석재의 표면을 미세하게 처리합니다.'],3:['젖은 상태의 미끄럼 저항 개선','미세 구조를 통해 바닥과 발의 접촉 조건을 개선하는 원리입니다.']};
document.querySelectorAll('.tech-controls button').forEach(button=>button.addEventListener('click',()=>{const stage=button.dataset.stage;document.querySelector('.tech-stage').dataset.stage=stage;document.querySelector('.tech-caption b').textContent=techCopy[stage][0];document.querySelector('.tech-caption span').textContent=techCopy[stage][1];document.querySelectorAll('.tech-controls button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});}));
const phases={1:['작업 구역','통행 동선','작업 구역과 이용 동선을 나누어 진행합니다.'],2:['확인 후 이용','작업 구역','먼저 시공한 구역을 확인하고 다음 구역으로 옮깁니다.'],3:['마무리 확인','마무리 확인','세척·회수와 바닥 상태 확인 후 이용 시점을 안내합니다.']};
document.querySelectorAll('.phase-buttons button').forEach(button=>button.addEventListener('click',()=>{const n=button.dataset.phase;document.querySelector('.floor-plan').dataset.phase=n;document.querySelector('.room-a span').textContent=phases[n][0];document.querySelector('.room-b span').textContent=phases[n][1];document.querySelector('.phase-caption').textContent=phases[n][2];document.querySelectorAll('.phase-buttons button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});}));
const track=document.querySelector('.case-track');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function moveCase(direction){const card=track.querySelector('article');const gap=parseFloat(getComputedStyle(track).gap)||0;track.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:reduced.matches?'instant':'smooth'});}
document.querySelector('#case-prev').addEventListener('click',()=>moveCase(-1));document.querySelector('#case-next').addEventListener('click',()=>moveCase(1));
track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveCase(e.key==='ArrowRight'?1:-1);}});
const dialog=document.querySelector('#info-dialog');
const dialogCopy={phone:['전화 상담 연결 영역','최종 대표번호가 정해지면 모바일에서는 바로 전화로 연결됩니다. 현재는 랜딩페이지 검토 시안으로, 상담이 접수되거나 전화가 발신되지 않습니다.'],kakao:['카카오톡 상담 연결 영역','브랜드 채널 개설 후 대화 화면으로 바로 연결합니다. 현재는 버튼 위치와 상담 동선을 확인하는 검토 시안입니다.'],documents:['제품 시험자료 공개 구성','시험기관·시험 항목·시험 조건·결과를 읽을 수 있는 공개용 성적서 사본을 배치합니다. 원본의 이름·업체 식별 정보는 가리고, 시험 결과는 변경하지 않습니다. 현재는 문서 배치 전 구성 시안입니다.']};
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{const copy=dialogCopy[button.dataset.open];document.querySelector('#dialog-title').textContent=copy[0];document.querySelector('#dialog-body').textContent=copy[1];dialog.showModal();}));
document.querySelector('#dialog-confirm').addEventListener('click',()=>dialog.close());
const contactObserver=new IntersectionObserver(entries=>{document.body.classList.toggle('at-contact',entries[0].isIntersecting);},{threshold:.05});contactObserver.observe(document.querySelector('#contact'));

const heroObserver=new IntersectionObserver(entries=>{document.body.classList.toggle('at-hero',entries[0].isIntersecting);},{threshold:.1});heroObserver.observe(document.querySelector('.hero'));
