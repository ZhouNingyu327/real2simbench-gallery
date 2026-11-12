"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const axisNames = {A:"初态 / 动作",E:"环境 / 约束",V:"观察视角"};
  const state = {cases:[],current:null,axis:"E",filter:"all",search:"",playing:false,updating:false,timer:0,loadId:0};
  const left = $("referenceVideo"), right = $("targetVideo");
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const toast = text => {$("toast").textContent=text;$("toast").classList.add("visible");setTimeout(()=>$("toast").classList.remove("visible"),2200);};
  const categoryNames={rigid:"刚体与关节",fluids:"流体",grains:"颗粒",garments:"服装操作"};
  function stop(){state.playing=false;left.pause();right.pause();cancelAnimationFrame(state.timer);$("syncPlay").textContent="同步播放";}
  function setStatus(text,error=false){$("playerStatus").textContent=text;$("playerStatus").classList.toggle("error",error);}
  function maxTime(){return state.current?(state.current.frames-1)/state.current.fps:0;}
  function updateClock(){if(!state.current)return;const n=Math.min(state.current.frames-1,Math.max(0,Math.round(left.currentTime*state.current.fps)));$("frameSlider").value=String(n);$("videoClock").textContent=(n/state.current.fps).toFixed(3)+" s";$("frameCount").textContent=n+" / "+(state.current.frames-1);}
  function seek(frame){if(!state.current)return;const n=Math.max(0,Math.min(state.current.frames-1,Number(frame)));const t=n/state.current.fps;for(const video of [left,right]){if(video.readyState>=1)video.currentTime=t;}updateClock();}
  async function play(){
    if(!state.current)return;
    if(left.readyState<2||right.readyState<2){setStatus("视频正在载入，请稍后再播放。");return;}
    if(left.currentTime>=maxTime()-.001)seek(0);
    right.currentTime=left.currentTime;left.playbackRate=right.playbackRate=Number($("playbackSpeed").value);
    try{await Promise.all([left.play(),right.play()]);state.playing=true;$("syncPlay").textContent="同步暂停";setStatus("按同一展示帧对照 · 原生采样及时间映射的范围见案例说明");tick();}
    catch{stop();setStatus("浏览器尚未开始播放，请再次点击同步播放。",true);}
  }
  function tick(){
    if(!state.playing||!state.current)return;
    if(left.currentTime>=maxTime()-.002){
      if($("loopVideos").checked){seek(0);left.play().catch(()=>stop());right.play().catch(()=>stop());}
      else{stop();seek(state.current.frames-1);return;}
    }
    if(Math.abs(left.currentTime-right.currentTime)>.055&&right.readyState>=2)right.currentTime=left.currentTime;
    updateClock();state.timer=requestAnimationFrame(tick);
  }
  function paras(id,values){$(id).innerHTML=(values||[]).map(x=>"<p>"+escape(x)+"</p>").join("");}
  function facts(id,values){$(id).innerHTML=(values||[]).map(x=>"<li>"+escape(x)+"</li>").join("");}
  function filtered(){const q=state.search.trim().toLowerCase();return state.cases.filter(c=>(state.filter==="all"||c.category===state.filter)&&(!q||[c.title,c.summary,c.mechanism,c.id,categoryNames[c.category],...(c.reproducibility||[]),...(c.sources||[]).map(s=>s.title)].join(" ").toLowerCase().includes(q)));}
  function renderNav(){
    const rows=filtered();$("caseNav").innerHTML=rows.map(c=>`<button class="case-choice ${state.current?.id===c.id?"active":""}" data-case="${escape(c.id)}" aria-pressed="${state.current?.id===c.id}"><img src="${escape(c.poster)}" alt="" loading="lazy"><span><strong>${escape(c.title)}</strong><small>${escape(categoryNames[c.category])}</small><small class="mini-status">${escape(c.status_label)}</small></span></button>`).join("");
    $("emptyState").hidden=rows.length>0;$("caseArticle").hidden=!rows.length;
    if(rows.length&&!rows.some(x=>x.id===state.current?.id))selectCase(rows[0].id,true);
    if(!rows.length)stop();
  }
  function updateHash(){if(state.current)history.replaceState(null,"","#case="+encodeURIComponent(state.current.id)+"&axis="+state.axis);}
  function loadVideos(keepTime=0){
    stop();state.loadId++;const token=state.loadId;const c=state.current;
    left.src=c.videos.REF.url;right.src=c.videos[state.axis].url;
    left.poster=c.videos.REF.poster;right.poster=c.videos[state.axis].poster;
    $("referenceDownload").href=c.videos.REF.url;$("targetDownload").href=c.videos[state.axis].url;
    $("referenceCaption").textContent=c.frames+"帧 · "+c.fps_label+"fps";$("targetCaption").textContent=c.frames+"帧 · "+c.fps_label+"fps";
    $("frameSlider").max=String(c.frames-1);$("frameSlider").value="0";
    setStatus("载入原始视频元数据…");
    const onReady=()=>{if(token!==state.loadId)return;if(left.readyState>=1&&right.readyState>=1){seek(Math.round(keepTime*c.fps));setStatus("已载入 · 左侧REF，右侧"+state.axis+" · V仅改变相机");}};
    left.onloadedmetadata=right.onloadedmetadata=onReady;
    left.load();right.load();updateClock();
  }
  function selectAxis(axis,changeHash=true){
    if(!axisNames[axis]||!state.current)return;
    const t=Math.min(left.currentTime||0,maxTime());state.axis=axis;
    document.querySelectorAll("[data-axis]").forEach(b=>{const on=b.dataset.axis===axis;b.classList.toggle("active",on);b.setAttribute("aria-selected",String(on));});
    $("targetAxis").textContent=axis;$("targetLabel").textContent=axisNames[axis];$("axisLabel").textContent=axis+" · 本次改变";$("axisDescription").textContent=state.current.axes[axis];
    loadVideos(t);if(changeHash)updateHash();
  }
  function selectCase(id,changeHash=true){
    const c=state.cases.find(x=>x.id===id);if(!c)return;
    stop();state.current=c;$("caseCategory").textContent=categoryNames[c.category]+" / "+c.short_id;$("caseStatus").textContent=c.status_label;$("caseStatus").className="status-badge "+c.status_kind;
    $("caseTitle").textContent=c.title;$("caseSummary").textContent=c.summary;$("mechanism").textContent=c.mechanism;
    paras("setup",c.setup);facts("gtFacts",c.gt);facts("validationFacts",c.validation);facts("limitations",c.limitations);paras("reproducibility",c.reproducibility);
    $("sources").innerHTML=c.sources.map(s=>`<div class="source-item">${s.url?`<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a>`:`<span>${escape(s.title)} · 独立公开链接未提供</span>`}<code>${escape(s.commit||"")}</code><small>${escape(s.license||"许可范围见上游说明")}</small></div>`).join("");
    $("caseDownload").href=c.download;$("caseArticle").hidden=false;
    for(const b of document.querySelectorAll("[data-case]")){const on=b.dataset.case===id;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));}
    left.removeAttribute("src");right.removeAttribute("src");left.load();right.load();selectAxis(state.axis,false);
    if(changeHash)updateHash();
  }
  $("caseNav").addEventListener("click",event=>{const b=event.target.closest("[data-case]");if(b)selectCase(b.dataset.case);});
  document.querySelectorAll("[data-axis]").forEach(b=>b.addEventListener("click",()=>selectAxis(b.dataset.axis)));
  document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{state.filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>{const on=x===b;x.classList.toggle("active",on);x.setAttribute("aria-pressed",String(on));});renderNav();}));
  $("caseSearch").addEventListener("input",event=>{state.search=event.target.value;renderNav();});
  $("syncPlay").addEventListener("click",()=>state.playing?stop():play());
  $("restart").addEventListener("click",()=>{stop();seek(0);});
  $("frameSlider").addEventListener("input",event=>{stop();seek(event.target.value);});
  $("previousFrame").addEventListener("click",()=>{stop();seek(Number($("frameSlider").value)-1);});
  $("nextFrame").addEventListener("click",()=>{stop();seek(Number($("frameSlider").value)+1);});
  $("playbackSpeed").addEventListener("change",()=>{left.playbackRate=right.playbackRate=Number($("playbackSpeed").value);});
  for(const v of [left,right]){v.addEventListener("error",()=>setStatus("当前原片加载失败，请使用下载链接核对，或刷新页面重试。",true));v.addEventListener("ended",()=>{if(!state.playing)return;if($("loopVideos").checked){seek(0);left.play().catch(()=>stop());right.play().catch(()=>stop());}else stop();});}
  document.querySelectorAll("[data-fullscreen]").forEach(b=>b.addEventListener("click",()=>{const v=$(b.dataset.fullscreen);if(v.requestFullscreen)v.requestFullscreen().catch(()=>toast("浏览器暂不支持当前放大方式"));else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();}));
  $("copyCaseLink").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(location.href);toast("案例链接已复制");}catch{toast("可直接复制浏览器地址栏中的案例链接");}});
  $("modelObservationVideo").addEventListener("play",stop);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
  window.addEventListener("hashchange",()=>{const p=new URLSearchParams(location.hash.slice(1));if(p.has("case")){if(p.get("axis") in axisNames)state.axis=p.get("axis");selectCase(p.get("case"),false);}});
  fetch("data/cases.json?v=20261112-2").then(r=>{if(!r.ok)throw new Error("catalog");return r.json();}).then(data=>{
    state.cases=data.cases;const p=new URLSearchParams(location.hash.slice(1));if(p.get("axis") in axisNames)state.axis=p.get("axis");const id=state.cases.some(c=>c.id===p.get("case"))?p.get("case"):state.cases[0].id;
    selectCase(id,false);renderNav();if(!location.hash||location.hash.startsWith("#case="))updateHash();
  }).catch(()=>{$("caseNav").textContent="案例目录加载失败，请刷新页面。原片与说明仍可通过下载目录访问。";});
})();
