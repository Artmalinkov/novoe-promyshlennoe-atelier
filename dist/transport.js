(()=>{'use strict';
const root=document.querySelector('#transport');if(!root)return;const $=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
const viewport=$('#viewport'),photo=$('#seat-image'),dress=$('#dress-scene'),hotspots=$('#hotspots');
const order=[0,1,2,5,4,3,6,7],views=order.map(i=>'assets/transport/views/seat-'+i+'.png');
const names=['Вид спереди','Спереди · ¾','Сбоку','Сзади · ¾','Вид сзади','Сзади · другой бок','Другой бок','Спереди · другой бок'];
const parts=['back','seat','head','arms','foot'].map(k=>$('#cover-'+k));
const partNames=['Спинка','Сиденье','Подголовник','Подлокотники','Опора для ног'];
const positions=[
{seam:[310,670],edge:[840,975],fit:[690,175],brand:[510,1290]},
{seam:[530,640],edge:[815,950],fit:[480,200],brand:[760,1240]},
{edge:[345,450],fit:[285,200]},
{seam:[410,780],edge:[510,340]},
{seam:[290,760],edge:[790,390]},
{seam:[660,750],edge:[540,350]},
{edge:[735,500],fit:[770,200]},
{seam:[590,640],edge:[250,935],fit:[640,205],brand:[280,1230]}
];
const details={
seam:{number:'01',title:'Точность в каждом соединении',text:'Строчка соединяет панели чехла и следует заданной форме. Рассмотрите линию шва и обработку стыка тканей.',alt:'Крупный план соединения серой и чёрной ткани'},
edge:{number:'02',title:'Аккуратный контур',text:'Кант подчёркивает изгиб изделия. Внимание к краям и углам складывается в общий вид чехла.',alt:'Оранжевый кант на изгибе чёрной ткани'},
fit:{number:'03',title:'Лекала учитывают форму',text:'Подголовник, боковая поддержка и сложные сопряжения требуют своей формы деталей. Чехол повторяет линии сиденья.',alt:'Чехол на подголовнике и плечевой части кресла'},
brand:{number:'04',title:'Детали вашего стиля',text:'Цвета, бирка и вышивка объединяют изделие в цельный образ. Однотонная вышивка сохраняет фактуру и спокойный характер ткани.',alt:'Серебристо-серая вышивка АМ на ткани'}
};
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
let phase='loading',frame=0,raf=0,elapsed=0,last=null,entered=false,rotationReady=false,drag=null,selected=null,lastTrigger=null,lastStep=-1;
const wrap=n=>(Math.round(n)%views.length+views.length)%views.length;
function pressed(){all('[data-detail]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.detail===selected)))}
function closeDetail(restore=false){selected=null;$('#detail-panel').hidden=true;pressed();if(restore&&lastTrigger&&typeof lastTrigger.focus==='function')lastTrigger.focus();lastTrigger=null}
function updatePoints(){all('.hotspot').forEach(p=>{const pos=positions[frame][p.dataset.detail];p.toggleAttribute('hidden',!pos);if(pos)p.setAttribute('transform','translate('+pos[0]+','+pos[1]+')')})}
function render(n){frame=wrap(n);photo.src=views[frame];photo.alt='Кресло Светлый графит. '+names[frame];$('#angle-label').textContent=names[frame];viewport.setAttribute('aria-valuenow',String(frame*45));viewport.setAttribute('aria-valuetext',names[frame]);updatePoints()}
function enable(){phase='complete';cancelAnimationFrame(raf);raf=0;dress.hidden=true;photo.hidden=false;photo.style.opacity='1';hotspots.hidden=false;$('#gesture-hint').hidden=!rotationReady;viewport.classList.toggle('ready',rotationReady);$('#scene-label').textContent='ЧЕХОЛ В ДЕТАЛЯХ';$('#seat-status').textContent=rotationReady?'Поверните кресло или выберите деталь.':'Выберите деталь на виде спереди.';$('#previous').disabled=!rotationReady;$('#next').disabled=!rotationReady;all('.features button').forEach(b=>{b.disabled=false});render(0)}
function tick(now){raf=0;if(phase!=='dressing')return;if(last!==null)elapsed+=Math.min(64,Math.max(0,now-last));last=now;const step=Math.min(4,Math.floor(Math.max(0,elapsed-600)/650));if(step!==lastStep){lastStep=step;$('#seat-status').textContent='Надеваем чехол: '+partNames[step].toLowerCase()+'.'}parts.forEach((p,i)=>{const t=Math.max(0,Math.min(1,(elapsed-600-i*650)/750)),ease=t*t*(3-2*t);p.setAttribute('opacity',String(ease));p.setAttribute('transform','translate(0,'+(-42*(1-ease))+')')});if(elapsed>=3350){photo.hidden=false;photo.src=views[0];photo.style.opacity=String(Math.min(1,(elapsed-3350)/600))}if(elapsed>=3950){enable();return}raf=requestAnimationFrame(tick)}
function start(){if(phase!=='waiting'||!entered||document.hidden)return;if(motion.matches){enable();return}phase='dressing';dress.hidden=false;photo.hidden=true;elapsed=0;last=null;raf=requestAnimationFrame(tick)}
function step(n){if(phase!=='complete'||!rotationReady)return;closeDetail();render(frame+n)}
function showDetail(key,trigger){if(phase!=='complete'||!details[key])return;if(!positions[frame][key])render(0);selected=key;lastTrigger=trigger;const d=details[key];$('#detail-number').textContent='ДЕТАЛЬ '+d.number;$('#detail-title').textContent=d.title;$('#detail-text').textContent=d.text;$('#detail-image').hidden=false;$('#detail-image').alt=d.alt;$('#detail-image').src='assets/transport/details/'+key+'.png';$('#detail-panel').hidden=false;pressed();if(window.matchMedia('(max-width: 760px)').matches&&typeof $('#detail-panel').scrollIntoView==='function')$('#detail-panel').scrollIntoView({block:'nearest',behavior:motion.matches?'auto':'smooth'})}
all('[data-detail]').forEach(b=>{b.addEventListener('click',()=>showDetail(b.dataset.detail,b));if(b.tagName.toLowerCase()==='g')b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();showDetail(b.dataset.detail,b)}})});
$('#close-detail').addEventListener('click',()=>closeDetail(true));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetail(true)});
$('#detail-image').addEventListener('error',()=>{$('#detail-image').hidden=true;$('#detail-text').textContent='Крупный план не загрузился. Обновите страницу, чтобы рассмотреть деталь.'});
$('#previous').addEventListener('click',()=>step(-1));$('#next').addEventListener('click',()=>step(1));
viewport.addEventListener('pointerdown',e=>{if(phase!=='complete'||!rotationReady||e.isPrimary===false||(e.pointerType==='mouse'&&e.button!==0)||e.target.closest('[data-detail]'))return;drag={id:e.pointerId,x:e.clientX,start:frame,step:Math.max(40,viewport.clientWidth/10)};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging')});
viewport.addEventListener('pointermove',e=>{if(drag&&drag.id===e.pointerId){closeDetail();render(drag.start+(drag.x-e.clientX)/drag.step)}});
function end(e){if(!drag||drag.id!==e.pointerId)return;drag=null;viewport.classList.remove('dragging');if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId)}
viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);viewport.addEventListener('lostpointercapture',()=>{drag=null;viewport.classList.remove('dragging')});
viewport.addEventListener('keydown',e=>{if(phase!=='complete'||!rotationReady)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowRight'?1:-1)}else if(e.key==='Home'){e.preventDefault();closeDetail();render(0)}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=null;drag=null;viewport.classList.remove('dragging')}else if(phase==='dressing'){raf=requestAnimationFrame(tick)}else start()});
if(typeof motion.addEventListener==='function')motion.addEventListener('change',()=>{if(motion.matches&&(phase==='waiting'||phase==='dressing'))enable()});window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;last=null});window.addEventListener('pageshow',()=>{if(phase==='dressing'&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);else start()});
function load(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(src));image.src=src})}
Promise.all([...views.map(load),load('assets/transport/frame.png')]).then(()=>{rotationReady=true;phase='waiting';$('#loading').hidden=true;dress.hidden=false;if(typeof IntersectionObserver==='function'){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){entered=true;observer.disconnect();start()}},{threshold:.25});observer.observe(viewport)}else{entered=true;start()}Object.keys(details).forEach(k=>load('assets/transport/details/'+k+'.png').catch(()=>{}))}).catch(()=>{load(views[0]).then(()=>{rotationReady=false;$('#loading').hidden=true;enable()}).catch(()=>{$('#loading').textContent='Не удалось загрузить кресло. Обновите страницу.'})});
})();
