
/* ===================== helpers ===================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const money=n=>n.toLocaleString('ru-RU')+' \u20BD';
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem('vshop_'+k))??d}catch(e){return d}};
const save=(k,v)=>localStorage.setItem('vshop_'+k,JSON.stringify(v));
const param=n=>new URLSearchParams(location.search).get(n);
const byId=id=>PRODUCTS.find(p=>p.id===id);
const catName=id=>(SHOP.cats.find(c=>c[0]===id)||['',''])[1];

let cart=load('cart',[]);
let fav=load('fav',[]);
let cmp=load('cmp',[]);
let promo=load('promo',null);

/* ===================== icons ===================== */
const IC={
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.7-10-9.2C.4 8.2 2.3 4.5 6 4.5c2.2 0 3.7 1.2 4.6 2.7L12 9l1.4-1.8c.9-1.5 2.4-2.7 4.6-2.7 3.7 0 5.6 3.7 4 7.3C19.5 16.3 12 21 12 21z"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12l1.2 13.2a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8L6 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  cmp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21V5l6-2v18M9 21H3l6-8m6 8h6l-6-8"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  arrR:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>',
  truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M1.5 6h13v11h-13zM14.5 10h4l3 3.5V17h-7z"/><circle cx="6" cy="19" r="1.8"/><circle cx="17.5" cy="19" r="1.8"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2.8 20 6v6c0 5-3.4 8-8 9.2C7.4 20 4 17 4 12V6z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v5h-5"/></svg>',
  card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="9" width="18" height="4"/><path d="M5 13v8h14v-8M12 9v12M12 9s-4.5.2-5.5-2C5.8 5.4 7.4 4 9 4c2 0 3 2.5 3 5zm0 0s4.5.2 5.5-2C18.2 5.4 16.6 4 15 4c-2 0-3 2.5-3 5z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 3h4l1.5 5-2.5 2a14 14 0 0 0 6 6l2-2.5 5 1.5v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>',
  ruler:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="9" width="20" height="6" rx="1.5"/><path d="M6 9v3M10 9v2.5M14 9v3M18 9v2.5"/></svg>',
};

/* ===================== toast ===================== */
function toast(msg,type=''){
  const st=$('.toast-stack');
  const el=document.createElement('div');
  el.className='toast '+type;
  el.innerHTML=(type==='ok'?IC.check:type==='err'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/></svg>':IC.spark)+'<span>'+esc(msg)+'</span>';
  st.appendChild(el);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),320)},3200);
}

/* ===================== header ===================== */
function bindHeader(){
  const hdr=$('.hdr');
  if(hdr)addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>10),{passive:true});
  const burger=$('.burger'),mnav=$('#mnav');
  if(burger&&mnav){
    burger.addEventListener('click',()=>mnav.classList.add('open'));
    $('#mnav-close').addEventListener('click',()=>mnav.classList.remove('open'));
    $$('#mnav a').forEach(a=>a.addEventListener('click',()=>mnav.classList.remove('open')));
  }
  const sBtn=$('#search-btn'),sOv=$('#search-ov');
  if(sBtn&&sOv){
    sBtn.addEventListener('click',()=>{sOv.classList.add('open');$('#search-in').focus();renderSearch('')});
    sOv.addEventListener('click',e=>{if(e.target===sOv)sOv.classList.remove('open')});
    $('#search-close').addEventListener('click',()=>sOv.classList.remove('open'));
    $('#search-in').addEventListener('input',e=>renderSearch(e.target.value));
    addEventListener('keydown',e=>{if(e.key==='Escape')sOv.classList.remove('open')});
  }
  const totop=$('.totop');
  if(totop){addEventListener('scroll',()=>totop.classList.toggle('on',scrollY>700),{passive:true});
    totop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));}
}
function renderSearch(q){
  const box=$('#search-res');if(!box)return;
  q=q.trim().toLowerCase();
  const res=!q?PRODUCTS.slice(0,5).sort((a,b)=>b.rating-a.rating):PRODUCTS.filter(p=>(p.name+' '+catName(p.cat)).toLowerCase().includes(q)).slice(0,6);
  box.innerHTML=res.length?res.map(p=>`
    <a class="sres" href="product.html?id=${p.id}">
      <img src="assets/img/${p.img}" alt="">
      <div><b>${esc(p.name)}</b><span>${catName(p.cat)} · ${money(p.price)}</span></div>
      ${IC.arrR}
    </a>`).join('')
    :'<div class="sres-empty">Ничего не нашлось. Попробуйте «пальто» или «наушники».</div>';
}

/* ===================== badges ===================== */
function badges(){
  const c=$('#cart-count'),f=$('#fav-count'),m=$('#cmp-count');
  if(c){c.textContent=cart.reduce((s,i)=>s+i.qty,0);c.classList.toggle('on',cart.length>0)}
  if(f){f.textContent=fav.length;f.classList.toggle('on',fav.length>0)}
  if(m){m.textContent=cmp.length;m.classList.toggle('on',cmp.length>0)}
}

/* ===================== cart core ===================== */
function cartLine(p,size,color,engrave){
  return {id:p.id,qty:1,size:size||'',color:color||(p.colors[0]&&p.colors[0].name)||'',engrave:engrave||''};
}
const sameLine=(a,b)=>a.id===b.id&&a.size===b.size&&a.color===b.color&&a.engrave===b.engrave;
function addToCart(p,opts={}){
  const line=cartLine(p,opts.size,opts.color,opts.engrave);
  const ex=cart.find(i=>sameLine(i,line));
  if(ex)ex.qty+=opts.qty||1;else cart.push(line);
  save('cart',cart);badges();
  toast((opts.qty>1?'Добавлено ':'Добавлено в корзину: ')+p.name,'ok');
}
function cartCount(){return cart.reduce((s,i)=>s+i.qty,0)}
function cartSubtotal(){
  let s=0;
  cart.forEach(i=>{const p=byId(i.id);if(p)s+=p.price*i.qty});
  if(promo)s=Math.round(s*(100-promo.percent)/100);
  return s;
}
function setPromo(code){
  code=(code||'').trim().toUpperCase();
  if(!code){promo=null;save('promo',null);return}
  if(SHOP.promo&&code===SHOP.promo.code.toUpperCase()){
    promo={code,percent:SHOP.promo.percent};save('promo',promo);
    toast('Промокод применён: −'+SHOP.promo.percent+'%','ok');
  }else{toast('Промокод не найден','err')}
}

/* ===================== stars ===================== */
function stars(r,rv){
  const full=Math.round(r);
  let s='<span class="stars">';
  for(let i=1;i<=5;i++)s+=i<=full?IC.star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" style="opacity:.35"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  s+='<span class="rv">'+r.toFixed(1)+(rv?' · '+rv+' отзывов':'')+'</span></span>';
  return s;
}

/* ===================== product card ===================== */
function priceHtml(p){return money(p.price)+(p.old?'<span class="price-old">'+money(p.old)+'</span>':'')}
function cardHtml(p,cls=''){
  const style=SHOP.layout.cardStyle;
  const stock=p.stock?'<span><i class="stock-dot"></i>В наличии</span>':'<span><i class="stock-dot out"></i>Под заказ</span>';
  let tech='';
  if(style==='tech'&&p.specs){
    tech='<div class="pcard-tech">'+p.specs.slice(0,3).map(s=>'<span>'+esc(s[1])+'</span>').join('')+'</div>';
  }
  const quick=SHOP.layout.quickview?'<button class="pcard-quick" data-quick="'+p.id+'">Быстрый просмотр</button>':'';
  const cmpBtn=SHOP.layout.compare?'<button class="pcard-cmp'+(cmp.includes(p.id)?' active':'')+'" data-cmp="'+p.id+'" title="Сравнить">'+IC.cmp+'</button>':'';
  const badge=p.badge==='new'?'<span class="badge badge-new">New</span>':p.badge==='hit'?'<span class="badge badge-hit">Хит</span>':p.badge==='sale'?'<span class="badge badge-sale">−'+Math.round((1-p.price/p.old)*100)+'%</span>':'';
  return `<article class="pcard ${cls}" data-pid="${p.id}">
    <div class="pcard-media">
      ${badge?'<div class="pcard-badges">'+badge+'</div>':''}
      ${p.stock?'':'<div class="pcard-badges"><span class="badge badge-out">Под заказ</span></div>'}
      <button class="pcard-fav${fav.includes(p.id)?' active':''}" data-fav="${p.id}" title="В избранное">${IC.heart}</button>
      <a href="product.html?id=${p.id}" class="pcard-link"><img src="assets/img/${p.img}" alt="${esc(p.name)}" loading="lazy"></a>
      ${cmpBtn}${quick}
    </div>
    <div class="pcard-info">
      <div class="pcard-cat">${catName(p.cat)}</div>
      <a class="pcard-link" href="product.html?id=${p.id}"><div class="pcard-name">${esc(p.name)}</div></a>
      ${tech}
      <div class="pcard-meta">
        <div class="price">${priceHtml(p)}</div>
        ${stars(p.rating,p.reviews)}
      </div>
    </div>
  </article>`;
}
function gridHtml(list){return list.length?list.map(p=>cardHtml(p)).join(''):
  '<div class="empty-state"><h3>Пусто</h3><p>Товаров по выбранным условиям нет.</p></div>'}

/* ===================== favorites & compare toggles ===================== */
document.addEventListener('click',e=>{
  const fb=e.target.closest('[data-fav]');
  if(fb){
    const id=fb.dataset.fav;
    if(fav.includes(id)){fav=fav.filter(x=>x!==id);toast('Удалено из избранного')}
    else{fav.push(id);toast('Добавлено в избранное','ok')}
    save('fav',fav);badges();
    $$('[data-fav="'+id+'"]').forEach(b=>b.classList.toggle('active',fav.includes(id)));
    if(document.body.dataset.page==='favorites')renderFavorites();
    return;
  }
  const cb=e.target.closest('[data-cmp]');
  if(cb){
    const id=cb.dataset.cmp;
    if(cmp.includes(id)){cmp=cmp.filter(x=>x!==id);toast('Убрано из сравнения')}
    else{if(cmp.length>=4){toast('Максимум 4 товара в сравнении','err');return}
      cmp.push(id);toast('Добавлено к сравнению','ok')}
    save('cmp',cmp);badges();
    $$('[data-cmp="'+id+'"]').forEach(b=>b.classList.toggle('active',cmp.includes(id)));
    if(document.body.dataset.page==='compare')renderCompare();
    return;
  }
  const qb=e.target.closest('[data-quick]');
  if(qb){openQuick(qb.dataset.quick);return}
});

/* ===================== quick view ===================== */
function openQuick(id){
  const p=byId(id);if(!p)return;
  const ov=$('#quick-modal');if(!ov)return;
  $('.qv-img img',ov).src='assets/img/'+p.img;
  $('.qv-body',ov).innerHTML=`
    <div class="pcard-cat">${catName(p.cat)}</div>
    <h3 style="font-size:26px;margin:8px 0 10px">${esc(p.name)}</h3>
    ${stars(p.rating,p.reviews)}
    <p style="color:var(--muted);margin:14px 0">${esc(p.desc)}</p>
    <div style="font-size:24px;font-weight:700;margin-bottom:18px">${priceHtml(p)}</div>
    <div class="pp-actions" style="margin:0">
      <a class="btn btn-ghost" href="product.html?id=${p.id}">Подробнее</a>
      <button class="btn btn-p" data-qvadd="${p.id}">${IC.bag} В корзину</button>
    </div>`;
  ov.classList.add('open');
  $('[data-qvadd]',ov).addEventListener('click',()=>{
    if(p.sizes&&p.sizes.length){location.href='product.html?id='+p.id;return}
    addToCart(p);ov.classList.remove('open');
  });
}
function bindModals(){
  $$('.modal').forEach(m=>{
    m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')});
    const c=$('.mclose',m);if(c)c.addEventListener('click',()=>m.classList.remove('open'));
  });
  addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal.open').forEach(m=>m.classList.remove('open'))});
}

/* ===================== catalog ===================== */
function renderCatalog(){
  const wrap=$('#cat-grid');if(!wrap)return;
  const fbox=$('#filters');
  const mode=SHOP.layout.filters;
  const urlCat=param('cat')||'',urlQ=(param('q')||'').toLowerCase();
  const st={cat:urlCat,q:urlQ,colors:[],sizes:[],min:'',max:'',sale:false,stock:false,sort:'pop',show:12};
  if(urlQ)$('#search-in')&&($('#search-in').value=urlQ);
  const allColors=[...new Map(PRODUCTS.flatMap(p=>p.colors).map(c=>[c.name,c])).values()];
  const allSizes=[...new Set(PRODUCTS.flatMap(p=>p.sizes))].sort((a,b)=>(''+a).localeCompare(''+b,undefined,{numeric:true}));
  const catChecked=c=>st.cat===c;
  let fHtml='';
  /* категории */
  fHtml+='<div class="fgroup"><h4>Категории</h4>'+SHOP.cats.map(c=>`
    <label class="fcheck"><input type="radio" name="fcat" value="${c[0]}" ${catChecked(c[0])?'checked':''}> ${c[1]}</label>`).join('')+'</div>';
  /* цена */
  fHtml+='<div class="fgroup"><h4>Цена, ₽</h4><div class="prange"><input type="number" id="f-min" placeholder="от 0"><span>—</span><input type="number" id="f-max" placeholder="до 250 000"></div></div>';
  /* цвета */
  fHtml+='<div class="fgroup"><h4>Цвет</h4><div class="dots">'+allColors.map(c=>`<button class="dot" data-col="${esc(c.name)}" title="${esc(c.name)}" style="background:${c.hex}"></button>`).join('')+'</div></div>';
  /* размеры */
  if(allSizes.length)fHtml+='<div class="fgroup"><h4>Размер</h4><div class="chipset">'+allSizes.map(s=>`<button class="chip" data-size="${esc(s)}">${esc(s)}</button>`).join('')+'</div></div>';
  /* прочее */
  fHtml+='<div class="fgroup"><h4>Ещё</h4>'
    +'<label class="fcheck"><input type="checkbox" id="f-sale"> Со скидкой</label>'
    +'<label class="fcheck"><input type="checkbox" id="f-stock"> Только в наличии</label></div>';
  fbox.innerHTML=fHtml;

  const apply=()=>{
    let list=PRODUCTS.slice();
    if(st.cat)list=list.filter(p=>p.cat===st.cat);
    if(st.q)list=list.filter(p=>(p.name+' '+p.desc).toLowerCase().includes(st.q));
    if(st.colors.length)list=list.filter(p=>p.colors.some(c=>st.colors.includes(c.name)));
    if(st.sizes.length)list=list.filter(p=>p.sizes.some(s=>st.sizes.includes(s)));
    if(st.min!=='')list=list.filter(p=>p.price>=+st.min);
    if(st.max!=='')list=list.filter(p=>p.price<=+st.max);
    if(st.sale)list=list.filter(p=>p.old);
    if(st.stock)list=list.filter(p=>p.stock);
    if(st.sort==='asc')list.sort((a,b)=>a.price-b.price);
    if(st.sort==='desc')list.sort((a,b)=>b.price-a.price);
    if(st.sort==='rate')list.sort((a,b)=>b.rating-a.rating);
    if(st.sort==='pop')list.sort((a,b)=>b.reviews-a.reviews);
    return list;
  };
  const paint=(reset)=>{
    const list=apply();
    if(reset)st.show=12;
    const vis=list.slice(0,st.show);
    wrap.innerHTML='<div class="pgrid" style="--gcols:'+SHOP.layout.grid+'">'+gridHtml(vis)+'</div>';
    $('#cat-found').innerHTML='Найдено: <b>'+list.length+'</b>'+(st.cat?' · '+catName(st.cat):'')+(st.q?' · «'+esc(st.q)+'»':'');
    $('#loadmore-btn').classList.toggle('hidden',st.show>=list.length);
  };
  /* события */
  $$('input[name="fcat"]',fbox).forEach(r=>r.addEventListener('change',()=>{st.cat=r.value;history.replaceState(null,'','catalog.html?cat='+r.value);paint(true)}));
  $('#f-min').addEventListener('input',e=>{st.min=e.target.value;paint(true)});
  $('#f-max').addEventListener('input',e=>{st.max=e.target.value;paint(true)});
  $$('.dot',fbox).forEach(d=>d.addEventListener('click',()=>{const n=d.dataset.col;st.colors.includes(n)?st.colors=st.colors.filter(x=>x!==n):st.colors.push(n);d.classList.toggle('active');paint(true)}));
  $$('.chip[data-size]',fbox).forEach(c=>c.addEventListener('click',()=>{const n=c.dataset.size;st.sizes.includes(n)?st.sizes=st.sizes.filter(x=>x!==n):st.sizes.push(n);c.classList.toggle('active');paint(true)}));
  $('#f-sale').addEventListener('change',e=>{st.sale=e.target.checked;paint(true)});
  $('#f-stock').addEventListener('change',e=>{st.stock=e.target.checked;paint(true)});
  $('#sort-sel').addEventListener('change',e=>{st.sort=e.target.value;paint(true)});
  $('#loadmore-btn').addEventListener('click',()=>{st.show+=12;paint(false)});
  paint(true);
}

/* ===================== product page ===================== */
function renderProduct(){
  const box=$('#pp-box');if(!box)return;
  const p=byId(param('id'))||PRODUCTS[0];
  const g=[p.img,...(p.gallery||[])].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
  document.title=p.name+' — '+SHOP.name;
  const crumb=$('#crumbs');
  if(crumb)crumb.innerHTML='<a href="index.html">Главная</a><span class="sep">/</span><a href="catalog.html">Каталог</a><span class="sep">/</span><a href="catalog.html?cat='+p.cat+'">'+catName(p.cat)+'</a><span class="sep">/</span><span>'+esc(p.name)+'</span>';
  const badge=p.badge==='new'?'<span class="badge badge-new">New</span>':p.badge==='hit'?'<span class="badge badge-hit">Хит продаж</span>':p.badge==='sale'?'<span class="badge badge-sale">Скидка '+Math.round((1-p.price/p.old)*100)+'%</span>':'';
  const sizesBlock=p.sizes&&p.sizes.length?`
    <div class="pp-opt">
      <div class="pp-opt-label">Размер${SHOP.layout.sizeguide?' <button id="sizeguide-btn" class="size-hint" style="margin:0 0 0 10px;text-transform:none;letter-spacing:0">Таблица размеров</button>':''}</div>
      <div class="sizes">${p.sizes.map(s=>`<button class="size-chip" data-size="${esc(s)}">${esc(s)}</button>`).join('')}</div>
      <div class="size-hint" id="size-warn" style="display:none;color:var(--danger)">Выберите размер</div>
    </div>`:'';
  const colorsBlock=p.colors&&p.colors.length?`
    <div class="pp-opt">
      <div class="pp-opt-label">Цвет: <span id="color-name" style="text-transform:none;letter-spacing:0;color:var(--text)">${esc(p.colors[0].name)}</span></div>
      <div class="dots">${p.colors.map((c,i)=>`<button class="dot${i===0?' active':''}" data-color="${esc(c.name)}" style="background:${c.hex}"></button>`).join('')}</div>
    </div>`:'';
  const engrave=SHOP.layout.engrave?`
    <div class="pp-opt">
      <div class="pp-opt-label">Гравировка (бесплатно, до 12 знаков)</div>
      <div class="engrave-box"><input id="engrave-in" maxlength="12" placeholder="Например: LUCY 12.08.2026"></div>
    </div>`:'';
  const tabsBlock=SHOP.layout.cardStyle==='tech'?`
    <div class="pp-tabs">
      <div class="tabbar">
        <button class="tab-btn active" data-tab="desc">Описание</button>
        <button class="tab-btn" data-tab="specs">Характеристики</button>
        <button class="tab-btn" data-tab="reviews">Отзывы (${p.reviews})</button>
        <button class="tab-btn" data-tab="delivery">Доставка</button>
      </div>
      <div class="tab-pane active" data-pane="desc"><p style="color:var(--muted)">${esc(p.desc)}</p>
        <ul class="hl-list">${(p.hl||[]).map(h=>'<li>'+IC.check+esc(h)+'</li>').join('')}</ul></div>
      <div class="tab-pane" data-pane="specs"><table class="spec-table">${p.specs.map(s=>`<tr><td>${esc(s[0])}</td><td><b>${esc(s[1])}</b></td></tr>`).join('')}</table></div>
      <div class="tab-pane" data-pane="reviews">${reviewsHtml(p)}</div>
      <div class="tab-pane" data-pane="delivery"><p style="color:var(--muted)">${SHOP.free_shipping_line}. Курьер — сегодня при заказе до 14:00, пункты выдачи и постаматы — 1–3 дня. Проверка техники при получении: курьер ждёт 15 минут.</p></div>
    </div>`:`
    <div class="pp-tabs">
      <div class="tabbar">
        <button class="tab-btn active" data-tab="desc">Описание</button>
        <button class="tab-btn" data-tab="specs">Характеристики</button>
        <button class="tab-btn" data-tab="reviews">Отзывы (${p.reviews})</button>
      </div>
      <div class="tab-pane active" data-pane="desc"><p style="color:var(--muted)">${esc(p.desc)}</p><p style="color:var(--muted);margin-top:10px">${esc(SHOP.brand_story)}</p></div>
      <div class="tab-pane" data-pane="specs"><table class="spec-table">${p.specs.map(s=>`<tr><td>${esc(s[0])}</td><td><b>${esc(s[1])}</b></td></tr>`).join('')}</table></div>
      <div class="tab-pane" data-pane="reviews">${reviewsHtml(p)}</div>
    </div>`;
  box.innerHTML=`
    <div class="pp">
    <div class="pp-gallery">
      <div class="pp-main"><img id="pp-main-img" src="assets/img/${g[0]}" alt="${esc(p.name)}"></div>
      <div class="pp-thumbs">${g.map((im,i)=>`<button class="${i===0?'active':''}" data-thumb="assets/img/${im}"><img src="assets/img/${im}" alt=""></button>`).join('')}</div>
    </div>
    <div class="pp-info">
      <div class="pcard-cat">${catName(p.cat)}</div>
      <h1>${esc(p.name)}</h1>
      <div class="pp-rate">${stars(p.rating,p.reviews)}<a href="#pp-tabs-anchor">Все отзывы</a></div>
      <div class="pp-price-row"><span class="pp-price">${money(p.price)}</span>${p.old?'<span class="pp-old">'+money(p.old)+'</span>':''}<span style="color:var(--muted);font-size:13px">или ${money(Math.round(p.price/4))} × 4 с Долями</span></div>
      <p class="pp-dsc">${esc(p.desc)}</p>
      ${colorsBlock}${sizesBlock}${engrave}
      <div class="pp-actions">
        <div class="qty"><button id="q-minus">${IC.minus}</button><span id="q-val">1</span><button id="q-plus">${IC.plus}</button></div>
        <button class="btn btn-p btn-lg" id="add-btn" style="flex:1">${IC.bag} В корзину</button>
      </div>
      <button class="btn btn-ghost" id="fav-btn-page" style="width:100%">${IC.heart} ${fav.includes(p.id)?'В избранном':'В избранное'}</button>
      <div class="pp-perks">
        <div>${IC.truck}<span>${SHOP.free_shipping_line}</span></div>
        <div>${IC.shield}<span>Официальная гарантия и чек по 54-ФЗ</span></div>
        <div>${IC.refresh}<span>Возврат 14 дней — <a href="returns.html" style="color:var(--accent)">правила</a></span></div>
        <div>${IC.card}<span>Оплата: ${SHOP.payments.join(', ')}</span></div>
      </div>
      <span id="pp-tabs-anchor"></span>
      ${tabsBlock}
    </div>
    </div>`;
  /* поведение */
  const state={size:'',color:p.colors[0]?p.colors[0].name:'',engrave:'',qty:1};
  $$('.size-chip',box).forEach(b=>b.addEventListener('click',()=>{
    $$('.size-chip',box).forEach(x=>x.classList.remove('active'));b.classList.add('active');
    state.size=b.dataset.size;$('#size-warn').style.display='none';
  }));
  $$('.dot[data-color]',box).forEach(d=>d.addEventListener('click',()=>{
    $$('.dot[data-color]',box).forEach(x=>x.classList.remove('active'));d.classList.add('active');
    state.color=d.dataset.color;$('#color-name').textContent=d.dataset.color;
  }));
  const eIn=$('#engrave-in');if(eIn)eIn.addEventListener('input',()=>state.engrave=eIn.value.trim());
  $$('.pp-thumbs button',box).forEach(b=>b.addEventListener('click',()=>{
    $$('.pp-thumbs button',box).forEach(x=>x.classList.remove('active'));b.classList.add('active');
    const im=$('#pp-main-img');im.style.opacity=0;setTimeout(()=>{im.src=b.dataset.thumb;im.style.opacity=1},180);
  }));
  $('#q-minus').addEventListener('click',()=>{state.qty=Math.max(1,state.qty-1);$('#q-val').textContent=state.qty});
  $('#q-plus').addEventListener('click',()=>{state.qty=Math.min(20,state.qty+1);$('#q-val').textContent=state.qty});
  $('#add-btn').addEventListener('click',()=>{
    if(p.sizes&&p.sizes.length&&!state.size){$('#size-warn').style.display='block';$('.sizes',box).scrollIntoView({block:'center',behavior:'smooth'});return}
    addToCart(p,state);
  });
  $('#fav-btn-page').addEventListener('click',()=>toggleFavPage(p.id));
  $$('.tab-btn',box).forEach(b=>b.addEventListener('click',()=>{
    $$('.tab-btn',box).forEach(x=>x.classList.remove('active'));b.classList.add('active');
    $$('.tab-pane',box).forEach(x=>x.classList.toggle('active',x.dataset.pane===b.dataset.tab));
  }));
  const sg=$('#sizeguide-btn');if(sg)sg.addEventListener('click',()=>$('#sizeguide-modal').classList.add('open'));
  /* похожие */
  const rel=PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
  const relWrap=$('#related-grid');if(relWrap)relWrap.innerHTML=rel.map(x=>cardHtml(x)).join('');
  function toggleFavPage(id){
    if(fav.includes(id)){fav=fav.filter(x=>x!==id);$('#fav-btn-page').innerHTML=IC.heart+' В избранное'}
    else{fav.push(id);$('#fav-btn-page').innerHTML=IC.heart+' В избранном'}
    save('fav',fav);badges();
  }
}
function reviewsHtml(p){
  const demo=[
    ['Анна К.',5,'Соответствует описанию и фото, качество на высоте. Упаковка аккуратная, доставка быстрая.'],
    ['Дмитрий В.',5,'Заказывал в подарок — получатель был в восторге. Сервис на уровне: напомнили о заказе, помогли с выбором.'],
    ['Мария Л.',4,'Очень довольна покупкой, единственное — хотелось бы больше расцветок в наличии.'],
  ];
  return demo.map((r,i)=>`<div class="review-item"><div class="review-head"><b>${r[0]}</b><span class="review-date">${['12.10.2026','03.10.2026','21.09.2026'][i]}</span></div>${stars(r[1])}<p>${esc(r[2])}</p></div>`).join('')
  +'<div class="review-form"><h4 style="font-size:17px;margin-bottom:12px">Оставить отзыв</h4><div class="field"><label>Ваш отзыв</label><textarea placeholder="Расскажите, что понравилось"></textarea></div><button class="btn btn-ghost" id="rv-send">Отправить отзыв</button></div>';
}

/* ===================== cart page ===================== */
function renderCart(){
  const box=$('#cart-lines');if(!box)return;
  if(!cart.length){
    box.innerHTML='<div class="fav-empty">'+IC.bag+'<h3>Корзина пуста</h3><p style="color:var(--muted)">Загляните в каталог — там всё самое интересное.</p><a class="btn btn-p" style="margin-top:22px" href="catalog.html">Перейти в каталог</a></div>';
    $('#cart-summary').style.display='none';return;
  }
  $('#cart-summary').style.display='';
  box.innerHTML=cart.map((i,idx)=>{
    const p=byId(i.id);if(!p)return '';
    return `<div class="cline">
      <a class="cline-img" href="product.html?id=${p.id}"><img src="assets/img/${p.img}" alt=""></a>
      <div>
        <a class="cline-name" href="product.html?id=${p.id}">${esc(p.name)}</a>
        <div class="cline-vars">${[i.color&&'Цвет: '+i.color,i.size&&'Размер: '+i.size,i.engrave&&'Гравировка: '+i.engrave].filter(Boolean).join(' · ')||'&nbsp;'}</div>
        <button class="cline-remove" data-rm="${idx}">${IC.trash} Удалить</button>
      </div>
      <div class="cline-right">
        <div class="qty"><button data-qm="${idx}">${IC.minus}</button><span>${i.qty}</span><button data-qp="${idx}">${IC.plus}</button></div>
        <div class="cline-price">${money(p.price*i.qty)}</div>
      </div>
    </div>`;
  }).join('');
  const sub=cart.reduce((s,i)=>{const p=byId(i.id);return s+(p?p.price*i.qty:0)},0);
  const disc=promo?Math.round(sub*(100-promo.percent)/100):0;
  const free=SHOP.delivery[0][4];
  const left=Math.max(0,free-sub);
  $('#sum-items').textContent=money(sub);
  $('#sum-disc-row').style.display=disc?'':'none';
  $('#sum-disc').textContent='−'+money(sub-disc);
  $('#sum-total').textContent=money(disc);
  $('#sum-free').innerHTML=left>0?('До бесплатной доставки: <b>'+money(left)+'</b>'):'<span class="free">Доставка бесплатно</span>';
  const promoWrap=$('#promo-wrap');
  if(promoWrap)promoWrap.innerHTML=promo?'<div class="promo-ok">Промокод '+promo.code+' (−'+promo.percent+'%) применён · <button id="promo-drop" style="text-decoration:underline;color:var(--muted)">отменить</button></div>':'<div class="promo-row"><input id="promo-in" placeholder="Промокод (например, '+SHOP.promo.code+')"><button class="btn btn-ghost" id="promo-apply">ОК</button></div>';
  const pa=$('#promo-apply');if(pa)pa.addEventListener('click',()=>{setPromo($('#promo-in').value);renderCart()});
  const pd=$('#promo-drop');if(pd)pd.addEventListener('click',()=>{promo=null;save('promo',null);renderCart()});
  $$('[data-rm]',box).forEach(b=>b.addEventListener('click',()=>{cart.splice(+b.dataset.rm,1);save('cart',cart);badges();renderCart()}));
  $$('[data-qm]',box).forEach(b=>b.addEventListener('click',()=>{const i=cart[+b.dataset.qm];i.qty=Math.max(1,i.qty-1);save('cart',cart);badges();renderCart()}));
  $$('[data-qp]',box).forEach(b=>b.addEventListener('click',()=>{cart[+b.dataset.qp].qty++;save('cart',cart);badges();renderCart()}));
}

/* ===================== checkout ===================== */
function renderCheckout(){
  const grid=$('#co-grid');if(!grid)return;
  if(!cart.length){location.href='cart.html';return}
  const sub=cart.reduce((s,i)=>{const p=byId(i.id);return s+(p?p.price*i.qty:0)},0);
  const afterPromo=promo?Math.round(sub*(100-promo.percent)/100):sub;
  $('#co-lines').innerHTML=cart.map(i=>{
    const p=byId(i.id);return `<div class="srow"><span>${esc(p.name)} × ${i.qty}${i.size?' · '+esc(i.size):''}</span><span style="color:var(--text)">${money(p.price*i.qty)}</span></div>`;
  }).join('');
  $('#co-sub').textContent=money(afterPromo);
  const delBox=$('#co-delivery');
  delBox.innerHTML=SHOP.delivery.map((d,i)=>`
    <label class="dopt${i===0?' active':''}"><input type="radio" name="del" value="${d[0]}" ${i===0?'checked':''}>
    <span><b>${d[1]}</b><small>${d[2]} · ${d[5]}</small></span>
    <span class="dop-price">${afterPromo>=d[4]&&d[4]>0?'<span class="free">Бесплатно</span>':d[3]===0?'Бесплатно':money(d[3])}</span></label>`).join('');
  const payBox=$('#co-payment');
  payBox.innerHTML=SHOP.payments.map((p,i)=>`
    <label class="dopt${i===0?' active':''}"><input type="radio" name="pay" value="${esc(p)}" ${i===0?'checked':''}>
    <span><b>${esc(p)}</b></span></label>`).join('');
  $$('input[name="del"],input[name="pay"]').forEach(r=>r.addEventListener('change',()=>{
    $$('input[name="del"]').forEach(x=>x.closest('.dopt').classList.toggle('active',x.checked));
    $$('input[name="pay"]').forEach(x=>x.closest('.dopt').classList.toggle('active',x.checked));
    recalc();}));
  let delPrice=SHOP.delivery[0][3];
  const recalc=()=>{
    const dv=$('input[name="del"]:checked').value;
    const d=SHOP.delivery.find(x=>x[0]===dv);
    delPrice=(afterPromo>=d[4]&&d[4]>0)||d[4]===0?0:d[3];
    $('#co-del').textContent=delPrice?money(delPrice):'Бесплатно';
    $('#co-total').textContent=money(afterPromo+delPrice);
  };
  recalc();
  $('#co-form').addEventListener('submit',e=>{
    e.preventDefault();
    let ok=true;
    const req=[['f-name','Введите имя'],['f-phone','Введите телефон'],['f-email','Введите e-mail'],['f-city','Укажите город'],['f-addr','Укажите адрес']];
    req.forEach(r=>{
      const inp=$('#'+r[0]),fld=inp.closest('.field');
      const valid=inp.value.trim().length>1&&!(r[0]==='f-email'&&!/^\S+@\S+\.\S+$/.test(inp.value))&&!(r[0]==='f-phone'&&inp.value.replace(/\D/g,'').length<10);
      fld.classList.toggle('invalid',!valid);if(!valid)ok=false;
    });
    if(!$('#consent').checked){ok=false;toast('Необходимо согласие с условиями','err')}
    if(!ok)return;
    const num=SHOP.id.slice(0,3).toUpperCase()+'-'+String(Math.floor(100000+Math.random()*899999));
    $('#order-num').textContent='Заказ № '+num;
    $('#co-success-sub').textContent='Мы отправили подтверждение на '+$('#f-email').value+'. '+SHOP.delivery.find(x=>x[0]===$('input[name="del"]:checked').value)[1]+' — '+$('#co-total').textContent+'.';
    $('.co-grid').style.display='none';$('.co-success').style.display='';
    cart=[];save('cart',cart);badges();
    scrollTo({top:0,behavior:'smooth'});
  });
}

/* ===================== favorites page ===================== */
function renderFavorites(){
  const box=$('#fav-grid');if(!box)return;
  const list=fav.map(byId).filter(Boolean);
  box.innerHTML=list.length?'<div class="pgrid">'+list.map(p=>cardHtml(p)).join('')+'</div>'
    :'<div class="fav-empty">'+IC.heart+'<h3>В избранном пусто</h3><p style="color:var(--muted)">Нажмите на сердечко на карточке товара — он появится здесь.</p><a class="btn btn-p" style="margin-top:22px" href="catalog.html">В каталог</a></div>';
}

/* ===================== compare page ===================== */
function renderCompare(){
  const box=$('#cmp-box');if(!box)return;
  const list=cmp.map(byId).filter(Boolean);
  if(!list.length){box.innerHTML='<div class="fav-empty">'+IC.cmp+'<h3>Сравнивать пока нечего</h3><p style="color:var(--muted)">Добавьте до 4 товаров через иконку весов на карточке.</p><a class="btn btn-p" style="margin-top:22px" href="catalog.html">В каталог</a></div>';return}
  const keys=[...new Set(list.flatMap(p=>p.specs.map(s=>s[0])))];
  box.innerHTML=`<div class="cmp-wrap"><table class="cmp-table">
    <tr><th></th>${list.map(p=>`<td><div class="cmp-item-img"><img src="assets/img/${p.img}" alt=""></div>
      <div class="cmp-name">${esc(p.name)}</div><div style="font-weight:700;margin-bottom:8px">${money(p.price)}</div>
      <a class="cmp-remove" href="#" data-cmr="${p.id}">Убрать</a></td>`).join('')}</tr>
    <tr><th>Рейтинг</th>${list.map(p=>`<td>${stars(p.rating,p.reviews)}</td>`).join('')}</tr>
    <tr><th>Наличие</th>${list.map(p=>`<td>${p.stock?'<span style="color:var(--ok)">В наличии</span>':'Под заказ'}</td>`).join('')}</tr>
    ${keys.map(k=>`<tr><th>${esc(k)}</th>${list.map(p=>{const f=p.specs.find(s=>s[0]===k);return '<td>'+(f?esc(f[1]):'—')+'</td>'}).join('')}</tr>`).join('')}
    <tr><th></th>${list.map(p=>`<td><button class="btn btn-p" style="padding:12px 22px;font-size:12.5px" data-cadd="${p.id}">В корзину</button></td>`).join('')}</tr>
  </table></div>`;
  $$('[data-cmr]',box).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();cmp=cmp.filter(x=>x!==a.dataset.cmr);save('cmp',cmp);badges();renderCompare()}));
  $$('[data-cadd]',box).forEach(b=>b.addEventListener('click',()=>addToCart(byId(b.dataset.cadd))));
}

/* ===================== faq ===================== */
function bindFaq(){
  $$('.faq-q').forEach(q=>q.addEventListener('click',()=>{
    const item=q.closest('.faq-item'),a=item.querySelector('.faq-a');
    const open=item.classList.toggle('open');
    a.style.maxHeight=open?a.scrollHeight+'px':'0';
  }));
}

/* ===================== forms / misc ===================== */
function bindMisc(){
  $$('form[data-toast]').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();
    const em=f.querySelector('input[type="email"]');
    if(em&&!/^\S+@\S+\.\S+$/.test(em.value)){toast('Проверьте адрес почты','err');return}
    toast('Готово! Мы вам напишем.','ok');f.reset();
  }));
  const cookie=$('#cookie');
  if(cookie&&!load('cookie',false)){
    setTimeout(()=>cookie.classList.add('on'),1400);
    $('#cookie-ok').addEventListener('click',()=>{save('cookie',true);cookie.classList.remove('on')});
  }
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>io.observe(el));
  const cd=$('#countdown');
  if(cd){
    let end=load('cd_end',0);
    if(end<Date.now()){end=Date.now()+1000*60*60*26;save('cd_end',end)}
    const tick=()=>{
      let s=Math.max(0,Math.floor((end-Date.now())/1000));
      const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);
      const z=n=>String(n).padStart(2,'0');
      $('#cd-d').textContent=z(d);$('#cd-h').textContent=z(h);$('#cd-m').textContent=z(m);$('#cd-s').textContent=z(s%60);
    };
    tick();setInterval(tick,1000);
  }
}

/* ===================== init ===================== */
document.addEventListener('DOMContentLoaded',()=>{
  bindHeader();badges();bindModals();bindMisc();bindFaq();
  const page=document.body.dataset.page;
  if(page==='catalog')renderCatalog();
  if(page==='product')renderProduct();
  if(page==='cart')renderCart();
  if(page==='checkout')renderCheckout();
  if(page==='favorites')renderFavorites();
  if(page==='compare')renderCompare();
});
