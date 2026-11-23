(() => {
 function init() {
  const button=document.querySelector('.menu-toggle');
  const menu=document.getElementById('site-links');
  if(!button||!menu||button.dataset.initialized==='true')return;
  button.dataset.initialized='true';
  function close(){menu.classList.remove('open');button.setAttribute('aria-expanded','false');button.textContent='☰ Menu';}
  button.addEventListener('click',()=>{
   const open=menu.classList.toggle('open');
   button.setAttribute('aria-expanded',String(open));
   button.textContent=open?'✕ Close':'☰ Menu';
  });
  menu.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
