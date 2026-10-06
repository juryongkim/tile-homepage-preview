const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const header = document.querySelector('.site-header');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  nav.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
});

let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
  const y = Math.max(0, window.scrollY);
  const delta = y - lastScroll;
  if (y > 80 && Math.abs(delta) < 10) return;
  header.classList.toggle('nav-hidden', y > 80 && delta > 0);
  lastScroll = y;
}, {passive: true});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    toggle.click();
    toggle.focus();
  }
});

const slides = [...document.querySelectorAll('.hero-slide')];
if (slides.length) {
  const dots = [...document.querySelectorAll('.slide-dot')];
  const pause = document.querySelector('.slide-pause');
  const captions = ['호텔 · 대형 로비', '수영장 · 물기가 닿는 공간', '관공서 · 기업 공용시설'];
  let current = 0;
  let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;
  const show = index => {
    current = index;
    slides.forEach((slide, i) => { slide.hidden = i !== index; slide.classList.toggle('active', i === index); });
    dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); dot.setAttribute('aria-pressed', String(i === index)); });
    document.querySelector('#slide-caption').textContent = captions[index];
    document.querySelector('.slide-count').textContent = `${String(index + 1).padStart(2, '0')} / 03`;
  };
  const schedule = () => {
    clearInterval(timer);
    if (playing && !document.hidden) timer = setInterval(() => show((current + 1) % slides.length), 6500);
    pause.textContent = playing ? 'Ⅱ' : '▶';
    pause.setAttribute('aria-label', playing ? '자동 슬라이드 멈추기' : '자동 슬라이드 재생');
  };
  dots.forEach((dot, index) => dot.addEventListener('click', () => { show(index); schedule(); }));
  pause.addEventListener('click', () => { playing = !playing; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  schedule();
}

document.querySelectorAll('.work-slider').forEach(slider => {
  const scenes = [...slider.querySelectorAll('.work-slide')];
  const tabs = [...slider.querySelectorAll('[data-work]')];
  let current = 0;
  const show = index => {
    current = (index + scenes.length) % scenes.length;
    scenes.forEach((scene, i) => { scene.hidden = i !== current; });
    tabs.forEach((tab, i) => { tab.setAttribute('aria-pressed', String(i === current)); });
  };
  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i)));
  slider.querySelector('.work-prev').addEventListener('click', () => show(current - 1));
  slider.querySelector('.work-next').addEventListener('click', () => show(current + 1));
});

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
