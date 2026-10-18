const fs=require('fs'),vm=require('vm'),assert=require('assert');
const integrated=true,base=require('path').resolve(__dirname,'../dist');
const source=fs.readFileSync(base+(integrated?'/index.html':'/showcase.html'),'utf8');
const html=integrated?source.slice(source.indexOf('<article class="transport-showcase"'),source.indexOf('</article>',source.indexOf('<article class="transport-showcase"'))+10):source;
const code=fs.readFileSync(base+(integrated?'/transport.js':'/showcase.js'),'utf8');
const flush=()=>new Promise(r=>setImmediate(r));
async function setup({reduced=false,fail=[],observe=false}={}){
 const ids={},nodes=[],frames=new Map(),docEvents={},winEvents={},motionEvents={},loaded=[];let rafId=0,observer;
 function node(tag,attrs){const classes=new Set((/class="([^"]*)"/.exec(attrs)?.[1]||'').split(' '));return {style:{},tagName:tag,attrs:/\bhidden\b/.test(attrs)?{hidden:''}:{},events:{},dataset:{detail:/data-detail="([^"]+)"/.exec(attrs)?.[1]},hidden:/\bhidden\b/.test(attrs),disabled:/\bdisabled\b/.test(attrs),clientWidth:700,textContent:'',setAttribute(k,v){this.attrs[k]=v},toggleAttribute(k,on){if(on)this.attrs[k]='';else delete this.attrs[k];this[k]=on},addEventListener(k,f){this.events[k]=f},closest(s){return s==='[data-detail]'&&this.dataset.detail?this:null},focus(){this.focused=true},scrollIntoView(){this.scrolled=true},classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),toggle(k,on){on?classes.add(k):classes.delete(k)},contains:k=>classes.has(k)},setPointerCapture(id){this.capture=id},hasPointerCapture(id){return this.capture===id},releasePointerCapture(){this.capture=null}}}
 for(const m of html.matchAll(/<(\w+)([^>]*)>/g)){const n=node(m[1],m[2]);nodes.push(n);const id=/id="([^"]+)"/.exec(m[2]);if(id)ids[id[1]]=n}
 const points=nodes.filter(n=>n.tagName==='g'&&n.dataset.detail),buttons=nodes.filter(n=>n.tagName==='button'&&n.dataset.detail);
 const doc={hidden:false,querySelector:s=>s==='#transport'?doc:ids[s.slice(1)],querySelectorAll:s=>s==='.assembly-frame'?Object.entries(ids).filter(([id])=>id.startsWith('assembly-stage-')).map(([,n])=>n):s==='.hotspot'?points:s==='.features button'?buttons:s==='[data-detail]'?[...points,...buttons]:[],addEventListener(k,f){docEvents[k]=f}};
 const motion={matches:reduced,addEventListener(k,f){motionEvents[k]=f}},win={matchMedia:q=>q.includes('reduced-motion')?motion:{matches:false},location:{href:''},addEventListener(k,f){winEvents[k]=f}};
 const context={document:doc,window:win,Image:class{set src(v){assert(fs.existsSync(base+'/'+v),v);loaded.push(v);fail.some(x=>v.endsWith(x))?this.onerror():this.onload()}},requestAnimationFrame:f=>{frames.set(++rafId,f);return rafId},cancelAnimationFrame:i=>frames.delete(i)};
 if(observe)context.IntersectionObserver=class{constructor(f){observer=f}observe(){}disconnect(){}};
 if(!ids['request-form'])ids['request-form']={};ids['request-form'].elements=Object.fromEntries(['model','quantity','material','description','reply'].map(k=>[k,{value:''}]));ids['request-form'].reportValidity=()=>true;
 vm.runInNewContext(code,context);await flush();await flush();
 const tick=t=>{const pending=[...frames.values()];frames.clear();pending.forEach(f=>f(t))};
 return {ids,points,buttons,doc,docEvents,win,winEvents,motion,motionEvents,frames,loaded,tick,enter:(isIntersecting=true)=>observer([{isIntersecting}])};
}
(async()=>{
 for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g))assert(fs.existsSync(base+'/'+m[1].split('?')[0]),m[1]);
 assert(html.includes(integrated?'assets/transport/frame.png':'showcase-assets/frame.png'));assert(!html.includes('showcase-assets/base.png'));assert(html.includes('Обсудить вашу модель чехла.'));
 const s=await setup({observe:true}),{ids}=s,view=ids.viewport;
 assert(!ids['dress-scene'].hidden);assert(!Object.hasOwn(ids['dress-scene'].attrs,'hidden'));assert(ids['seat-image'].hidden);assert(ids.next.disabled);assert.equal(s.frames.size,0);
 s.enter();s.tick(0);s.tick(64);assert.equal(ids['dress-scene'].attrs['data-stage'],'0');assert(!ids['assembly-stage-0'].hidden);
 for(let t=128;t<=1024;t+=64)s.tick(t);
 assert.equal(ids['dress-scene'].attrs['data-stage'],'1');assert(!ids['assembly-stage-1'].hidden);assert(!Object.hasOwn(ids['assembly-stage-1'].attrs,'hidden'));assert(Object.hasOwn(ids['assembly-stage-0'].attrs,'hidden'));assert(ids['assembly-stage-2'].hidden);assert(ids.next.disabled);
 s.enter(false);assert.equal(s.frames.size,0);s.enter();assert.equal(s.frames.size,1);
 s.doc.hidden=true;s.docEvents.visibilitychange();assert.equal(s.frames.size,0);
 s.doc.hidden=false;s.docEvents.visibilitychange();const visitedStages=new Set([0,1]);for(let t=1088;t<=7900;t+=64){s.tick(t);visitedStages.add(Number(ids['dress-scene'].attrs['data-stage']));if(ids['dress-scene'].attrs['data-stage']==='5'&&!ids['dress-scene'].hidden)assert(ids.next.disabled)}assert.deepEqual([...visitedStages],[0,1,2,3,4,5]);
 assert(ids['dress-scene'].hidden);assert(!ids['seat-image'].hidden);assert(Object.hasOwn(ids['dress-scene'].attrs,'hidden'));assert(!Object.hasOwn(ids['hotspots'].attrs,'hidden'));assert(!ids.next.disabled);assert(s.buttons.every(b=>!b.disabled));
 const sequence=[];for(let i=0;i<8;i++){ids.next.events.click();sequence.push(Number(/seat-(\d)/.exec(ids['seat-image'].src)[1]))}assert.deepEqual(sequence,[1,2,5,4,3,6,7,0]);
 const key=k=>view.events.keydown({key:k,preventDefault(){}});key('Home');
 view.events.pointerdown({pointerId:1,clientX:300,pointerType:'mouse',button:0,target:view});view.events.pointermove({pointerId:1,clientX:160});assert(ids['seat-image'].src.endsWith('seat-2.png'));view.events.pointercancel({pointerId:1});assert(!view.classList.contains('dragging'));
 const brand=s.buttons.find(n=>n.dataset.detail==='brand');brand.events.click();assert(!ids['detail-panel'].hidden);assert(ids['seat-image'].src.endsWith('seat-0.png'));assert(ids['detail-image'].src.endsWith('brand.png'));assert.equal(brand.attrs['aria-pressed'],'true');
 s.docEvents.keydown({key:'Escape'});assert(ids['detail-panel'].hidden);assert(brand.focused);
 const point=s.points[0];point.events.keydown({key:'Enter',preventDefault(){},stopPropagation(){}});assert(!ids['detail-panel'].hidden);ids.next.events.click();assert(ids['detail-panel'].hidden);
 key('Home');view.events.pointerdown({pointerId:2,clientX:200,pointerType:'touch',target:point});assert(!view.classList.contains('dragging'));
 for(let i=0;i<4;i++)ids.next.events.click();assert(s.points.find(n=>n.dataset.detail==='brand').hidden);
 if(!integrated){const form=ids['request-form'];form.elements.model.value=' Кресло & A ';form.elements.description.value='Партия\nТкань #3';form.elements.reply.value='+7 900 000 00 00';form.reportValidity=()=>false;form.events.submit({preventDefault(){},currentTarget:form});assert.equal(s.win.location.href,'');form.reportValidity=()=>true;form.events.submit({preventDefault(){},currentTarget:form});const url=new URL(s.win.location.href);assert.equal(url.pathname,'mingaray26@yandex.ru');assert(url.searchParams.get('body').includes('Модель: Кресло & A'));assert(url.searchParams.get('body').includes('Ткань #3'));assert(ids['form-status'].textContent.includes('не отправлены'));}
 const reduced=await setup({reduced:true});assert(!reduced.ids['seat-image'].hidden);assert.equal(reduced.frames.size,0);
 const fallback=await setup({fail:['seat-3.png']});assert(!fallback.ids['seat-image'].hidden);assert(fallback.ids.next.disabled);assert(fallback.buttons.every(b=>!b.disabled));
 const failed=await setup({fail:['seat-0.png']});assert(failed.ids.loading.textContent.includes('Не удалось'));assert(failed.ids.next.disabled);assert(failed.buttons.every(b=>b.disabled));
 const changed=await setup();changed.motion.matches=true;changed.motionEvents.change();assert(!changed.ids['seat-image'].hidden);assert.equal(changed.frames.size,0);
 const cached=await setup();cached.winEvents.pagehide();assert.equal(cached.frames.size,0);cached.winEvents.pageshow();assert.equal(cached.frames.size,1);
 console.log('PASS: six fixed assembly states in order, final hold before rotation, pause offscreen, visibility pause, rotation/drag, details/keyboard/focus, inquiry, reduced motion, image failures and page restore.');
})().catch(e=>{console.error(e);process.exitCode=1});
