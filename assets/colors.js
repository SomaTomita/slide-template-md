/* colors.js — the live design-system control on examples.html.
   One control bar drives every slide on the page: the before/after pair and all
   four example decks. Pick a starting point, choose grayscale / one color / two,
   set the paper tone, the type pairing and the mode, then download the filled-in
   slide_template.md. Everything is client-side: hex math, a <style> element that
   sets design tokens on `.live .slide`, and a Blob download. */
(function(){
  var bar=document.getElementById('mixbar'); if(!bar)return;

  /* ---------- color math ---------- */
  function hex(s){s=(s||'').trim().replace(/^#/,'');if(s.length===3)s=s.replace(/./g,function(c){return c+c;});return /^[0-9a-fA-F]{6}$/.test(s)?'#'+s.toUpperCase():null;}
  function rgb(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
  function toHex(c){return '#'+c.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return (v<16?'0':'')+v.toString(16).toUpperCase();}).join('');}
  function mix(a,b,t){var x=rgb(a),y=rgb(b);return toHex([x[0]+(y[0]-x[0])*t,x[1]+(y[1]-x[1])*t,x[2]+(y[2]-x[2])*t]);}
  function lum(h){var c=rgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
  function contrast(a,b){var l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}

  /* ---------- the choices ---------- */
  var TONES={
    warm:{label:'Warm',paper:'#FFFBF6',ink:'#241E18',note:'a warm off-white ground'},
    cool:{label:'Cool',paper:'#F7FAFD',ink:'#141A22',note:'a cool near-white ground'},
    neutral:{label:'Neutral',paper:'#FCFCFB',ink:'#232321',note:'a neutral off-white ground'},
    dark:{label:'Dark',paper:'#17171B',ink:'#F5F5F2',note:'a dark ground with light text'}
  };
  var SERIF='"Iowan Old Style","Palatino Linotype","Hoefler Text",Palatino,Georgia,serif';
  var SANS='system-ui,-apple-system,"Helvetica Neue",Helvetica,Arial,sans-serif';
  var TYPES={
    editorial:{label:'Editorial',serif:SERIF,sans:SANS,
      md:'- Heading: **Iowan Old Style / Palatino / Georgia** (serif) · Body: **system-ui / Helvetica Neue / Arial** (sans) · Labels: **ui-monospace / Menlo**, uppercase, +0.16em tracking'},
    modern:{label:'Modern',serif:SANS,sans:SANS,
      md:'- Heading and body: **system-ui / Helvetica Neue / Arial** (sans). Headings at 700 with −0.03em tracking; body at 400. · Labels: **ui-monospace / Menlo**, uppercase, +0.16em tracking'},
    reading:{label:'Reading',serif:SERIF,sans:SERIF,
      md:'- Heading and body: **Iowan Old Style / Georgia** (serif). Give body text 1.6 line-height and a measure of ≤ 66 characters. · Labels: **ui-monospace / Menlo**, uppercase, +0.16em tracking'}
  };

  /* ---------- presets: the ten ready-made systems, plus editorial two-color looks ---------- */
  var PRESETS=[
    {id:'ember-orange',    label:'Ember',      a:'#C2410C', b:null,      tone:'warm',   type:'editorial', mode:'present',  file:'SLIDE-md-ember-orange.md',    use:'AI product studio · pitch & capability decks'},
    {id:'indigo-modern',   label:'Indigo',     a:'#4F46E5', b:null,      tone:'cool',   type:'modern',    mode:'present',  file:'SLIDE-md-indigo-modern.md',   use:'Modern B2B SaaS · product, demo, pitch'},
    {id:'hinode-numbers',  label:'Hinode',     a:'#F5B700', b:null,      tone:'warm',   type:'editorial', mode:'present',  file:'SLIDE-md-hinode-numbers.md',  use:'Bold “by the numbers” · recruiting, IR highlights'},
    {id:'corporate-navy',  label:'Teal navy',  a:'#2C7DA0', b:'#0F2238', tone:'cool',   type:'modern',    mode:'document', file:'SLIDE-md-corporate-navy.md',  use:'Consulting & finance · proposals, board decks'},
    {id:'northgate-report',label:'Northgate',  a:'#1E3A5F', b:null,      tone:'cool',   type:'editorial', mode:'document', file:'SLIDE-md-northgate-report.md',use:'Strategy consulting · market studies, board reports'},
    {id:'institute-report',label:'Institute',  a:'#14532D', b:null,      tone:'cool',   type:'reading',   mode:'document', file:'SLIDE-md-institute-report.md',use:'Research institute · long-form policy reports'},
    {id:'government-safe', label:'Civic',      a:'#1F4E79', b:null,      tone:'cool',   type:'modern',    mode:'document', file:'SLIDE-md-government-safe.md', use:'Public sector · official reports, briefings'},
    {id:'sage-natural',    label:'Sage',       a:'#3E7C5A', b:null,      tone:'warm',   type:'modern',    mode:'present',  file:'SLIDE-md-sage-natural.md',    use:'Sustainability · wellness, ESG, calm corporate'},
    {id:'warm-editorial',  label:'Sienna',     a:'#B0542F', b:null,      tone:'warm',   type:'editorial', mode:'present',  file:'SLIDE-md-warm-editorial.md',  use:'High-end fashion · brand decks, keynotes'},
    {id:'soft-editorial',  label:'Orchid',     a:'#8A5FA8', b:null,      tone:'warm',   type:'editorial', mode:'document', file:'SLIDE-md-soft-editorial.md',  use:'Soft editorial · culture, brand, storytelling'},
    {id:'rose-forest',     label:'Rose · forest',  a:'#D27E96', b:'#2E4A2A', tone:'warm', type:'editorial', mode:'present'},
    {id:'gold-burgundy',   label:'Gold · burgundy',a:'#B8860B', b:'#7A1F35', tone:'warm', type:'editorial', mode:'present'},
    {id:'emerald-navy',    label:'Emerald · navy', a:'#1FA76B', b:'#0F1A5C', tone:'cool', type:'modern',    mode:'document'},
    {id:'amber-dark',      label:'Amber on dark',  a:'#F5B700', b:null,      tone:'dark', type:'modern',    mode:'present'}
  ];

  /* ---------- tokens ---------- */
  function derive(s){
    var T=TONES[s.tone]||TONES.neutral, dark=s.tone==='dark';
    var accent=s.a, second=s.colors==='two'?s.b:null;
    var paper,ink,panel,card,paper2;
    if(dark){
      paper=mix(T.paper,accent,.07);
      paper2=mix(paper,'#FFFFFF',.09);
      card=mix(paper,'#FFFFFF',.055);
      ink=mix(T.ink,accent,.05);
      panel=second||mix(paper,'#FFFFFF',.14);
    }else{
      paper=mix(T.paper,accent,.035);
      card=mix('#FFFFFF',accent,.015);
      ink=(second&&contrast(second,paper)>=4.5)?second:mix(T.ink,accent,.08);
      panel=second||mix(T.ink,accent,.12);
      paper2=mix(paper,panel,.12);
    }
    var body=mix(ink,paper,.28), taupe=mix(ink,paper,.55), line=mix(ink,paper,dark?.76:.84);
    var soft=mix(paper,accent,dark?.22:.14);
    var accentText=accent,guard=0;
    while(contrast(accentText,paper)<3.2&&guard++<14)accentText=mix(accentText,dark?'#FFFFFF':'#000000',.12);
    return {accent:accent,accentText:accentText,panel:panel,paper:paper,paper2:paper2,card:card,
            ink:ink,body:body,taupe:taupe,line:line,soft:soft,dark:dark,second:second,tone:T};
  }

  /* ---------- state ---------- */
  var state={preset:'ember-orange',colors:'one',a:'#C2410C',b:'#2E4A2A',tone:'warm',type:'editorial',mode:'present',name:'my-brand'};
  var tokens=derive(state);

  var css=document.createElement('style'); css.id='mix-vars'; document.head.appendChild(css);
  var els={};
  ['a','a-hex','b','b-hex','b-wrap','name','contrast','orig','dl','copy','presets'].forEach(function(k){els[k]=document.getElementById('mix-'+k);});

  function setGroup(group,value){
    bar.querySelectorAll('[data-group="'+group+'"]').forEach(function(btn){
      var on=btn.dataset.value===value;
      btn.classList.toggle('on',on); btn.setAttribute('aria-pressed',on?'true':'false');
    });
  }

  function apply(){
    tokens=derive(state);
    var t=tokens,T=TYPES[state.type];
    /* Grayscale keeps every color from patterns.css and only swaps the type. */
    css.textContent='.live .slide{'+(state.colors==='none'?'':
        '--accent:'+t.accent+';--accent-soft:'+t.soft+';--panel:'+t.panel+';'+
        '--paper:'+t.paper+';--paper-2:'+t.paper2+';--card:'+t.card+';'+
        '--ink:'+t.ink+';--body:'+t.body+';--taupe:'+t.taupe+';--line:'+t.line+';')+
        '--serif:'+T.serif+';--sans:'+T.sans+';}';
    setGroup('colors',state.colors); setGroup('tone',state.tone);
    setGroup('type',state.type); setGroup('mode',state.mode);
    els.a.value=state.a; els['a-hex'].value=state.a;
    els.b.value=state.b; els['b-hex'].value=state.b;
    els['b-wrap'].hidden=state.colors!=='two';
    els.a.closest('.cpick').hidden=state.colors==='none';
    els.presets.querySelectorAll('.preset').forEach(function(p){p.classList.toggle('on',p.dataset.id===state.preset);});
    var c=contrast(tokens.ink,tokens.paper);
    els.contrast.textContent=state.colors==='none'
      ? 'Grayscale — the layouts exactly as they ship'
      : 'Body text '+c.toFixed(1)+':1 on the ground'+(c>=4.5?' · passes AA':' · below AA, pick a darker ink');
    els.contrast.classList.toggle('warn',state.colors!=='none'&&c<4.5);
    var lab=document.querySelector('#ba-lab span');
    if(lab)lab.textContent=state.colors==='none'?'still grayscale — pick a color below':'your design system added';
    var pre=PRESETS.filter(function(p){return p.id===state.preset&&p.file;})[0];
    els.orig.hidden=!pre;
    if(pre){els.orig.href='1-design-system/examples/'+pre.file;els.orig.textContent='Original '+pre.id+'.md';}
  }

  function loadPreset(p){
    state.preset=p.id; state.a=p.a; state.tone=p.tone; state.type=p.type; state.mode=p.mode;
    state.colors=p.b?'two':'one'; if(p.b)state.b=p.b;
    if(state.name==='my-brand'||PRESETS.some(function(x){return x.id===state.name;}))state.name=p.id;
    els.name.value=state.name;
    apply();
  }

  /* ---------- controls ---------- */
  els.presets.querySelectorAll('.preset').forEach(function(btn){
    btn.addEventListener('click',function(){
      var p=PRESETS.filter(function(x){return x.id===btn.dataset.id;})[0]; if(p)loadPreset(p);
    });
  });
  bar.querySelectorAll('[data-group]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var g=btn.dataset.group;
      state[g]=btn.dataset.value; state.preset='';
      if(g==='colors'&&btn.dataset.value==='two'&&state.b===state.a)state.b='#2E4A2A';
      apply();
    });
  });
  function bindColor(picker,text,key){
    picker.addEventListener('input',function(){var h=hex(picker.value);if(h){state[key]=h;state.preset='';apply();}});
    text.addEventListener('change',function(){var h=hex(text.value);if(h){state[key]=h;state.preset='';}apply();});
  }
  bindColor(els.a,els['a-hex'],'a'); bindColor(els.b,els['b-hex'],'b');
  els.name.addEventListener('input',function(){
    state.name=(els.name.value||'my-brand').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'my-brand';
  });
  document.getElementById('mix-random').addEventListener('click',function(){
    function pick(a){return a[Math.floor(Math.random()*a.length)];}
    var h=Math.floor(Math.random()*360), s=45+Math.floor(Math.random()*40), l=28+Math.floor(Math.random()*24);
    state.a=hslHex(h,s,l);
    state.colors=pick(['one','one','two']);
    if(state.colors==='two')state.b=hslHex((h+150+Math.floor(Math.random()*80))%360,30+Math.floor(Math.random()*30),16+Math.floor(Math.random()*14));
    state.tone=pick(['warm','cool','neutral','warm','cool','dark']);
    state.type=pick(['editorial','modern','reading']);
    state.preset='';
    apply();
  });
  function hslHex(h,s,l){
    s/=100;l/=100;
    var c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h/60)%2-1)), m=l-c/2, r=0,g=0,b=0;
    if(h<60){r=c;g=x;}else if(h<120){r=x;g=c;}else if(h<180){g=c;b=x;}
    else if(h<240){g=x;b=c;}else if(h<300){r=x;b=c;}else{r=c;b=x;}
    return toHex([(r+m)*255,(g+m)*255,(b+m)*255]);
  }

  /* ---------- the file ---------- */
  function md(){
    var t=tokens,T=TYPES[state.type],present=state.mode==='present';
    var none=state.colors==='none', two=state.colors==='two';
    var L=[
      '# slide_template.md — '+state.name,'',
      '**Tags:** tone = '+(none?'Neutral grayscale':two?'Two-color editorial':'One accent')+' · use-case = '+(present?'Present':'Document'),
      '**Reference:** built with the live control on the slide_template.md examples page · **Use case:** '+
        (present?'slides you talk over — one idea per slide, big type':'slides people read alone — full sentences, denser text'),'',
      '## Mode','- `mode: '+(present?'present':'document')+'`',
      present?'  - Projected, you speak: one idea per slide, body ≥ 30pt equivalent, very few words.'
             :'  - Read alone (handout / proposal): full sentences, smaller body is fine, still one idea per slide.','',
      '## Colors  (60-30-10 · WCAG AA: body ≥ 4.5:1)','| role | name | hex |','|---|---|---|',
      '| Background (60%) | '+t.tone.note+' | '+t.paper+' |',
      '| Secondary (30%) | '+(two?'panel — inverse panels, section openers, filled tiles':none?'near-black — text and filled tiles':'deep neutral — text and filled tiles')+' | '+t.panel+' |',
      '| Accent (10%, focal only) | '+(none?'none — one gray step above the ground':'accent — big numbers, one chart series, kickers')+' | '+t.accent+' |',
      '| Ink (text) | ink | '+t.ink+' |','| Body text | body | '+t.body+' |',
      '| Muted / hairline | taupe / line | '+t.taupe+' / '+t.line+' |',
      '| Accent tint | soft — chips, subtle fills | '+t.soft+' |','',
      '- 60-30-10: the ground (60) · '+(two?'the panel color for inverse panels and one filled tile per slide (30)':'ink for text and one filled tile per slide (30)')+' · '+(none?'no accent — hierarchy comes from size and weight alone (10)':'the accent for the focal point only (10)')+'.',
      '- Body text is ink on the ground ('+contrast(t.ink,t.paper).toFixed(1)+':1).'+
        (!none&&t.accentText!==t.accent?' For accent-colored TEXT (big numbers, kickers) use the darker '+t.accentText+' so it stays readable; keep '+t.accent+' for fills, bars and chips.':''),
      t.dark?'- This is a dark-ground system: panels are LIGHTER than the ground, not darker. Never put dark text on the ground.'
            :(two?'- On a panel-colored background, text is the ground color ('+t.paper+'); the accent appears on panels only as a small highlight.'
                 :'- Never place accent text on the accent color. One accent per slide.'),'',
      '## Typography  (max 2 typefaces)',T.md,
      '- Display 7–8cqi / 600 · H1 ~4cqi / 600 · Body ~1.9cqi / 400 · Caption ~1.4cqi. Action titles (a full sentence stating the point).','',
      '## Layout','- 16:9 · outer margin 6% · 8px spacing scale · one chart, table or diagram per slide · ≥ 20% whitespace.',
      '- Fixed positions on every slide: logo top-right, title top-left, page number bottom-right.','',
      '## Charts & diagrams',
      '- '+(none?'One series one step darker than the rest; everything else neutral gray':'One series in the accent, the rest neutral gray')+' ('+t.taupe+' / '+t.line+'). Direct labels over legends. Zero baseline. No 3-D.',
      '- Diagrams: ≤ 5 nodes, one flow direction, '+(none?'grays only':'1 accent + grays')+'.','',
      '## Do / Don\'t',
      '- Do: the ground plus '+(none?'nothing but grays — let size, weight and whitespace carry the hierarchy':two?'two brand colors, the second one reserved for whole panels and section openers':'a single accent')+'; large numbers; one idea per slide.',
      '- Don\'t: more than '+(two?'two':'one')+' brand color'+(two?'s':'')+', rainbow charts, decorative gradients, accent text on accent fills, pure #000 on #FFF.',''
    ];
    return L.join('\n');
  }
  function flash(btn,msg){var o=btn.textContent;btn.textContent=msg;btn.classList.add('ok');setTimeout(function(){btn.textContent=o;btn.classList.remove('ok');},1400);}
  els.dl.addEventListener('click',function(){
    var u=URL.createObjectURL(new Blob([md()],{type:'text/markdown'})),a=document.createElement('a');
    a.href=u;a.download='slide_template.md';document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(u);},2000); flash(this,'Saved');
  });
  els.copy.addEventListener('click',function(){var b=this;navigator.clipboard.writeText(md()).then(function(){flash(b,'Copied');});});

  /* ---------- deck tabs ---------- */
  var tabs=[].slice.call(document.querySelectorAll('.extab')), panels=[].slice.call(document.querySelectorAll('.expanel'));
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false');});
      t.classList.add('on'); t.setAttribute('aria-selected','true');
      var id='deck-'+t.dataset.deck;
      panels.forEach(function(p){p.hidden=(p.id!==id);});
    });
  });

  apply();
})();
