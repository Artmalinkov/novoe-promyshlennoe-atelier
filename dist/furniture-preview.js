(()=>{'use strict';
const root=document.querySelector('#furniture-preview');if(!root)return;
const $=s=>root.querySelector(s),tabs=[...root.querySelectorAll('[data-furniture]')];
const models={
hotel:{caption:'ДЛЯ ОТЕЛЕЙ',mood:'НОМЕР В ДЕТАЛЯХ',title:'Текстиль под задачи отеля',description:'Шьём обивку для кроватей, чехлы для матрасов и постельное бельё под ваши размеры и комплектацию. Помогаем подобрать материалы и согласовать оформление изделий для гостиничных номеров.',material:'Тёплый серый и белый',texture:'Фактурная обивка и светлое бельё',color:'#c4b8a5',alt:'Кровать с мягким светлым изголовьем и белым постельным бельём в гостиничном номере; левый край ближе, правый уходит в глубину',parts:['Обивка для кроватей','Чехлы для матрасов','Постельное бельё'],benefitTitle:'Ваши размеры. Нужная комплектация.'},
home:{caption:'ДОМАШНЯЯ МЕБЕЛЬ',mood:'УЮТ В ДЕТАЛЯХ',title:'Пошив под вашу модель',description:'Разрабатываем лекала, подбираем материалы, выполняем раскрой и пошив чехлов и деталей обивки. Учитываем форму вашей модели, чтобы текстильная часть поддерживала её дизайн.',material:'Светлый серый',texture:'Выраженное тканевое плетение',color:'#b7b5af',alt:'Светло-серые диван и кресло в просторной гостиной, левый край группы ближе к зрителю',parts:['Спинки и подушки','Сиденья','Подлокотники'],benefitTitle:'От замысла модели до готовых деталей'},
office:{caption:'ОФИСНАЯ МЕБЕЛЬ',mood:'ЕДИНЫЙ СТИЛЬ ОФИСА',title:'Обивка для рабочих пространств',description:'Шьём детали обивки для разных моделей офисных кресел. Учитываем конструкцию, назначение и требования к материалу; согласуем исполнение спинок, сидений и подлокотников для вашей линейки.',material:'Графит и светлый серый',texture:'Фактурная ткань двух оттенков',color:'#515353',alt:'Кресло руководителя по центру, простые кресла сотрудников слева и справа в современном офисе; левый край ближе',parts:['Обивка спинок','Чехлы сидений','Мягкие накладки подлокотников'],benefitTitle:'Конструкция, материал и отделка согласованы'},
restaurant:{caption:'МЕБЕЛЬ ДЛЯ РЕСТОРАНОВ',mood:'АТМОСФЕРА ГОСТЕПРИИМСТВА',title:'Единое исполнение для зала',description:'Шьём обивку для банкеток, стульев и другой мебели по вашим моделям. Помогаем согласовать ткани и отделку для всего комплекта, учитывая оформление заведения и требования к уходу.',material:'Терракота',texture:'Мягкая фактурная ткань',color:'#b76d50',alt:'Терракотовая банкетка с банкетными стульями по краям в праздничном банкетном зале, левый край ближе к зрителю',parts:['Секции спинки банкетки','Сиденья','Обивка спинок стульев'],benefitTitle:'Разные изделия — согласованные детали'}
};
const closeups={
hotel:[
 {title:'Обивка для кроватей',text:'Разрабатываем лекала и шьём элементы обивки по модели кровати. Согласуем материал, соединения и отделку, чтобы текстиль поддерживал оформление номера.',point:[28,17]},
 {title:'Чехлы для матрасов',text:'Шьём чехлы по заданным размерам. Конструкцию, материал и застёжку подбираем с учётом требований к использованию и обслуживанию.',point:[59,65]},
 {title:'Постельное бельё',text:'Комплектуем заказ под ваш номерной фонд: согласуем состав, размеры, ткань и оформление. Шьём нужные изделия в выбранном исполнении.',point:[65,45]}
],
home:[
 {title:'Лекала под вашу модель',text:'Разрабатываем крой под объём и изгибы мебели. Согласуем состав деталей, чтобы обивка соответствовала конструкции изделия.',point:[23,61]},
 {title:'Материал под замысел',text:'Помогаем подобрать ткань под дизайн и назначение мебели. Цвет, фактуру и требования к материалу обсуждаем до начала пошива.',point:[44,58]},
 {title:'Детали в едином стиле',text:'Согласуем канты, линии соединений и отделку. Выполняем пошив по выбранному исполнению, чтобы детали сочетались между собой.',point:[83,54]}
],
office:[
 {title:'Крой под конструкцию',text:'Разрабатываем лекала под форму спинки и её боковых элементов. Это позволяет учитывать особенности конкретной модели кресла.',point:[47,32]},
 {title:'Подбор под эксплуатацию',text:'Учитываем режим использования и требования к уходу при подборе материала. Свойства ткани сверяем с документацией выбранного исполнения.',point:[24,57]},
 {title:'Согласованное исполнение',text:'Обсуждаем крой, соединения и отделку мягких накладок. Поддерживаем выбранное оформление в деталях вашей мебельной линейки.',point:[45,43]}
],
restaurant:[
 {title:'Один стиль для комплекта',text:'Согласуем материалы, направление ткани и линии соединений. Так обивка разных предметов поддерживает общий замысел коллекции.',point:[48,39]},
 {title:'Пошив по вашей модели',text:'Разрабатываем лекала под форму спинок и сидений. Состав деталей и исполнение обсуждаем с производителем мебели до изготовления.',point:[13,42]},
 {title:'Продуманные края',text:'Подбираем исполнение канта и соединений под конструкцию изделия. Цвет ниток, отделку и другие детали согласуем для заказа.',point:[39,69]}
]};
const detailPanel=$('#furniture-detail'),detailImage=$('#furniture-detail-image'),detailStatus=$('#furniture-detail-status'),points=$('#furniture-points');
const detailControls=[0,1,2].flatMap(i=>[$('#point-'+i),$('#feature-'+i)]);
let current='home',selected=null,lastTrigger=null,detailRequest=0,sceneReady=false;
function updatePressed(){detailControls.forEach(button=>{const active=Number(button.dataset.point)===selected;button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-expanded',String(active))})}
function closeDetail(restore=false){detailRequest++;selected=null;detailPanel.hidden=true;detailPanel.setAttribute('aria-busy','false');updatePressed();if(restore&&lastTrigger)lastTrigger.focus();lastTrigger=null}
function enablePoints(ready){sceneReady=ready;points.hidden=!ready;detailControls.forEach(button=>button.disabled=!ready)}
function showDetail(index,trigger){
 if(!sceneReady||!closeups[current][index])return;
 const detail=closeups[current][index],ticket=++detailRequest,key=current+'-'+index,url='assets/furniture/details/'+key+(key==='hotel-2'?'-linen-selected.webp':current==='hotel'?'-embroidery-v2.webp':'-embroidery.webp');
 selected=index;lastTrigger=trigger;updatePressed();
 $('#furniture-detail-number').textContent='ДЕТАЛЬ '+(index+1);$('#furniture-detail-title').textContent=detail.title;$('#furniture-detail-text').textContent=detail.text;
 detailPanel.hidden=false;detailPanel.setAttribute('aria-busy','true');detailImage.hidden=true;detailStatus.hidden=false;detailStatus.textContent='Загружаем крупный план…';
 const next=new Image();next.onload=()=>{if(ticket!==detailRequest)return;detailImage.src=url;detailImage.alt=detail.title+' — '+models[current].title;detailImage.hidden=false;detailStatus.hidden=true;detailPanel.setAttribute('aria-busy','false');if(window.matchMedia('(max-width: 700px)').matches)detailPanel.scrollIntoView({block:'nearest',behavior:'auto'})};next.onerror=()=>{if(ticket!==detailRequest)return;detailStatus.textContent='Крупный план не загрузился. Выберите деталь ещё раз.';detailPanel.setAttribute('aria-busy','false')};next.src=url;
 if(window.matchMedia('(max-width: 700px)').matches)detailPanel.scrollIntoView({block:'nearest',behavior:'auto'});
}
detailControls.forEach(button=>button.addEventListener('click',()=>showDetail(Number(button.dataset.point),button)));
$('#close-furniture-detail').addEventListener('click',()=>closeDetail(true));
root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!detailPanel.hidden){event.preventDefault();closeDetail(true)}});
const keys=['home','office','restaurant','hotel'],image=$('#furniture-image'),media=$('#furniture-media'),status=$('#furniture-status'),full=$('#full-model');let request=0;
function select(key,focus=false){
 if(!keys.includes(key))return;
 const ticket=++request;current=key;closeDetail();enablePoints(false);
 tabs.forEach(tab=>{const active=tab.dataset.furniture===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus()});
 $('#furniture-panel').hidden=false;
 const model=models[key],url='assets/furniture/'+key+'-interior.webp';
 $('#furniture-panel').setAttribute('aria-labelledby','tab-'+key);
 $('#furniture-caption').textContent=model.caption;$('#model-mood').textContent=model.mood;$('#model-title').textContent=model.title;$('#model-description').textContent=model.description;
 $('#material-name').textContent=model.material;$('#material-description').textContent=model.texture;$('#material-chip').style.backgroundColor=model.color;
 $('#furniture-parts').innerHTML=model.parts.map(part=>'<li>'+part+'</li>').join('');
 $('#benefit-title').textContent=model.benefitTitle;
 const inquiry=$('#model-inquiry');inquiry.href='index.html?category='+(key==='hotel'?'hotel':'furniture')+'#request';inquiry.textContent=key==='hotel'?'Обсудить заказ для отеля ↗':'Обсудить мебельный заказ ↗';
 closeups[key].forEach((detail,i)=>{const point=$('#point-'+i);point.style.left=detail.point[0]+'%';point.style.top=detail.point[1]+'%';point.setAttribute('aria-label',(i+1)+'. '+detail.title);$('#feature-title-'+i).textContent=detail.title;$('#feature-text-'+i).textContent=detail.text});
 media.setAttribute('aria-busy','true');status.hidden=false;status.textContent='Готовим образец…';full.hidden=true;
 const next=new Image();
 next.onload=()=>{if(ticket!==request)return;image.src=url;image.alt=model.alt;image.hidden=false;media.setAttribute('aria-busy','false');status.hidden=true;full.href=url;full.hidden=false;enablePoints(true)};
 next.onerror=()=>{if(ticket!==request)return;image.hidden=true;media.setAttribute('aria-busy','false');status.hidden=false;status.textContent='Изображение не загрузилось. Выберите другую категорию или обновите страницу.'};
 next.src=url;
}
tabs.forEach(tab=>{tab.addEventListener('click',()=>select(tab.dataset.furniture));tab.addEventListener('keydown',event=>{const at=keys.indexOf(tab.dataset.furniture);let next;if(event.key==='ArrowRight')next=keys[(at+1)%keys.length];else if(event.key==='ArrowLeft')next=keys[(at+keys.length-1)%keys.length];else if(event.key==='Home')next=keys[0];else if(event.key==='End')next=keys[keys.length-1];else return;event.preventDefault();select(next,true)})});
select(window.location?.hash==='#hotel'?'hotel':'home');
})();
