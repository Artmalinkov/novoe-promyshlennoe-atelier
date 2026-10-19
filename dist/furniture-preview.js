(()=>{'use strict';
const root=document.querySelector('#furniture-preview');if(!root)return;
const $=s=>root.querySelector(s),tabs=[...root.querySelectorAll('[data-furniture]')];
const models={
home:{caption:'01 / ДОМАШНЯЯ МЕБЕЛЬ',mood:'УЮТ В ДЕТАЛЯХ',title:'Диван и кресло',description:'Мягкая группа в просторной гостиной. Светлая ткань объединяет диван и кресло, а боковой ракурс показывает объём подлокотников, подушек и спинки.',material:'Светлый серый',texture:'Выраженное тканевое плетение',color:'#b7b5af',alt:'Светло-серые диван и кресло в просторной гостиной, левый край группы ближе к зрителю',parts:['Спинки и подушки','Сиденья','Подлокотники'],benefitTitle:'Обивка, которая раскрывает форму'},
office:{caption:'02 / ОФИСНАЯ МЕБЕЛЬ',mood:'ЕДИНЫЙ СТИЛЬ ОФИСА',title:'Руководителю и команде',description:'Высокое кресло руководителя по центру и два более простых кресла для сотрудников по сторонам. Современный офис на заднем плане подчёркивает назначение группы.',material:'Графит и светлый серый',texture:'Фактурная ткань двух оттенков',color:'#515353',alt:'Кресло руководителя по центру, простые кресла сотрудников слева и справа в современном офисе; левый край ближе',parts:['Обивка спинок','Чехлы сидений','Мягкие накладки подлокотников'],benefitTitle:'Разные кресла. Единый язык.'},
restaurant:{caption:'03 / МЕБЕЛЬ ДЛЯ РЕСТОРАНОВ',mood:'АТМОСФЕРА ГОСТЕПРИИМСТВА',title:'Банкетка и стулья',description:'Банкетка с мягкими вертикальными секциями и два банкетных стула по краям. Тёплая терракотовая ткань связывает комплект с праздничным интерьером зала.',material:'Терракота',texture:'Мягкая фактурная ткань',color:'#b76d50',alt:'Терракотовая банкетка с банкетными стульями по краям в праздничном банкетном зале, левый край ближе к зрителю',parts:['Секции спинки банкетки','Сиденья','Обивка спинок стульев'],benefitTitle:'Детали, из которых складывается зал'}
};
const closeups={
home:[
 {title:'Посадка по форме',text:'Округлый подлокотник: крой повторяет объём, а линия соединения подчёркивает силуэт.',point:[23,61]},
 {title:'Фактура ткани',text:'Плетение и оттенок задают характер домашней мебели. Рассмотрите ткань и соединение подушек вблизи.',point:[44,58]},
 {title:'Кант и соединения',text:'Тонкий кант выделяет край подушки. Его линия связывает сиденье с округлой формой кресла.',point:[83,54]}
],
office:[
 {title:'Крой спинки',text:'Профильные панели и боковые участки обивки следуют форме высокой спинки кресла руководителя.',point:[47,32]},
 {title:'Сиденье в деталях',text:'Светлая ткань и обработка округлого края на рабочем кресле. Материал для заказа подбирается с учётом нагрузки и ухода.',point:[24,57]},
 {title:'Мягкий подлокотник',text:'Тканевая накладка повторяет изгиб опоры. В крупном плане видны соединение деталей и посадка по контуру.',point:[45,43]}
],
restaurant:[
 {title:'Секции банкетки',text:'Вертикальные мягкие панели создают ритм спинки. Важны направление ткани и линия соединения секций.',point:[48,39]},
 {title:'Обивка стула',text:'Ткань огибает округлую спинку банкетного стула. Один оттенок помогает объединить разные изделия комплекта.',point:[13,42]},
 {title:'Край сиденья',text:'Кант и соединение верхней и боковой панелей подчёркивают форму банкетки и завершают общий образ.',point:[39,69]}
]};
const detailPanel=$('#furniture-detail'),detailImage=$('#furniture-detail-image'),detailStatus=$('#furniture-detail-status'),points=$('#furniture-points');
const detailControls=[0,1,2].flatMap(i=>[$('#point-'+i),$('#feature-'+i)]);
let current='home',selected=null,lastTrigger=null,detailRequest=0,sceneReady=false;
function updatePressed(){detailControls.forEach(button=>{const active=Number(button.dataset.point)===selected;button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-expanded',String(active))})}
function closeDetail(restore=false){detailRequest++;selected=null;detailPanel.hidden=true;detailPanel.setAttribute('aria-busy','false');updatePressed();if(restore&&lastTrigger)lastTrigger.focus();lastTrigger=null}
function enablePoints(ready){sceneReady=ready;points.hidden=!ready;detailControls.forEach(button=>button.disabled=!ready)}
function showDetail(index,trigger){
 if(!sceneReady||!closeups[current][index])return;
 const detail=closeups[current][index],ticket=++detailRequest,key=current+'-'+index,url='assets/furniture/details/'+key+'-embroidery.webp';
 selected=index;lastTrigger=trigger;updatePressed();
 $('#furniture-detail-number').textContent='ДЕТАЛЬ 0'+(index+1);$('#furniture-detail-title').textContent=detail.title;$('#furniture-detail-text').textContent=detail.text;
 detailPanel.hidden=false;detailPanel.setAttribute('aria-busy','true');detailImage.hidden=true;detailStatus.hidden=false;detailStatus.textContent='Загружаем крупный план…';
 const next=new Image();next.onload=()=>{if(ticket!==detailRequest)return;detailImage.src=url;detailImage.alt=detail.title+' — '+models[current].title;detailImage.hidden=false;detailStatus.hidden=true;detailPanel.setAttribute('aria-busy','false');if(window.matchMedia('(max-width: 700px)').matches)detailPanel.scrollIntoView({block:'nearest',behavior:'auto'})};next.onerror=()=>{if(ticket!==detailRequest)return;detailStatus.textContent='Крупный план не загрузился. Выберите деталь ещё раз.';detailPanel.setAttribute('aria-busy','false')};next.src=url;
 if(window.matchMedia('(max-width: 700px)').matches)detailPanel.scrollIntoView({block:'nearest',behavior:'auto'});
}
detailControls.forEach(button=>button.addEventListener('click',()=>showDetail(Number(button.dataset.point),button)));
$('#close-furniture-detail').addEventListener('click',()=>closeDetail(true));
root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!detailPanel.hidden){event.preventDefault();closeDetail(true)}});
const keys=[...Object.keys(models),'hotel'],image=$('#furniture-image'),media=$('#furniture-media'),status=$('#furniture-status'),full=$('#full-model');let request=0;
function select(key,focus=false){
 if(!keys.includes(key))return;
 const ticket=++request;current=key;closeDetail();enablePoints(false);
 tabs.forEach(tab=>{const active=tab.dataset.furniture===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus()});
 const hotel=key==='hotel';$('#furniture-panel').hidden=hotel;$('#hotel-panel').hidden=!hotel;
 if(hotel)return;
 const model=models[key],url='assets/furniture/'+key+'-interior.webp';
 $('#furniture-panel').setAttribute('aria-labelledby','tab-'+key);
 $('#furniture-caption').textContent=model.caption;$('#model-mood').textContent=model.mood;$('#model-title').textContent=model.title;$('#model-description').textContent=model.description;
 $('#material-name').textContent=model.material;$('#material-description').textContent=model.texture;$('#material-chip').style.backgroundColor=model.color;
 $('#furniture-parts').innerHTML=model.parts.map(part=>'<li>'+part+'</li>').join('');
 $('#benefit-title').textContent=model.benefitTitle;
 closeups[key].forEach((detail,i)=>{const point=$('#point-'+i);point.style.left=detail.point[0]+'%';point.style.top=detail.point[1]+'%';point.setAttribute('aria-label','0'+(i+1)+'. '+detail.title);$('#feature-title-'+i).textContent=detail.title;$('#feature-text-'+i).textContent=detail.text});
 media.setAttribute('aria-busy','true');status.hidden=false;status.textContent='Готовим образец…';full.hidden=true;
 const next=new Image();
 next.onload=()=>{if(ticket!==request)return;image.src=url;image.alt=model.alt;image.hidden=false;media.setAttribute('aria-busy','false');status.hidden=true;full.href=url;full.hidden=false;enablePoints(true)};
 next.onerror=()=>{if(ticket!==request)return;image.hidden=true;media.setAttribute('aria-busy','false');status.hidden=false;status.textContent='Изображение не загрузилось. Выберите другую категорию или обновите страницу.'};
 next.src=url;
}
tabs.forEach(tab=>{tab.addEventListener('click',()=>select(tab.dataset.furniture));tab.addEventListener('keydown',event=>{const at=keys.indexOf(tab.dataset.furniture);let next;if(event.key==='ArrowRight')next=keys[(at+1)%keys.length];else if(event.key==='ArrowLeft')next=keys[(at+keys.length-1)%keys.length];else if(event.key==='Home')next=keys[0];else if(event.key==='End')next=keys[keys.length-1];else return;event.preventDefault();select(next,true)})});
select(window.location?.hash==='#hotel'?'hotel':'home');
})();
