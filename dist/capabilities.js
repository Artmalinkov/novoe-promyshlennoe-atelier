(() => {
  const zones={
    materials:{kicker:'МАТЕРИАЛ ПОД НАЗНАЧЕНИЕ',title:'С чего начинается изделие',description:'Подбираем материал под конструкцию и условия использования. Ткань, внутренние слои и фурнитура рассматриваются вместе.',benefit:'Состав изделия соответствует поставленной задаче.',note:'Здесь покажем реальное хранение тканей и фурнитуры.',image:'materials',alt:'Эскиз стеллажа с рулонами ткани'},
    cutting:{kicker:'ФОРМА НАЧИНАЕТСЯ С ЛЕКАЛ',title:'Раскрой под вашу модель',description:'Размеры и форма изделия переходят в лекала и детали кроя. Учитываем конструкцию, материал и соединение элементов.',benefit:'Основа для посадки чехла по форме изделия.',note:'Здесь покажем реальное раскройное место и детали в работе.',image:'cutting',alt:'Эскиз раскройного стола с материалом и лекалами'},
    sewing:{kicker:'ДЕТАЛИ СТАНОВЯТСЯ ИЗДЕЛИЕМ',title:'Пошив с учётом материала',description:'Выполняем пошив чехлов и элементов обивки. Способ соединения и обработку деталей обсуждаем с учётом материала и назначения изделия.',benefit:'Текстильная часть продумана как единая конструкция.',note:'Здесь покажем установленное оборудование и работу на нём.',image:'sewing',alt:'Условный эскиз промышленной швейной машины'},
    finished:{kicker:'ОТ ИЗДЕЛИЯ К КОМПЛЕКТУ',title:'Готовые изделия и комплектация',description:'В этом разделе предлагаем показать, как готовые изделия собираются в заказ, упаковываются и хранятся до передачи.',benefit:'Заказчик видит, что именно входит в его комплект.',note:'Размещение, упаковку и порядок комплектации уточним по фактической работе предприятия.',image:'finished',alt:'Эскиз упакованных изделий и сложенных текстильных деталей'}
  };
  const tabs=[...document.querySelectorAll('.zone-tabs [role="tab"]')];
  const points=[...document.querySelectorAll('.map-point')];
  const panel=document.querySelector('#zone-panel');
  function select(key){
    const zone=zones[key];if(!zone)return;
    tabs.forEach(tab=>{const selected=tab.dataset.zone===key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1});
    points.forEach(point=>point.setAttribute('aria-pressed',String(point.dataset.zone===key)));
    panel.setAttribute('aria-labelledby','zone-'+key);
    document.querySelector('.zone-kicker').textContent=zone.kicker;
    document.querySelector('#zone-title').textContent=zone.title;
    document.querySelector('#zone-description').textContent=zone.description;
    document.querySelector('#zone-benefit').textContent=zone.benefit;
    document.querySelector('#zone-photo-note').textContent=zone.note;
    const image=document.querySelector('#zone-image');image.src='assets/capabilities/'+zone.image+'.svg';image.alt=zone.alt;
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab.dataset.zone));
    tab.addEventListener('keydown',event=>{
      let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next===undefined)return;
      event.preventDefault();select(tabs[next].dataset.zone);tabs[next].focus();
    });
  });
  points.forEach(point=>point.addEventListener('click',()=>{select(point.dataset.zone);if(matchMedia('(max-width: 800px)').matches)panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}));
  select('cutting');
})();
