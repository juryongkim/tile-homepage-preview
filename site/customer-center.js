const support=document.querySelector('.support-content');
const supportTabs=[...support.querySelectorAll('.support-tabs a')];
const supportPanels=[...support.querySelectorAll('.support-panel')];
support.querySelector('.support-tabs').setAttribute('role','tablist');
supportTabs.forEach(tab=>{
 tab.setAttribute('role','tab');
 tab.setAttribute('aria-controls',tab.hash.slice(1));
});
supportPanels.forEach(panel=>panel.setAttribute('role','tabpanel'));
support.classList.add('tabs-ready');
function openSupportTab(scroll=true){
 const target=document.getElementById(location.hash.slice(1));
 const active=target?.closest('.support-panel')||supportPanels[0];
 supportPanels.forEach(panel=>panel.hidden=panel!==active);
 supportTabs.forEach(tab=>{
  const selected=tab.hash==='#'+active.id;
  tab.setAttribute('aria-selected',String(selected));
  tab.tabIndex=selected?0:-1;
 });
 if(target?.matches('details'))target.open=true;
 if(scroll&&target&&target.closest('.support-panel'))requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
}
supportTabs.forEach((tab,index)=>{
 tab.addEventListener('click',event=>{
  event.preventDefault();
  if(location.hash!==tab.hash)history.pushState(null,'',tab.hash);
  openSupportTab(false);
 });
 tab.addEventListener('keydown',event=>{
  let next;
  if(event.key==='ArrowRight')next=(index+1)%supportTabs.length;
  else if(event.key==='ArrowLeft')next=(index+supportTabs.length-1)%supportTabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=supportTabs.length-1;
  else if(event.key===' ')next=index;
  else return;
  event.preventDefault();
  supportTabs[next].focus();
  supportTabs[next].click();
 });
});
window.addEventListener('hashchange',openSupportTab);
openSupportTab();
