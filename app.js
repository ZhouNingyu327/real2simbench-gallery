/* The player clock is physical source time, including the offset of T_FUTURE. */
(function () {
  "use strict";
  var catalog = window.SHOWCASE;
  if (!catalog || catalog.scenes.length !== 8) return;
  var scenes = catalog.scenes;
  var byId = Object.fromEntries(scenes.map(function (s) { return [s.id, s]; }));
  var $ = function (id) { return document.getElementById(id); };
  var axes = ["REF", "A", "E", "V", "T"];
  var state = { scene: "R01", axis: "A", group: "all", search: "", layout: "split", speed: 1, playing: false, loading: false, failed: false, clock: 0, temporal: "left", epoch: 0, raf: 0, tick: 0, seeking: false };
  var slots = ["left", "right"].map(function (id) { return { id: id, video: $(id + "Video"), panel: $(id + "Panel"), loading: $(id + "Loading"), clip: null, abort: null }; });
  var toastTimer;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(t) { return Number.isFinite(t) ? t.toFixed(2) : "0.00"; }
  function pad(n) { return String(n).padStart(3, "0"); }
  function current() { return byId[state.scene]; }
  function isSingle() { return state.axis === "REF" || (state.axis !== "T" && state.layout === "single"); }
  function toast(message) { $("toast").textContent = message; $("toast").classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { $("toast").classList.remove("show"); }, 2900); }
  function sourceTime(slot) {
    if (!slot.clip) return 0;
    var sample = Math.min(slot.clip.frames - 1, Math.max(0, Math.floor((slot.video.currentTime + 1e-5) * slot.clip.fps)));
    return slot.clip.start + sample / slot.clip.fps;
  }
  function primary() { return state.axis === "T" ? slots[state.temporal === "right" ? 1 : 0] : (isSingle() ? slots[1] : slots[0]); }
  function paintTime() {
    var s = current(), t = Math.min(s.duration, Math.max(0, state.clock)), index = Math.min(s.clips.REF.frames - 1, Math.round(t * s.fps));
    $("currentTime").textContent = fmt(t);
    $("timeline").value = String(t);
    $("timelineFill").style.width = (s.duration > 0 ? 100 * t / s.duration : 0) + "%";
    $("frameCounter").textContent = pad(index) + " / " + pad(s.clips.REF.frames - 1);
    slots.forEach(function (p) { $(p.id + "Clock").textContent = fmt(sourceTime(p)) + " s"; p.panel.classList.toggle("is-active", state.axis !== "T" || p.id === state.temporal); });
  }
  function paintPlay() {
    $("playBtn").disabled = state.loading;
    $("playBtn").setAttribute("aria-pressed", String(state.playing));
    $("playBtn").setAttribute("aria-label", state.playing ? "暂停播放" : (state.axis === "T" ? "顺序播放" : (isSingle() ? "播放视频" : "同步播放")));
    $("playBtn").innerHTML = '<svg><use href="#i-' + (state.playing ? "pause" : "play") + '"/></svg><span>' + (state.loading ? "载入视频" : state.playing ? "暂停" : state.axis === "T" ? "顺序播放" : isSingle() ? "播放" : "同步播放") + "</span>";
  }
  function pause() {
    state.playing = false;
    slots.forEach(function (p) { p.video.pause(); });
    cancelAnimationFrame(state.raf); state.raf = 0; paintPlay();
  }
  function setLocalTime(slot, absoluteTime) {
    if (!slot.clip || slot.video.readyState < 1) return;
    var max = (slot.clip.frames - 1) / slot.clip.fps;
    var local = Math.max(0, Math.min(max, absoluteTime - slot.clip.start));
    var time = local === 0 ? 0 : local + 1e-6;
    if (Math.abs(slot.video.currentTime - time) > 0.0001) slot.video.currentTime = time;
  }
  function seek(time, keepPlaying) {
    var wasPlaying = state.playing, s = current();
    pause();
    state.clock = Math.max(0, Math.min(s.duration, Math.round(time * s.fps) / s.fps));
    if (state.axis === "T") {
      state.temporal = state.clock + 1e-8 >= s.cut ? "right" : "left";
      setLocalTime(slots[0], state.clock);
      setLocalTime(slots[1], state.clock);
    } else slots.forEach(function (p) { setLocalTime(p, state.clock); });
    paintTime();
    if (keepPlaying && wasPlaying) play();
  }
  function tick() {
    state.raf = 0;
    if (!state.playing) return;
    var main = primary();
    state.clock = sourceTime(main);
    if (state.axis !== "T" && !isSingle() && ++state.tick % 10 === 0) {
      var drift = slots[1].video.currentTime - slots[0].video.currentTime;
      if (Math.abs(drift) > Math.max(2 / current().fps, 0.045) && !slots[1].video.seeking) slots[1].video.currentTime = slots[0].video.currentTime;
    }
    paintTime();
    state.raf = requestAnimationFrame(tick);
  }
  async function play() {
    if (state.loading) return;
    if (state.failed) { loadCurrent(); return; }
    if (state.clock >= current().duration - 1e-8) seek(0, false);
    var epoch = state.epoch;
    slots.forEach(function (p) { p.video.playbackRate = state.speed; });
    var active = state.axis === "T" ? [primary()] : isSingle() ? [slots[1]] : slots;
    try {
      state.playing = true; paintPlay();
      await Promise.all(active.map(function (p) { return p.video.play(); }));
      if (epoch !== state.epoch || !state.playing) return;
      cancelAnimationFrame(state.raf); state.raf = requestAnimationFrame(tick);
    } catch (error) {
      if (epoch !== state.epoch || error.name === "AbortError") return;
      pause(); toast("视频尚未就绪，请稍后从头播放。");
    }
  }
  function ended(p) {
    if (!state.playing) return;
    if (state.axis === "T" && p.id === "left") {
      state.temporal = "right"; state.clock = current().cut;
      slots[0].video.pause(); slots[1].video.currentTime = 0;
      slots[1].video.playbackRate = state.speed;
      slots[1].video.play().catch(function () { pause(); });
      paintTime(); return;
    }
    if (p !== primary()) return;
    state.clock = current().duration; pause();
    slots.forEach(function (slot) { setLocalTime(slot, state.clock); });
    paintTime();
    if ($("loopToggle").checked) { seek(0, false); play(); }
  }
  slots.forEach(function (p) {
    p.video.addEventListener("ended", function () { ended(p); });
    p.video.addEventListener("click", function () { state.playing ? pause() : play(); });
    p.video.addEventListener("loadeddata", function () { p.loading.hidden = true; });
    p.video.addEventListener("error", function () { if (p.clip) { p.loading.hidden = false; p.loading.textContent = "视频载入失败"; } });
  });
  function filtered() {
    var query = state.search.trim().toLowerCase();
    return scenes.filter(function (s) { return (state.group === "all" || s.group === state.group) && (!query || [s.id, s.name, s.short, s.en, s.topic, s.engine].join(" ").toLowerCase().includes(query)); });
  }
  function renderNav() {
    var list = filtered(), html = "", group = "";
    list.forEach(function (s) {
      if (group !== s.group) { group = s.group; html += '<div class="list-group-title">' + esc(s.groupLabel) + " / " + (group === "rigid" ? "RIGID" : "CLOTH") + "</div>"; }
      html += '<button class="scene-item' + (s.id === state.scene ? " active" : "") + '" data-scene="' + s.id + '" aria-pressed="' + String(s.id === state.scene) + '" aria-label="打开' + esc(s.short) + '"><img src="' + s.clips.REF.poster + '" alt="" loading="lazy"><span><strong>' + esc(s.short) + (s.id === "FLAG" ? " · 归档" : "") + '</strong><small><span>' + s.id + '</span><span class="scene-number">' + fmt(s.duration) + " s</span></small></span></button>";
    });
    $("sceneList").innerHTML = html || '<p class="empty-search">没有匹配的场景。试试“布料”“碰撞”或场景编号。</p>';
    $("navCount").textContent = list.length + " / 8";
    document.querySelectorAll("[data-group]").forEach(function (b) { var on = b.dataset.group === state.group; b.classList.toggle("active", on); b.setAttribute("aria-pressed", String(on)); });
  }
  function updateURL() {
    var hash = "scene=" + encodeURIComponent(state.scene) + "&axis=" + state.axis + "&view=" + state.layout;
    try { history.replaceState(null, "", location.pathname + location.search + "#" + hash); } catch (_) { /* File previews may restrict history. */ }
  }
  function closeDrawer() { document.body.classList.remove("drawer-open"); $("drawerOverlay").hidden = true; }
  function setScene(id) {
    if (!byId[id]) return;
    state.scene = id;
    if (state.group !== "all" && current().group !== state.group) state.group = "all";
    state.search = ""; $("sceneSearch").value = "";
    closeDrawer(); loadCurrent();
  }
  function setAxis(axis) { if (!axes.includes(axis)) return; state.axis = axis; loadCurrent(); }
  function syncUI() {
    var s = current(), axis = state.axis, isT = axis === "T", single = isSingle();
    document.title = s.short + " · " + axis + " | Real2SimBench";
    $("sceneTitle").textContent = s.name; $("sceneDescription").textContent = s.description;
    $("sceneGroup").textContent = s.groupLabel; $("sceneId").textContent = s.id;
    $("sceneEdition").hidden = !["R04", "FLAG"].includes(s.id); $("sceneEdition").textContent = s.id === "FLAG" ? "历史归档" : "错层铰接 v002";
    $("scenePosition").textContent = String(scenes.indexOf(s) + 1).padStart(2, "0") + " / 08";
    $("topicHint").textContent = s.topic; $("factTopic").textContent = s.topic;
    $("factEngine").textContent = s.engine; $("factWindow").textContent = "0–" + fmt(s.duration) + " s";
    $("factSampling").textContent = s.fps + " fps · " + s.clips.REF.frames + " 帧";
    $("sourceFooter").textContent = s.version + " · 原始视频";
    $("sourceText").textContent = s.source; $("scopeText").textContent = s.scope; $("sourceLink").href = s.url;
    $("videoGrid").classList.toggle("single", single);
    $("videoGrid").classList.toggle("temporal", isT);
    $("splitView").classList.toggle("active", !single); $("singleView").classList.toggle("active", single);
    $("splitView").setAttribute("aria-pressed", String(!single)); $("singleView").setAttribute("aria-pressed", String(single));
    $("splitView").disabled = axis === "REF"; $("singleView").disabled = isT;
    document.querySelectorAll("[data-axis]").forEach(function (b) { var on = b.dataset.axis === axis; b.classList.toggle("active", on); b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    $("modeHint").innerHTML = '<span class="status-dot"></span>' + (isT ? "观测 → 未来 · 顺序播放" : single ? "原始仿真视频" : "同一物理时刻对照");
    $("totalTime").textContent = fmt(s.duration);
    $("timeline").max = String(s.duration); $("timeline").step = String(1 / s.fps);
    $("timelineHint").textContent = isT ? "连续物理时钟 · 切点 " + fmt(s.cut) + " s" : "物理时钟 · 调速不改变源轨迹";
    $("cutActions").hidden = !isT; $("cutLine").hidden = !isT;
    var percent = 100 * s.cut / s.duration;
    $("cutLine").style.left = percent + "%";
    $("observedZone").style.width = isT ? percent + "%" : "0";
    $("futureZone").style.width = isT ? (100 - percent) + "%" : "0";
    $("axisPill").textContent = axis;
    var titles = { REF: "基准条件", A: "初始条件与驱动", E: s.id === "R01" ? "重力场扩展" : "环境与约束", V: "观察视角", T: "时间外推" };
    var intros = { REF: "从释放或规定运动开始，观看这个场景的完整基准过程。", A: "改变初始条件或已知驱动，比较运动如何随之变化。", E: s.id === "R01" ? "本例改变重力场，作为单独的 E 扩展展示。" : "改变环境几何或边界约束，观察同一个物理系统的响应。", V: "同一条原生仿真轨迹，从另一个固定机位观看。", T: "同一条 REF 轨迹按时间切分，先观测，再查看未见的未来。" };
    $("inspectorTitle").textContent = titles[axis]; $("inspectorIntro").textContent = intros[axis];
    var values = axis === "A" || axis === "E" ? s[axis] : axis === "V" ? ["物理状态与运动", "REF 轨迹", "同一轨迹"] : axis === "T" ? ["源物理时间范围", "0–" + fmt(s.clips.T_OBS.end) + " s", fmt(s.cut) + "–" + fmt(s.duration) + " s"] : ["完整物理窗口", "0.00 s", fmt(s.duration) + " s"];
    $("parameterName").textContent = values[0]; $("beforeValue").textContent = values[1]; $("afterValue").textContent = values[2];
    $("presentationChange").textContent = values[0] + "  ·  " + values[1] + "  →  " + values[2];
    $("beforeName").textContent = isT ? "观测" : axis === "REF" ? "开始" : "REF";
    $("afterName").textContent = isT ? "未来" : axis === "REF" ? "结束" : axis;
    $("interventionCaption").textContent = isT ? "时间切分" : axis === "V" ? "保持一致" : axis === "REF" ? "基准设定" : "本次改变";
    $("interventionText").textContent = axis === "A" || axis === "E" ? s.interventions[axis] : axis === "V" ? "网格、材料点轨迹、物理条件与外观保持 REF，仅改变相机外参。" : isT ? "观测与未来片段无重叠，拼合覆盖完整 REF；播放按连续源物理时钟接续。" : s.topic + "。原始基准是各泛化对照的起点。";
    $("sceneNote").textContent = s.note;
    $("slowStart").hidden = !(s.id === "R02" && axis === "A");
    renderNav(); updateURL(); paintPlay(); paintTime();
    window.dispatchEvent(new CustomEvent("gallery:selection", { detail: { scene: s.id, axis: axis } }));
  }
  function attach(p, clip, badge, label) {
    if (p.abort) p.abort.abort();
    p.abort = new AbortController();
    var signal = p.abort.signal;
    p.clip = clip; p.loading.textContent = "载入视频"; p.loading.hidden = false;
    $(p.id + "Badge").textContent = badge; $(p.id + "Label").textContent = label;
    $(p.id + "Meta").textContent = clip.frames + " 帧 · " + clip.fps + " fps · " + fmt(clip.start) + "–" + fmt(clip.end) + " s";
    $(p.id + "Download").href = clip.src; $(p.id + "Download").download = "Real2SimBench_" + state.scene + "_" + badge + ".mp4";
    p.video.setAttribute("aria-label", current().short + " " + badge + " " + label);
    return new Promise(function (resolve, reject) {
      p.video.addEventListener("loadedmetadata", function () { resolve(); }, { once: true, signal: signal });
      p.video.addEventListener("error", function () { reject(new Error("Video unavailable")); }, { once: true, signal: signal });
      signal.addEventListener("abort", function () { reject(new DOMException("Scene switched", "AbortError")); }, { once: true });
      p.video.poster = clip.poster; p.video.src = clip.src; p.video.playbackRate = state.speed; p.video.load();
    });
  }
  async function loadCurrent() {
    pause(); state.epoch++; var epoch = state.epoch, s = current(), axis = state.axis;
    state.loading = true; state.failed = false; state.clock = 0; state.temporal = "left"; document.body.dataset.ready = "false"; syncUI();
    var left = axis === "T" ? s.clips.T_OBS : s.clips.REF;
    var right = axis === "T" ? s.clips.T_FUTURE : axis === "REF" ? s.clips.REF : s.clips[axis];
    var labels = { REF: "基准条件", A: "初态 / 驱动", E: s.id === "R01" ? "重力场变化" : "环境 / 约束", V: "新观察视角" };
    try {
      await Promise.all([attach(slots[0], left, axis === "T" ? "T_OBS" : "REF", axis === "T" ? "观测段" : "基准条件"), attach(slots[1], right, axis === "T" ? "T_FUTURE" : axis, axis === "T" ? "未来段" : labels[axis])]);
      if (epoch !== state.epoch) return;
      state.loading = false; state.seeking = false;
      slots.forEach(function (p) { if (p.video.readyState >= 2) p.loading.hidden = true; });
      seek(0, false); paintPlay(); document.body.dataset.ready = "true";
    } catch (error) {
      if (epoch !== state.epoch || error.name === "AbortError") return;
      state.loading = false; state.failed = true; paintPlay(); toast("视频暂时无法载入。点击从头重播可重试。");
    }
  }
  function layout(view) {
    if (state.axis === "T" || state.axis === "REF") return;
    var wasPlaying = state.playing, clock = state.clock; pause(); state.layout = view; syncUI(); seek(clock, false); if (wasPlaying) play();
  }
  function openDialog(id) { pause(); $(id).showModal(); }
  $("playBtn").addEventListener("click", function () { state.playing ? pause() : play(); });
  $("resetBtn").addEventListener("click", function () { if (state.failed) loadCurrent(); else { seek(0, false); play(); } });
  $("backFrame").addEventListener("click", function () { if (!state.loading) seek(state.clock - 1 / current().fps, false); });
  $("forwardFrame").addEventListener("click", function () { if (!state.loading) seek(state.clock + 1 / current().fps, false); });
  $("timeline").addEventListener("input", function () { if (!state.loading) seek(Number(this.value), false); });
  $("speedSelect").addEventListener("change", function () { state.speed = Number(this.value); slots.forEach(function (p) { p.video.playbackRate = state.speed; }); });
  $("slowStart").addEventListener("click", function () { state.speed = .25; $("speedSelect").value = "0.25"; slots.forEach(function (p) { p.video.playbackRate = .25; }); seek(0, false); play(); });
  $("observeBtn").addEventListener("click", function () { seek(0, false); play(); });
  $("futureBtn").addEventListener("click", function () { seek(current().cut, false); play(); });
  $("splitView").addEventListener("click", function () { layout("split"); });
  $("singleView").addEventListener("click", function () { layout("single"); });
  document.querySelectorAll("[data-axis]").forEach(function (b) { b.addEventListener("click", function () { setAxis(b.dataset.axis); }); });
  document.querySelectorAll("[data-group]").forEach(function (b) { b.addEventListener("click", function () { state.group = b.dataset.group; state.search = ""; $("sceneSearch").value = ""; var list = filtered(); if (list.length && !list.some(function (s) { return s.id === state.scene; })) state.scene = list[0].id; loadCurrent(); }); });
  $("sceneSearch").addEventListener("input", function () { state.search = this.value; renderNav(); });
  $("sceneSearch").addEventListener("keydown", function (event) { if (event.key === "Enter" && filtered().length) setScene(filtered()[0].id); });
  $("sceneList").addEventListener("click", function (event) { var b = event.target.closest("[data-scene]"); if (b) setScene(b.dataset.scene); });
  function changeScene(delta) { var list = filtered(), index = list.findIndex(function (s) { return s.id === state.scene; }); if (!list.length) list = scenes; setScene(list[(Math.max(0, index) + delta + list.length) % list.length].id); }
  $("prevScene").addEventListener("click", function () { changeScene(-1); }); $("nextScene").addEventListener("click", function () { changeScene(1); });
  $("openDrawer").addEventListener("click", function () { document.body.classList.add("drawer-open"); $("drawerOverlay").hidden = false; });
  $("closeDrawer").addEventListener("click", closeDrawer); $("drawerOverlay").addEventListener("click", closeDrawer);
  $("overviewGrid").innerHTML = scenes.map(function (s) { return '<button class="overview-card" data-scene="' + s.id + '"><img src="' + s.clips.REF.poster + '" alt="' + esc(s.short) + '" loading="lazy"><div><small>' + s.id + " / " + esc(s.groupLabel) + "</small><h3>" + esc(s.name) + "</h3><p>" + esc(s.topic) + " · " + fmt(s.duration) + " s</p></div></button>"; }).join("");
  $("overviewGrid").addEventListener("click", function (event) { var b = event.target.closest("[data-scene]"); if (b) { $("overviewDialog").close(); setScene(b.dataset.scene); } });
  $("overviewBtn").addEventListener("click", function () { openDialog("overviewDialog"); });
  $("helpBtn").addEventListener("click", function () { openDialog("helpDialog"); }); $("dataBtn").addEventListener("click", function () { openDialog("dataDialog"); });
  document.querySelectorAll("[data-close-dialog]").forEach(function (b) { b.addEventListener("click", function () { b.closest("dialog").close(); }); });
  document.querySelectorAll("dialog").forEach(function (dialog) { dialog.addEventListener("click", function (event) { if (event.target === dialog) { var r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }); });
  async function present() {
    var active = document.body.classList.toggle("presentation");
    $("presentBtn").setAttribute("aria-pressed", String(active));
    $("presentBtn").querySelector("span").textContent = active ? "退出演示" : "演示模式";
    try { if (active && !document.fullscreenElement && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else if (!active && document.fullscreenElement) await document.exitFullscreen(); } catch (_) { /* Expanded layout is available when browser fullscreen is not. */ }
  }
  $("presentBtn").addEventListener("click", present);
  document.addEventListener("fullscreenchange", function () { if (!document.fullscreenElement) { document.body.classList.remove("presentation"); $("presentBtn").querySelector("span").textContent = "演示模式"; $("presentBtn").setAttribute("aria-pressed", "false"); } });
  $("copyLink").addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(location.href); toast(location.protocol === "file:" ? "本机展示地址已复制；在线分享请使用已发布网址。" : "已复制当前场景与泛化轴的分享链接");
    } catch (_) { toast("当前浏览器不允许自动复制，可直接复制地址栏链接。"); }
  });
  function readHash() {
    var p = new URLSearchParams(location.hash.slice(1));
    if (byId[p.get("scene")]) state.scene = p.get("scene");
    if (axes.includes(p.get("axis"))) state.axis = p.get("axis");
    if (["single", "split"].includes(p.get("view"))) state.layout = p.get("view");
  }
  window.addEventListener("hashchange", function () { readHash(); state.group = "all"; state.search = ""; $("sceneSearch").value = ""; loadCurrent(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); });
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey || document.querySelector("dialog[open]")) return;
    var editable = event.target.closest("input,select,textarea,[contenteditable=true]"); if (editable) return;
    var key = event.key.toLowerCase();
    var activeTab = event.target.closest("[role=tab]");
    if (activeTab && ["arrowleft", "arrowright"].includes(key)) {
      event.preventDefault(); var index = axes.indexOf(activeTab.dataset.axis);
      var next = axes[(index + (key === "arrowright" ? 1 : -1) + axes.length) % axes.length];
      setAxis(next); document.querySelector('[data-axis="' + next + '"]').focus(); return;
    }
    if (key === " " && !event.target.closest("button,a,summary")) { event.preventDefault(); state.playing ? pause() : play(); }
    else if (key === "arrowleft") { event.preventDefault(); seek(state.clock - 1 / current().fps, false); }
    else if (key === "arrowright") { event.preventDefault(); seek(state.clock + 1 / current().fps, false); }
    else if (["a", "e", "v", "t", "r"].includes(key)) { event.preventDefault(); setAxis(key === "r" ? "REF" : key.toUpperCase()); }
    else if (key === "f") { event.preventDefault(); present(); }
    else if (key === "/") { event.preventDefault(); if (matchMedia("(max-width:720px)").matches) { document.body.classList.add("drawer-open"); $("drawerOverlay").hidden = false; } $("sceneSearch").focus(); }
    else if (/^[1-8]$/.test(key)) setScene(scenes[Number(key) - 1].id);
    else if (key === "?") openDialog("helpDialog");
    else if (key === "escape") closeDrawer();
  });
  if (window.SHOWCASE_LOCAL_RESOURCES) {
    $("localResources").hidden = false;
    $("localResources").innerHTML = "<b>本机完整评测包</b>" + window.SHOWCASE_LOCAL_RESOURCES.map(function (r) { return '<a href="' + esc(r.href) + '">' + esc(r.label) + "</a>"; }).join("");
  }
  readHash(); loadCurrent();
})();
