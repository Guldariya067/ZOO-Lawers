"use strict";
const law="https://adilet.zan.kz/rus/docs/Z2100000097", code="https://adilet.zan.kz/rus/docs/K1400000235";
const scenarios={
walk:{title:"Выгул питомца",questions:[{label:"Относится ли животное к категории особой ответственности?", options:[["yes","Да"],["no","Нет"],["unknown","Не знаю"]]},{label:"Где происходит выгул?",options:[["public","Общественное место"],["private","Огороженная территория, используемая на законном основании"],["unknown","Не уверен"]]},{label:"Поводок и намордник используются?",options:[["yes","Оба используются"],["no","Один или оба отсутствуют"],["unknown","Не знаю"]]},{label:"Возраст сопровождающего",options:[["young","Младше 16 лет"],["older","16 лет или старше"],["unknown","Не знаю"]]}]},
care:{title:"Содержание дома",questions:[{label:"Обеспечены ли подходящие условия содержания?",options:[["yes","Да"],["no","Нет"],["unknown","Не уверен"]]},{label:"Проверены ли требования к учёту животного?",options:[["yes","Да"],["no","Нет"],["unknown","Не знаю"]]},{label:"Есть ли жалобы соседей?",options:[["yes","Да"],["no","Нет"],["unknown","Не знаю"]]}]},
noise:{title:"Шум и соседи",questions:[{label:"Когда возникает шум?",options:[["night","Между 22:00 и 09:00"],["day","В другое время"],["unknown","Не знаю"]]},{label:"Мешает ли шум отдыху соседей?",options:[["yes","Да"],["no","Нет"],["unknown","Неясно"]]},{label:"Ситуация повторяется?",options:[["yes","Да"],["no","Нет"],["unknown","Не знаю"]]}]}};
const type=document.querySelector('#scenario'), questions=document.querySelector('#questions'), result=document.querySelector('#result'), error=document.querySelector('#error'), progress=document.querySelector('#progress'), count=document.querySelector('#count');
if(type){
function update(){const all=[...questions.querySelectorAll('select')];const n=all.filter(s=>s.value).length;progress.style.width=(all.length?(1+n)/(1+all.length)*100:0)+'%';count.textContent=all.length?`Заполнено ${n} из ${all.length} уточнений`:'Выберите ситуацию';}
function render(){questions.replaceChildren();result.hidden=true;error.hidden=true;const s=scenarios[type.value];if(s)s.questions.forEach((q,i)=>{const div=document.createElement('div');div.className='question';const label=document.createElement('label');label.htmlFor='q'+i;label.textContent=q.label;const sel=document.createElement('select');sel.id='q'+i;sel.setAttribute('aria-required','true');sel.add(new Option('Выберите ответ',''));q.options.forEach(([v,t])=>sel.add(new Option(t,v)));sel.addEventListener('change',()=>{update();result.hidden=true;error.hidden=true});div.append(label,sel);questions.append(div)});update()}
function evaluate(kind,a){let status='Проверьте дополнительные условия',items=[],source=law,ref='Закон № 97-VII';const unsure=a.includes('unknown');if(kind==='walk'){ref+=' · ст. 22';if(a[0]==='yes'&&(a[3]==='young'||(a[1]==='public'&&a[2]==='no'))){status='Возможное несоответствие требованиям';items.push('Для животных особой ответственности предусмотрены ограничения по возрасту сопровождающего и использованию поводка и намордника.');}else if(unsure){status='Недостаточно данных';items.push('Уточните категорию животного, место выгула и остальные обстоятельства.');}else if(a[0]==='yes'&&a[1]==='private'){status='Проверьте условия исключения';items.push('Для законно используемой огороженной территории предусмотрено исключение из требования о поводке и наморднике. Возрастное ограничение следует учитывать отдельно.');}else{status='По указанным условиям явный риск не выявлен';items.push('Проверьте дополнительные местные требования: разрешённые места и порядок выгула.');}items.push('При установленном нарушении требований к содержанию или выгулу может применяться ст. 407-2 КоАП РК. По ч. 1 пп. 4 для физлица предусмотрено 10 МРП; применимость зависит от обстоятельств.');}else if(kind==='care'){ref+=' · ст. 10, 11, 21';status=a[0]==='no'?'Есть повод проверить условия содержания':unsure?'Недостаточно данных':a[1]==='no'||a[2]==='yes'?'Есть дополнительные вопросы':'По ответам явный риск не выявлен';items.push(a[0]==='no'?'Проверьте условия содержания и необходимые меры ухода.':'Соблюдайте общие требования к содержанию питомца.');items.push(a[1]==='yes'?'Сохраняйте сведения об учёте при необходимости.':'Уточните правила учёта для вашего животного.');items.push(a[2]==='yes'?'Обсудите конкретную причину жалобы и возможное решение с соседями.':'Учитывайте права и законные интересы других жильцов.');}else{source=code;ref='КоАП РК · ст. 437';status=a[0]==='night'&&a[1]==='yes'?'Следует проверить норму о тишине':unsure?'Недостаточно данных':'Автоматический вывод о нарушении невозможен';items.push('Статья 437 касается нарушения тишины; сам факт лая не определяет юридическую ответственность.');items.push(a[2]==='yes'?'При повторяющемся шуме обсудите с соседями время и обстоятельства, при необходимости обратитесь за официальным разъяснением.':'Попробуйте спокойно обсудить ситуацию и уточнить её обстоятельства.');}return {status,items,source,ref};}
document.querySelector('#calculate').addEventListener('click',()=>{const a=[...questions.querySelectorAll('select')].map(x=>x.value);if(!type.value||a.some(x=>!x)){error.textContent='Выберите ситуацию и ответьте на все вопросы.';error.hidden=false;result.hidden=true;return}error.hidden=true;const r=evaluate(type.value,a);document.querySelector('#status').textContent=r.status;const ul=document.querySelector('#advice');ul.replaceChildren();r.items.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.append(li)});const link=document.querySelector('#result-source');link.href=r.source;link.textContent=r.ref;result.hidden=false;result.scrollIntoView({block:'nearest',behavior:'smooth'});});type.addEventListener('change',render);document.querySelector('#reset').addEventListener('click',()=>{type.value='';render();type.focus()});document.querySelector('#print').addEventListener('click',()=>window.print());const preset=new URLSearchParams(location.search).get('case');if(Object.hasOwn(scenarios,preset))type.value=preset;render();}
const filters=document.querySelectorAll('[data-filter]');filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));let n=0;document.querySelectorAll('[data-topic]').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.topic!==btn.dataset.filter;if(!card.hidden)n++});document.querySelector('#filter-count').textContent=`Материалов: ${n}`;}));


// Four original designs, shared by all three pages.
(() => {
  const themes = {
    emerald: ['Emerald', 'Право с заботой'],
    navy: ['Legal Blue', 'Понятные правила для каждого'],
    terracotta: ['Warm Paws', 'Дома, во дворе, в городе'],
    graphite: ['Night Edition', 'Забота. Ответственность. Закон.']
  };
  const valid = key => Object.hasOwn(themes, key);
  const picker = document.querySelector('#theme-select');
  const key = 'zoo-lawyers-theme';
  let stored;
  try { stored = localStorage.getItem(key); } catch (_) {}
  const requested = new URLSearchParams(location.search).get('theme');
  function apply(value) {
    if (!valid(value)) value = 'emerald';
    document.documentElement.dataset.theme = value;
    if (picker) picker.value = value;
    const eyebrow = document.querySelector('#theme-eyebrow');
    const heading = document.querySelector('#theme-heading');
    if (eyebrow) eyebrow.textContent = 'Правовой гид · ' + themes[value][0];
    if (heading) heading.textContent = themes[value][1];
    try { localStorage.setItem(key, value); } catch (_) {}
    // Carry theme between local HTML files even when localStorage is blocked.
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!/^(index|assistant|guide)\.html(?:[?#]|$)/.test(href)) return;
      const [beforeHash, hash] = href.split('#');
      const [path, query] = beforeHash.split('?');
      const params = new URLSearchParams(query || '');
      params.set('theme', value);
      a.setAttribute('href', path + '?' + params.toString() + (hash === undefined ? '' : '#' + hash));
    });
    try {
      const url = new URL(location.href);
      url.searchParams.set('theme', value);
      history.replaceState(null, '', url);
    } catch (_) {}
  }
  apply(valid(requested) ? requested : valid(stored) ? stored : 'emerald');
  if (picker) picker.addEventListener('change', () => apply(picker.value));
})();
