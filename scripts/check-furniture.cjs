const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const base=path.resolve(__dirname,'../dist'),html=fs.readFileSync(path.join(base,'furniture.html'),'utf8'),code=fs.readFileSync(path.join(base,'furniture-preview.js'),'utf8');
const ids={},tabs=[],loads=[];const events={};
for(const [,tag,attrs] of html.matchAll(/<(\w+)([^>]*)>/g)){
 const id=/id="([^"]+)"/.exec(attrs);if(!id)continue;
 const key=/data-furniture="([^"]+)"/.exec(attrs),point=/data-point="([^"]+)"/.exec(attrs);
 const node={events:{},attrs:{},dataset:key?{furniture:key[1]}:point?{point:point[1]}:{},style:{},hidden:false,setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f},focus(){this.focused=true},scrollIntoView(){}};
 ids[id[1]]=node;if(key)tabs.push(node);
}
const root={querySelector:s=>ids[s.slice(1)],querySelectorAll:()=>tabs,addEventListener(k,f){events[k]=f}};
vm.runInNewContext(code,{document:{querySelector:()=>root},window:{matchMedia:()=>({matches:false})},Image:class{set src(url){assert(fs.existsSync(path.join(base,url)),url);this.url=url;loads.push(this)}}});
const image=ids['furniture-image'],panel=ids['furniture-panel'],status=ids['furniture-status'],full=ids['full-model'];
loads.at(-1).onload();assert(image.src.endsWith('home-interior.webp'));assert.equal(panel.attrs['aria-labelledby'],'tab-home');
tabs[1].events.click();const slow=loads.at(-1);assert.equal(ids['model-title'].textContent,'Обивка для рабочих пространств');
tabs[2].events.click();const fast=loads.at(-1);slow.onload();assert(image.src.endsWith('home-interior.webp'),'Ignore a late image from the previous category');fast.onload();assert(image.src.endsWith('restaurant-interior.webp'));assert.equal(full.href,image.src);assert(!full.hidden);
assert.equal(tabs.filter(t=>t.attrs['aria-selected']==='true').length,1);assert.equal(tabs.filter(t=>t.tabIndex===0).length,1);
const key=(tab,k)=>tab.events.keydown({key:k,preventDefault(){}});
key(tabs[2],'ArrowRight');loads.at(-1).onload();assert(!panel.hidden);assert(image.src.endsWith('hotel-interior.webp'));assert(tabs[3].focused);
key(tabs[3],'ArrowRight');loads.at(-1).onload();assert(image.src.endsWith('home-interior.webp'));assert(tabs[0].focused);
key(tabs[0],'End');loads.at(-1).onload();assert(image.src.endsWith('hotel-interior.webp'));
key(tabs[3],'Home');loads.at(-1).onload();assert(image.src.endsWith('home-interior.webp'));
key(tabs[0],'ArrowLeft');loads.at(-1).onload();assert(image.src.endsWith('hotel-interior.webp'));assert.equal(tabs[3].attrs['aria-selected'],'true');
tabs[1].events.click();loads.at(-1).onerror();assert(image.hidden);assert(!status.hidden);assert(status.textContent.includes('не загрузилось'));assert(full.hidden);
tabs[0].events.click();loads.at(-1).onload();assert(!image.hidden);assert(status.hidden);assert(!full.hidden);
// Detail selection is shared between hotspots and cards, and cannot leak across categories.
const detail=ids['furniture-detail'],detailImage=ids['furniture-detail-image'];
assert(!ids['furniture-points'].hidden);assert(!ids['point-0'].disabled);
ids['point-0'].events.click();assert(!detail.hidden);const firstDetail=loads.at(-1);
assert(firstDetail.url.endsWith('details/home-0-embroidery.webp'));assert.equal(ids['point-0'].attrs['aria-pressed'],'true');assert.equal(ids['feature-0'].attrs['aria-expanded'],'true');
ids['feature-1'].events.click();const nextDetail=loads.at(-1);firstDetail.onload();assert(detailImage.hidden,'Ignore a late detail image');nextDetail.onload();assert(detailImage.src.endsWith('home-1-embroidery.webp'));assert(!detailImage.hidden);
ids['close-furniture-detail'].events.click();assert(detail.hidden);assert(ids['feature-1'].focused);assert.equal(ids['point-1'].attrs['aria-pressed'],'false');
for(const [i,category] of ['home','office','restaurant','hotel'].entries()){
 tabs[i].events.click();assert(detail.hidden);assert(ids['furniture-points'].hidden);assert(ids['point-0'].disabled);loads.at(-1).onload();
 for(let n=0;n<3;n++){ids['point-'+n].events.click();assert(loads.at(-1).url.endsWith('details/'+category+'-'+n+(category==='hotel'&&n===2?'-linen-selected.webp':category==='hotel'?'-embroidery-v2.webp':'-embroidery.webp')));loads.at(-1).onload();assert(!detailImage.hidden)}
}
const old=loads.at(-1);tabs[0].events.click();old.onload();assert(detail.hidden,'Category change closes a detail');loads.at(-1).onload();
ids['feature-0'].events.click();const canceled=loads.at(-1);events.keydown({key:'Escape',preventDefault(){}});canceled.onload();assert(detail.hidden);assert(ids['feature-0'].focused);
ids['point-2'].events.click();loads.at(-1).onerror();assert(!ids['furniture-detail-status'].hidden);assert(detailImage.hidden);ids['point-2'].events.click();loads.at(-1).onload();assert(!detailImage.hidden);assert(ids['furniture-detail-status'].hidden);
for(const [,ref] of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^https?:/.test(ref))assert(fs.existsSync(path.join(base,ref.split(/[?#]/)[0])),ref);
assert.equal(tabs.length,4);
// Switching to the hotel scene cancels stale scene/detail callbacks and uses its own assets and inquiry.
tabs[0].events.click();const pendingScene=loads.at(-1),beforeHotel=loads.length;
tabs[3].events.click();assert.equal(loads.length,beforeHotel+1);const hotelScene=loads.at(-1);pendingScene.onload();assert(detail.hidden);assert(ids['point-0'].disabled);hotelScene.onload();assert(image.src.endsWith('hotel-interior.webp'));assert(!ids['point-0'].disabled);assert(ids['model-inquiry'].href.includes('category=hotel'));
assert.equal(tabs.filter(t=>t.attrs['aria-selected']==='true').length,1);assert.equal(tabs[3].tabIndex,0);
tabs[0].events.click();loads.at(-1).onload();ids['point-0'].events.click();const pendingDetail=loads.at(-1);tabs[3].events.click();pendingDetail.onload();assert(detail.hidden);
vm.runInNewContext(code,{document:{querySelector:()=>root},window:{location:{hash:'#hotel'},matchMedia:()=>({matches:false})},Image:class{set src(url){assert(fs.existsSync(path.join(base,url)),url);this.url=url;loads.push(this)}}});
assert(loads.at(-1).url.endsWith('hotel-interior.webp'));loads.at(-1).onload();assert(!panel.hidden);assert.equal(panel.attrs['aria-labelledby'],'tab-hotel');
for(const text of ['Обивка для кроватей','Чехлы для матрасов','Постельное бельё'])assert(code.includes("title:'"+text+"'"));
assert(ids['model-inquiry'].href==='index.html?category=hotel#request');
assert(!html.includes('<input'),'No pretend fabric selectors');
console.log('PASS: four interior scenes, twelve details including complete hotel linen set, hotel deep link and inquiry, pending-load cancellation, keyboard/focus, ARIA, error recovery and local resources.');
