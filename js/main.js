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

/* ---- Motion & interaction layer ---- */
(function(){
var d=document,B=d.body,R=d.documentElement,rm=matchMedia('(prefers-reduced-motion:reduce)').matches,$=function(i){return d.getElementById(i)};
var h1=d.querySelector('.hero h1'),k=0;
function sp(t){var o=[];t.split(/(\s+)/).forEach(function(s){if(!s.trim()){o.push(d.createTextNode(s));return}var w=d.createElement('span');w.className='w';var i=d.createElement('span');i.textContent=s;i.style.transitionDelay=(.35+k++*.09)+'s';w.appendChild(i);o.push(w)});return o}
Array.prototype.slice.call(h1.childNodes).forEach(function(n){if(n.nodeType===3){sp(n.textContent).forEach(function(x){h1.insertBefore(x,n)});h1.removeChild(n)}else{var t=n.textContent;n.textContent='';sp(t).forEach(function(x){n.appendChild(x)})}});
setTimeout(function(){B.classList.add('ready');$('pre').classList.add('out')},rm?0:1300);
var pg=$('prog'),wv=d.querySelector('.waves');
addEventListener('scroll',function(){var m=R.scrollHeight-innerHeight;pg.style.transform='scaleX('+(m>0?scrollY/m:0)+')';if(!rm)wv.style.transform='translateY('+Math.min(scrollY,800)*.2+'px)'},{passive:true});
var cg=$('cg');addEventListener('mousemove',function(e){cg.style.transform='translate('+(e.clientX-190)+'px,'+(e.clientY-190)+'px)'});
d.querySelectorAll('.card').forEach(function(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')})});
d.querySelectorAll('.hero .btn').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.18+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})});
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var t=+e.target.dataset.n,s=e.target.dataset.s||'',t0=performance.now();(function f(n){var p=Math.min((n-t0)/1600,1);e.target.textContent=Math.round(t*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)})(t0)})});
d.querySelectorAll('[data-n]').forEach(function(x){cio.observe(x)});
$('tg').onclick=function(){var dk=R.dataset.theme?R.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;R.dataset.theme=dk?'light':'dark'};
var cv=$('cv'),x=cv.getContext('2d'),P=[],W,H,mx=-999,my=-999;
function rs(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;P=[];for(var i=0;i<Math.min(90,W/14);i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+.4})}
rs();addEventListener('resize',rs);
cv.parentNode.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
function dr(){x.clearRect(0,0,W,H);for(var i=0;i<P.length;i++){var a=P[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
var dx=a.x-mx,dy=a.y-my,dd=Math.sqrt(dx*dx+dy*dy)||1;if(dd<140){a.x+=dx/dd*1.2;a.y+=dy/dd*1.2}
x.fillStyle='rgba(201,164,104,.7)';x.beginPath();x.arc(a.x,a.y,a.r,0,7);x.fill();
for(var j=i+1;j<P.length;j++){var b=P[j],ex=a.x-b.x,ey=a.y-b.y,e2=ex*ex+ey*ey;if(e2<12000){x.strokeStyle='rgba(201,164,104,'+(.18*(1-e2/12000))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}}
if(!rm)requestAnimationFrame(dr)}
dr();
var fm=function(v){return '$'+Math.round(v).toLocaleString('en-US')},cur=0,tk=0;
function calc(){var rv=+$('rev').value,pc=+$('pc').value,im=+$('im').value;$('revo').textContent=fm(rv);$('pco').textContent=pc+'%';$('imo').textContent=im+' pts';$('np').textContent='Prime cost moves from '+pc+'% to '+(pc-im)+'% of revenue.';
var t=rv*im/100,t0=performance.now(),f=cur,q=++tk;(function a(n){if(q!==tk)return;var p=Math.min((n-t0)/700,1);cur=f+(t-f)*(1-Math.pow(1-p,3));$('gain').textContent=fm(cur);if(p<1)requestAnimationFrame(a)})(t0)}
['rev','pc','im'].forEach(function(i){$(i).addEventListener('input',calc)});calc();
$('cb').addEventListener('click',function(){$('m').value='I ran the Performance Check: revenue '+fm($('rev').value)+', prime cost '+$('pc').value+'%, target improvement '+$('im').value+' points. I would like to discuss it.';$('a').selectedIndex=0;$('i').selectedIndex=0});
})();
