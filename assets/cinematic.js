(function(){
  "use strict";
  var d=document, root=d.documentElement;
  if (root.classList.contains('cn-cinematic')) return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar=d.createElement('div');
  bar.className='cn-progress'; d.body.appendChild(bar);
  function onScroll(){
    var h=d.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?(scrollY/h)*100:0)+'%';
    var bt=d.querySelector('.cn-backtop');
    if(bt) bt.classList.toggle('cn-show', scrollY>600);
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  var btn=d.createElement('button');
  btn.className='cn-backtop'; btn.type='button'; btn.setAttribute('aria-label','Back to top');
  btn.innerHTML='&uarr;';
  btn.addEventListener('click',function(){ scrollTo({top:0,behavior:reduce?'auto':'smooth'}); });
  d.body.appendChild(btn);

  var targets=[].slice.call(d.querySelectorAll(
    'main section > *, .container > .section-head, section > .container > h2, '+
    'section > .wrap > h2, .card, .svc, article, figure'));
  targets=targets.filter(function(el){
    if(el.closest('.cn-progress,.cn-backtop,header,nav,footer')) return false;
    return el.getBoundingClientRect().height>24;
  });
  targets.slice(0,140).forEach(function(el){ el.classList.add('cn-reveal'); });

  if(reduce||!('IntersectionObserver' in window)){
    targets.forEach(function(el){ el.classList.add('cn-in'); });
    return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('cn-in'); io.unobserve(en.target); }
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  targets.forEach(function(el){ io.observe(el); });
  setTimeout(function(){ root.classList.add('cn-failsafe'); },3200);
})();
