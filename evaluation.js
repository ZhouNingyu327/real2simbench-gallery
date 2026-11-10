/* Public data contains released artifacts only. Private queries are never read here. */
(function () {
  "use strict";
  var panel = document.getElementById("evaluationPanel"), data;
  var selection = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
  var names = { semantic_tips: "TIPS 视觉语义 ↑", equal_timestamp_dynamic_chamfer: "等时动态 Chamfer ↓", interpenetration: "Interpenetration ↑", dynamic_iou: "Dynamic IoU ↑", scene_3d: "Scene3D ↑", occupancy_dtw: "Occupancy DTW ↑", trajectory_dtw: "Trajectory DTW ↑", emd_step: "EMD step ↑", mesh_watertight: "封闭网格 ↑", mesh_manifold: "流形网格 ↑", mesh_clean_faces: "有效面片 ↑", mesh_no_self_intersection: "无自交网格 ↑" };
  var labels = { queued: "未启动", agent_running: "模型正在构建", offline_rebuild: "源码已冻结，重建核查中", ready_for_scoring: "尝试已结束，逐项评分中", format_failure_original_video_missing: "格式失败：原提交缺必需视频", query_delivery_failure: "查询重建未交付必需视频", finished_incomplete_delivery: "提交不完整", operator_pipeline_error: "管线失败", blocked: "等待完整 GT 与物理验收", ok: "可用", unavailable: "缺失", uncomputable: "不可计算", error: "计算失败", timeout: "超时", gate_failed: "格式门槛未通过", deferred: "暂缓" };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  labels.source_rebuild_timeout = "源码重建超时：产物指标单列";
  function link(x, title) { return x ? '<a ' + (x.kind === "page" ? '' : 'download ') + 'href="' + esc(x.href) + '">' + title + '<small>' + (x.sha256 ? esc(x.sha256.slice(0, 12)) + '… · SHA256' : '分卷下载与完整性校验') + '</small></a>' : '<span class="download-pending">' + title + '<small>等待发布条件</small></span>'; }
  function render() {
    if (!data) return;
    var scene = selection.scene || "R01", axis = selection.axis || "A", record = data.scenes[scene];
    if (!record) return;
    var job = record.tasks[axis], lines = [], downloads = record.downloads || {};
    lines.push('<div class="eval-heading"><div><span class="eyebrow">GPT EVALUATION / VERIFIED ARTIFACTS</span><h2>模型重建与下载</h2></div><span class="eval-model">Codex · gpt-6.1-sol · medium</span></div>');
    lines.push('<p class="eval-scope">正式更新范围：R01–R04、S01、S02、S05、抽桌布。FLAG 保留为历史展示；抽桌布仍待完整验收。</p>');
    if (record.archived) lines.push('<p class="eval-warning">FLAG 是旧版本归档，成绩不计入本轮正式八场景。</p>');
    if (!job) lines.push('<p class="eval-status">选择 T / A / E / V 查看对应尝试。T 的模型未来段对应上方 T_FUTURE，观测段单独报告。</p>');
    else {
      var visibleStatus = job.formal_submission_status || job.phase;
      lines.push('<p class="eval-status"><b>' + esc(scene + " / " + axis) + '</b><span>' + esc(labels[visibleStatus] || visibleStatus) + '</span></p>');
      if (job.publication_hold) lines.push('<p class="eval-note">该场景全部独立尝试源码冻结后，再发布新增模型视频、成绩与完整下载。</p>');
      if (job.delivery_note) lines.push('<p class="eval-warning">' + esc(job.delivery_note) + '</p>');
      if (job.comparison) lines.push('<figure class="eval-video"><video controls playsinline preload="metadata" src="' + esc(job.comparison.href) + '" aria-label="GT 左侧与 GPT 右侧对照"></video><figcaption>GT 左 / GPT 右 · ' + (axis === "T" ? "T_FUTURE" : esc(axis)) + ' · 同一源时间窗口</figcaption></figure>');
      if (job.prediction) lines.push('<details class="eval-prediction"><summary>单独查看 GPT 生成视频</summary><video controls playsinline preload="none" src="' + esc(job.prediction.href) + '" aria-label="GPT 生成视频"></video><a download href="' + esc(job.prediction.href) + '">下载模型视频</a></details>');
      if (job.metrics && job.metrics.length) {
        lines.push('<div class="eval-metrics">');
        job.metrics.forEach(function (m) { lines.push('<div class="eval-metric"><span>' + esc(names[m.metric] || m.metric) + '</span><strong>' + (m.status === "ok" && Number.isFinite(m.value) ? Number(m.value).toPrecision(6) : esc(labels[m.status] || m.status)) + '</strong><small>' + esc(m.window) + (m.reading_class ? " · " + esc(m.reading_class) : "") + (m.reason ? " · " + esc(m.reason) : "") + '</small></div>'); });
        lines.push('</div>');
      }
    }
    if (axis === "E" && record.E_scope) lines.push('<p class="eval-note">E 分类：' + esc(record.E_scope.group) + '。' + esc(record.E_scope.interpretation) + '</p>');
    lines.push('<div class="eval-downloads">' + link(downloads.gt, "GT 数据包") + link(downloads.source, "GT 生成代码") + link(downloads.prediction_source, "GPT 冻结源码") + '</div>');
    lines.push('<details class="eval-method"><summary>指标口径、版本与访问审计</summary><p>' + esc(record.release) + '。视频与评测输入逐项 SHA256 核对。TIPS 反映视觉语义相似度；等时 Chamfer 使用 GT 初始动态点云半径归一，越低越好。两者均不能单独证明动力学或接触正确。原始互穿读数受开放布面与连接几何影响。</p><p>兼容固定 4DCodeBench 指标，不等同原论文榜单；缺失、失败、超时分别列示，绝不补 0，不计算 Overall。DINOv3 与相关 GeoPhys 暂缓。</p><p>旧 GT 展示早于评测公开可得；已有网络访问日志审计只发现模型服务域名，未发现展厅或 GT 路径访问模式。这不构成无污染证明。新桌布内容在物理验收与相关源码冻结后发布。</p></details>');
    lines.push('<details class="eval-method"><summary>配准窗口与文件隔离边界</summary><p>原 Scene3D、Occupancy DTW、Trajectory DTW、EMD step 在各自窗口独立配准，保留为 per-window-aligned 兼容诊断；不能据此声称满足 T 仅观测帧配准。新的 observed/reference-frozen_v1 只在 T_OBS 或 q_ref 拟合变换与匹配，再冻结应用到目标窗口。Scene3D 本身只比较该窗口首帧。Dynamic IoU 与 TIPS 不使用该空间配准。</p><p>同一沙箱构建器的只读实测中，宿主 GT、native、私有 query 和其他任务路径均不可见。模型阶段按设计持有自己的认证文件与网络代理；查询阶段不挂载认证、代理或参考视频，但自己的源码副本可写。这些证据不构成无污染或不可逃逸证明。</p></details>');
    lines.push('<p class="eval-updated">数据快照：' + esc(data.updated_beijing) + ' · 成绩逐项更新，任务结束不等于提交合格。</p>');
    panel.innerHTML = lines.join("");
  }
  window.addEventListener("gallery:selection", function (event) { panel.querySelectorAll("video").forEach(function (v) { v.pause(); }); selection = event.detail; render(); });
  fetch("data/evaluation.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("manifest unavailable"); return r.json(); }).then(function (x) { data = x; render(); }).catch(function () { panel.innerHTML = '<p class="eval-note">评测数据暂未载入。原始 GT 视频可继续播放与下载。</p>'; });
})();
