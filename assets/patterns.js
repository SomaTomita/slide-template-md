(function(){
  var wrap=document.querySelector('.wrap');
  var pairs=[],cur=null;
  wrap.querySelectorAll('.group,.grid').forEach(function(el){
    if(el.classList.contains('group')){cur={group:el,grid:null,cat:el.textContent};pairs.push(cur);}
    else if(cur&&!cur.grid){cur.grid=el;}
  });
  var state={uc:'all',cat:'all'};
  function applyPat(){
    pairs.forEach(function(p){
      if(!p.grid)return;var any=false;
      p.grid.querySelectorAll('.card').forEach(function(c){
        var ucOk=state.uc==='all'||c.querySelector('.tag.'+state.uc);
        var catOk=state.cat==='all'||p.cat.indexOf(state.cat)>-1;
        var show=ucOk&&catOk;c.style.display=show?'':'none';if(show)any=true;
      });
      p.group.style.display=any?'':'none';p.grid.style.display=any?'':'none';
    });
  }
  document.querySelectorAll('.filters .fl').forEach(function(fl){
    fl.querySelectorAll('.btn').forEach(function(b){
      b.addEventListener('click',function(){
        fl.querySelectorAll('.btn').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');
        if(b.dataset.uc!=null){state.uc=b.dataset.uc;applyPat();}
        if(b.dataset.cat!=null){state.cat=b.dataset.cat;applyPat();}
      });
    });
  });
})();

/* ===== pattern detail modal ===== */
(function(){
  var ov=document.getElementById('pov'); if(!ov)return;
  var recUrl=null;
  var slot=document.getElementById('pov-prev'),nameEl=document.getElementById('pov-name'),
      ucEl=document.getElementById('pov-uc'),ucLine=document.getElementById('pov-ucline'),pre=document.getElementById('pov-pre');
  var UC={present:['Present','Built for presenting — minimal text; the speaker carries the detail.'],
          hybrid:['Hybrid','Works on screen and as a read-along document.'],
          read:['Read','Built to be read — denser text; stands on its own.']};
  function openCard(card){
    var pn=card.querySelector('.pname'); var name=pn?pn.textContent:'this pattern';
    var uc='hybrid'; if(card.querySelector('.tag.present'))uc='present'; else if(card.querySelector('.tag.read'))uc='read';
    nameEl.textContent=name; ucEl.textContent=UC[uc][0]; ucLine.textContent=UC[uc][1];
    slot.innerHTML=''; var s=card.querySelector('.slide'); if(s)slot.appendChild(s.cloneNode(true));
    recUrl='2-patterns/'+name+'.md';
    var link=document.getElementById('pov-link'); if(link)link.href=recUrl;
    var recdl=document.getElementById('pov-recdl'); if(recdl)recdl.href=recUrl;
    pre.textContent='Using the attached slide_template.md (my design system) and the layout recipe\n2-patterns/'+name+'.md, create one 16:9 slide.\n\nTopic / content: <your points here>\n\nRules: slide_template.md is authoritative. One idea per slide. Title = a full\nsentence (an action title). Colors and fonts from slide_template.md only. Follow\nthe recipe\'s layout. Write the slide in <language>. Just one slide first.';
    ov.classList.add('show'); document.body.style.overflow='hidden';
  }
  function closeM(){ov.classList.remove('show');document.body.style.overflow='';slot.innerHTML='';}
  document.querySelectorAll('.grid .card').forEach(function(card){card.addEventListener('click',function(){openCard(card);});});
  document.getElementById('pov-x').addEventListener('click',closeM);
  ov.addEventListener('click',function(e){if(e.target===ov)closeM();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM();});
  document.getElementById('pov-copy').addEventListener('click',function(){var b=this;navigator.clipboard.writeText(pre.textContent).then(function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o;},1400);});});
  var recBtn=document.getElementById('pov-reccopy');
  if(recBtn)recBtn.addEventListener('click',function(){var b=this;if(!recUrl)return;fetch(recUrl).then(function(r){return r.text();}).then(function(t){return navigator.clipboard.writeText(t);}).then(function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o;},1400);}).catch(function(){var o=b.textContent;b.textContent='Open (.md) to copy';setTimeout(function(){b.textContent=o;},2000);});});
})();

/* ===== copy a .md file (e.g. ALL-PATTERNS.md) to the clipboard ===== */
document.querySelectorAll('.filebtn[data-file]').forEach(function(b){
  b.addEventListener('click',function(){
    var btn=this,url=btn.getAttribute('data-file');
    fetch(url).then(function(r){return r.text();}).then(function(t){return navigator.clipboard.writeText(t);})
      .then(function(){var o=btn.textContent;btn.textContent='Copied';btn.classList.add('ok');setTimeout(function(){btn.textContent=o;btn.classList.remove('ok');},1400);})
      .catch(function(){var o=btn.textContent;btn.textContent='Use Download instead';setTimeout(function(){btn.textContent=o;},2000);});
  });
});

/* ===== save .md files reliably (fetch -> Blob), so Download saves the file
   instead of navigating to it. On a file:// page fetch is blocked, so we say so
   and open the file in a new tab. Also covers the modal's Download (href set on open). ===== */
document.querySelectorAll('a[download]').forEach(function(a){
  a.addEventListener('click',function(e){
    var url=a.getAttribute('href'); if(!url)return;
    e.preventDefault();
    fetch(url).then(function(r){if(!r.ok)throw 0;return r.blob();}).then(function(b){
      var name=url.split('/').pop().split('#')[0].split('?')[0]||'download.md';
      var u=URL.createObjectURL(b),t=document.createElement('a');
      t.href=u;t.download=name;document.body.appendChild(t);t.click();t.remove();
      setTimeout(function(){URL.revokeObjectURL(u);},2000);
    }).catch(function(){
      var o=a.textContent;a.textContent='Serve the site to download';
      setTimeout(function(){a.textContent=o;},2400);
      window.open(url,'_blank');
    });
  });
});
