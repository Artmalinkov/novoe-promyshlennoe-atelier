const compareFrame=document.querySelector('.compare-frame');
const compareRange=document.querySelector('#thermal-range');
function setComparison(value){
  const split=Math.max(0,Math.min(100,Number(value)));
  compareFrame.style.setProperty('--split',split+'%');
  compareRange.value=String(split);
  compareRange.setAttribute('aria-valuetext','Слева без термочехлов: '+Math.round(split)+'%. Справа в термочехлах: '+Math.round(100-split)+'%.');
}
compareRange.addEventListener('input',()=>setComparison(compareRange.value));
document.querySelectorAll('[data-split]').forEach(button=>button.addEventListener('click',()=>setComparison(button.dataset.split)));
let dragging=false;
function pointerPosition(e){const rect=compareFrame.getBoundingClientRect();setComparison((e.clientX-rect.left)/rect.width*100)}
compareFrame.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;compareFrame.setPointerCapture(e.pointerId);pointerPosition(e)});
compareFrame.addEventListener('pointermove',e=>{if(dragging)pointerPosition(e)});
function endDrag(){dragging=false}
compareFrame.addEventListener('pointerup',endDrag);
compareFrame.addEventListener('pointercancel',endDrag);
compareFrame.addEventListener('lostpointercapture',endDrag);
setComparison(50);
