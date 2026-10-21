(() => {
'use strict';
const root = document.querySelector('#sewing');
if (!root) return;
const products = [
['Шторы и завесы','Для помещений, рабочих зон и текстильных перегородок.', '<path class="metal" d="M25 31h170"/><circle class="metal" cx="25" cy="31" r="4"/><circle class="metal" cx="195" cy="31" r="4"/><path class="cloth" d="M36 39h65q-5 52-33 72l-5 62q-16-8-31 0l9-63Z"/><path class="cloth" d="M119 39h65l-5 71 9 63q-18-8-33 0l-5-62q-26-20-31-72Z"/><path class="shade" d="M43 42q8 44 11 65l-13 58 8-60Zm25 0q-2 46-12 65l-2 60 9-58q18-29 16-67Zm62 0q6 47 26 65l8 62 3-6-7-59q-11-36-11-62Zm38 0q-5 42-1 64l12 61-5-60 4-65Z"/><path class="fine" d="M51 42q3 43 3 61m9-61q-1 40-8 63m29-63q-4 42-20 65m66-65q5 41 24 64m7-64q-1 38 5 64M34 166q14-7 27 0m96 0q14-7 28 0"/><path class="trim" d="m38 109 31 2m81 0 30-2"/><path class="stitch" d="M38 44h57m30 0h54M36 169q12-6 23 0m101 0q11-6 22 0"/>'],
['Брезентовые чехлы','Чехлы по форме оборудования, инвентаря и отдельных узлов.', '<path class="cloth" d="M35 74q1-8 9-11l77-27q6-2 12 1l48 27q7 4 7 12l-4 94-83 25-65-33Z"/><path class="side" d="m101 100 87-29-4 99-83 25Z"/><path class="light" d="m39 69 83-28 59 29-80 26Z"/><path class="shade" d="m42 83 8 60 14 23-5-46Zm42 13 9 6-4 70-5 10Zm31 10 6 56-12 22 5-36Zm56-24-8 59 9 22 5-45Z"/><path class="fine" d="m49 86 7 48m12-32 8 55m36-44 5 22m50-40-6 41m-33 11 22-7M41 154l58 30 79-23"/><path class="stitch" d="m43 72 58 31 79-26M98 104v78M42 159l57 29 80-23"/><path class="trim" d="m59 154-1 18m97-14-1 17"/><rect class="metal" x="53" y="164" width="10" height="8" rx="2"/><rect class="metal" x="149" y="168" width="10" height="8" rx="2"/><path class="tag" d="m116 112 24-7v13l-24 7Z"/><path class="fine" d="m121 117 13-4"/>'],
['Накидки','Текстильные накидки для укрытия изделий на время хранения.', '<path class="cloth" d="M69 33q24-10 68-3l12 66q5 12 24 30l20 34q-14 5-27 2l-20 14q-12-1-22-8-18 10-32 5l-23 11q-13-3-27 1l-12-16 28-60Z"/><path class="light" d="M72 36q25-7 61-3l-9 61q-20 8-40 0Z"/><path class="shade" d="m69 43 15 51-17 66-15 15 13-51Zm67-9-12 60 23 62 16 8-24-60Zm-52 62 8 55-22 24 16-6 17-22Zm39-1-8 50 18 22 12 5-20-34Z"/><path class="fine" d="m77 44 7 40m46-40-6 40m-57 34-10 39m31-47 6 23m36-22 8 31m20-10 19 23M37 169q13-2 17 6l20-10q15 7 26-5 13 4 23-3 16 12 23 8l17-12q12 5 24 3"/><path class="stitch" d="M76 38q23-6 53-2M36 175q11-3 18 5l20-9q15 6 27-6l22-3 23 9 17-12 23 2"/><path class="tag" d="m148 139 16-7 6 10-16 8Z"/>'],
['Тенты и пологи','Укрывные полотна по размерам, с креплениями под вашу задачу.', '<path class="cloth" d="m26 96 91-51q5-3 10 1l70 71-101 51Z"/><path class="side" d="m26 96 70 72-2 10-70-72Zm72 72 99-51-2 9-101 52Z"/><path class="light" d="m33 96 86-46-23 110Z"/><path class="shade" d="m122 52-14 95 10-13 9-66Zm-34 62-15 14 19 29Z"/><path class="fine" d="m47 99 41 47m43-80 45 47m-49-18 9 40m-58-18 15 26"/><path class="stitch" d="m33 97 86-46 69 66-91 45ZM121 53 97 158"/><path class="trim" d="m26 101-12 64m81 9-5 29m105-81 9 51"/><g class="metal"><circle cx="34" cy="101" r="4"/><circle cx="96" cy="163" r="4"/><circle cx="187" cy="118" r="4"/><circle cx="119" cy="53" r="3"/></g><path class="fine" d="m11 166 8 1m67 36 8 1m106-30 8-1"/>'],
['Сумки и кофры','Для хранения и переноски инструмента, приборов и комплектующих.', '<path class="trim" d="m78 84-3-38q21-20 48-8l13 36m-48 6-3-30q15-11 29-5l12 31"/><path class="cloth" d="m34 94 124-22q13-1 21 13l18 23-8 64-124 25-30-33Z"/><path class="side" d="m35 98 31 31-1 68-30-33Zm31 31 131-21-8 64-124 25Z"/><path class="light" d="m40 95 117-18 32 30-121 18Z"/><path class="shade" d="m72 135 10 48 92-18-95 10Zm96-20 10 38 6-42Z"/><path class="trim" d="m61 91 25 29-4 68m58-111 26 31-5 68"/><path class="cloth" d="m97 138 50-9-3 32-48 9Z"/><path class="stitch" d="m41 101 24 27 124-19M71 136l-1 52 113-22m-82-23 41-8-2 22-38 8Z"/><path class="metal" d="m70 123 9-2 3 7-9 2Zm89-16 9-1 4 7-9 2Z"/><path class="tag" d="m108 143 25-4v10l-25 5Z"/><path class="fine" d="m114 147 12-2m-72-14-1 25"/>'],
['Рукавицы и перчатки','Форму, материал и назначение уточняем при обсуждении заказа.', '<g transform="rotate(-12 75 110)"><path class="cloth" d="M43 180v-60L29 94q-6-13 4-16 6-2 12 9l9 12-3-53q0-14 10-12 6 1 6 12l4 41 2-63q1-12 10-9 5 2 5 12l1 59 7-61q2-11 10-6 5 3 3 14l-4 56 12-43q4-11 11-5 4 4 0 15l-13 61 2 58Z"/><path class="side" d="m48 122 11 16 3 35-16 2Zm53-27 4 65 8 12-1-51 11-60-5 14Z"/><path class="fine" d="m60 51 4 43m16-63 1 61m20-58-4 58m22-30-12 40M63 115q21-13 38 1l-2 34-33 3Z"/><path class="stitch" d="M49 126v45l59-3M69 119q14-8 27 0v26l-24 3Z"/><path class="trim" d="M44 167h72v15H44Z"/><path class="fine" d="M50 173h59m-59 4h59"/></g><g transform="rotate(17 164 135)"><path class="cloth" d="m144 184-3-45-13-19q-7-13 3-16 6-1 14 11l1-35q0-22 18-22 24 0 24 26l-1 54-6 47Z"/><path class="shade" d="m171 65 7 28-3 62 9 7 3-77q0-15-16-20Z"/><path class="fine" d="m153 80 1 43m9-48 2 47m-16 10 23 1"/><path class="trim" d="M143 170h40v15h-40Z"/><path class="stitch" d="m148 164 2-28-12-18m8 57h33"/></g>']
];

const container = root.querySelector('.sewing-items');
const buttons = [];
products.forEach(([title, description, drawing], i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sewing-item';
  button.setAttribute('aria-pressed', 'false');
  button.style.setProperty('--i', i);
  button.innerHTML = `<span class="sewing-drawing"><svg viewBox="0 0 220 210" aria-hidden="true"><defs><linearGradient id="sewing-fabric-${i}" x1="0" y1="0" x2="1" y2=".5"><stop stop-color="#f4ede0"/><stop offset=".35" stop-color="#d4c3a6"/><stop offset=".52" stop-color="#f7f1e8"/><stop offset="1" stop-color="#b8a487"/></linearGradient></defs>${drawing}</svg></span><span class="sewing-label">${title}</span>`;
  button.querySelectorAll('.cloth').forEach(el => el.style.fill = `url(#sewing-fabric-${i})`);
  const select = () => {
    buttons.forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    root.querySelector('.sewing-number').textContent = `${i + 1} / 6`;
    root.querySelector('.sewing-title').textContent = title;
    root.querySelector('.sewing-description').textContent = description;
  };
  button.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') select(); });
  button.addEventListener('focus', select);
  button.addEventListener('click', select);
  buttons.push(button);
  container.append(button);
});
buttons[0].click();
})();
