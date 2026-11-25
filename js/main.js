/* Hospitality Performance Group - site behavior: sticky header, mobile menu, audience filter, reveal-on-scroll, contact form */
(function(){
var h=document.getElementById('hd');
function s(){h.classList.toggle('s',window.scrollY>40)}s();addEventListener('scroll',s,{passive:true});
var nl=document.getElementById('nl');
document.getElementById('mb').onclick=function(){nl.classList.toggle('open')};
nl.addEventListener('click',function(e){if(e.target.tagName==='A')nl.classList.remove('open')});
var bs=document.querySelectorAll('#aud button'),cs=document.querySelectorAll('.card');
bs.forEach(function(b){b.onclick=function(){bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
var a=b.dataset.a;cs.forEach(function(c){c.classList.toggle('dim',a!=='all'&&c.dataset.for.split(' ').indexOf(a)<0)})}});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
var f=document.getElementById('cf'),ok=document.getElementById('ok');
f.addEventListener('submit',function(e){e.preventDefault();
if(!f.checkValidity()){f.reportValidity();return}
var btn=f.querySelector('button[type=submit]');btn.disabled=true;
fetch('api/contact.php',{method:'POST',body:new FormData(f)}).then(function(r){return r.json()}).then(function(d){
ok.style.display='block';ok.textContent=d.ok?'Thank you. Your inquiry has been received and we will reply personally.':(d.error||'Something went wrong. Please try again.');
if(d.ok)f.reset();btn.disabled=false}).catch(function(){ok.style.display='block';ok.textContent='Could not send right now. Please try again shortly.';btn.disabled=false})});
})();
