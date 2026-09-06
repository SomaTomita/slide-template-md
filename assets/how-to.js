document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click',function(e){
      // The button lives inside a <summary>; don't let the click toggle the <details>.
      e.preventDefault(); e.stopPropagation();
      var root=b.closest('details')||b.parentElement;
      var pre=root.querySelector('pre');
      if(!pre)return;
      // textContent (not innerText) so it copies even while the block is collapsed.
      navigator.clipboard.writeText(pre.textContent).then(function(){
        var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o;},1400);
      });
    });
  });

  /* copy a whole .md file's text to the clipboard (paste straight into the AI chat) */
  document.querySelectorAll('.filebtn[data-file]').forEach(function(b){
    b.addEventListener('click',function(){
      var btn=this,url=btn.getAttribute('data-file');
      fetch(url).then(function(r){return r.text();}).then(function(t){return navigator.clipboard.writeText(t);})
        .then(function(){var o=btn.textContent;btn.textContent='Copied';btn.classList.add('ok');setTimeout(function(){btn.textContent=o;btn.classList.remove('ok');},1400);})
        .catch(function(){var o=btn.textContent;btn.textContent='Use Download instead';setTimeout(function(){btn.textContent=o;},2000);});
    });
  });

  /* Save .md files reliably: fetch the file and download it as a Blob (with the
     right filename), instead of relying on <a download> — which browsers ignore
     for a page opened straight off disk (file://) and just navigate to the file.
     On file:// fetch is blocked too, so we say so and open the file in a new tab. */
  window.wireDownloads=function(){
    document.querySelectorAll('a[download]').forEach(function(a){
      if(a.dataset.wired)return; a.dataset.wired='1';
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
  };
  window.wireDownloads();