/* Public data contains released artifacts only. Private queries are never read here. */
(function () {
  "use strict";
  var panel = document.getElementById("evaluationPanel"), data;
  var selection = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
  var names = { semantic_tips: "TIPS 视觉语义 ↑", equal_timestamp_dynamic_chamfer: "等时动态 Chamfer ↓", interpenetration: "Interpenetration ↑", dynamic_iou: "Dynamic IoU ↑", scene_3d: "Scene3D ↑", occupancy_dtw: "Occupancy DTW ↑", trajectory_dtw: "Trajectory DTW ↑", emd_step: "EMD step ↑", mesh_watertight: "网格封闭性（诊断）", mesh_manifold: "流形网格 ↑", mesh_clean_faces: "有效面片 ↑", mesh_no_self_intersection: "无自交网格 ↑" };
  var labels = { queued: "未启动", agent_running: "模型正在构建", offline_rebuild: "源码已冻结，重建核查中", ready_for_scoring: "尝试已结束，逐项评分中", format_failure_original_video_missing: "格式失败：原提交缺必需视频", query_delivery_failure: "查询重建未交付必需视频", finished_incomplete_delivery: "提交不完整", operator_pipeline_error: "管线失败", blocked: "等待完整 GT 与物理验收", ok: "可用", unavailable: "缺失", uncomputable: "不可计算", error: "计算失败", timeout: "超时", gate_failed: "格式门槛未通过", deferred: "暂缓" };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  labels.source_rebuild_timeout = "源码重建超时：产物指标单列";
  labels.agent_budget_timeout_with_artifact = "模型达到6h时限：有效产物与重建单列";
  labels.pending = "待计算";
  function link(x, title) { return x ? '<a ' + (x.kind === "page" ? '' : 'download ') + 'href="' + esc(x.href) + '">' + title + '<small>' + (x.sha256 ? esc(x.sha256.slice(0, 12)) + '… · SHA256' : '分卷下载与完整性校验') + '</small></a>' : '<span class="download-pending">' + title + '<small>等待发布条件</small></span>'; }
  function render() {
    if (!data) return;
    var scene = selection.scene || "R01", axis = selection.axis || "A", record = data.scenes[scene];
    if (!record) return;
    var job = record.tasks[axis], lines = [], downloads = record.downloads || {};
    lines.push('<div class="eval-heading"><div><span class="eyebrow">GPT EVALUATION / VERIFIED ARTIFACTS</span><h2>模型重建与下载</h2></div><span class="eval-model">Codex · gpt-6.1-sol · medium</span></div>');
    lines.push('<p class="eval-scope">八场景：R01–R04、S01、S02、S05、抽桌布。已完成视频先行展示，分数逐项补充。抽桌布已替换旗帜，提供 REF、T 前后段、A、V 及 GPT 对照；严格 E 视频待验收。</p>');
    lines.push('<p class="eval-warning">旧七场景 GT 在评测前已公开可得，现有访问审计不能证明无污染。分项分数不等于整体物理准确率；缺失与超时单列。</p>');
    if (record.archived) lines.push('<p class="eval-warning">FLAG 是旧版本归档，成绩不计入本轮正式八场景。</p>');
    if (!job) lines.push('<p class="eval-status">选择 T / A / E / V 查看对应尝试。T 的模型未来段对应上方 T_FUTURE，观测段单独报告。</p>');
    else {
      var visibleStatus = job.formal_submission_status || job.phase;
      lines.push('<p class="eval-status"><b>' + esc(scene + " / " + axis) + '</b><span>' + esc(labels[visibleStatus] || visibleStatus) + '</span></p>');
      if (job.publication_hold) lines.push('<p class="eval-note">本任务视频尚未就绪或仍待验收。已完成视频不等待评分；完整 GT 与源码下载另行整理。</p>');
      if (job.delivery_note) lines.push('<p class="eval-warning">' + esc(job.delivery_note) + '</p>');
      if (job.V_flags) lines.push('<p class="eval-note">V 的三维几何读数不证明相机或视频遵从。物理轨迹不变性：' + (job.V_flags.physical_invariance_violation === false ? '未检测到违例' : job.V_flags.physical_invariance_violation === true ? '存在违例' : '待核验') + '；已知相机约定：' + (job.V_flags.camera_contract_violation === false ? '通过' : job.V_flags.camera_contract_violation === true ? '存在违例' : '待核验') + '。</p>');
      if (job.comparison) lines.push('<figure class="eval-video"><video controls playsinline preload="metadata" src="' + esc(job.comparison.href) + '" aria-label="GT 左侧与 GPT 右侧对照"></video><figcaption>GT 左 / GPT 右 · ' + (axis === "T" ? "T_FUTURE" : esc(axis)) + ' · 同一源时间窗口</figcaption></figure>');
      if (job.prediction) lines.push('<details class="eval-prediction"><summary>单独查看 GPT 生成视频</summary><video controls playsinline preload="none" src="' + esc(job.prediction.href) + '" aria-label="GPT 生成视频"></video><a download href="' + esc(job.prediction.href) + '">下载模型视频</a></details>');
      if (job.prediction && (!job.metrics || !job.metrics.some(function (m) { return m.status === "ok"; }))) lines.push('<p class="eval-note">模型视频已生成；评分待补充。</p>');
      if (job.metrics && job.metrics.length) {
        lines.push('<div class="eval-metrics">');
        job.metrics.forEach(function (m) { lines.push('<div class="eval-metric"><span>' + esc(names[m.metric] || m.metric) + '</span><strong>' + (m.status === "ok" && Number.isFinite(m.value) ? Number(m.value).toPrecision(6) : esc(labels[m.status] || m.status)) + '</strong><small>' + esc(m.window) + (m.reading_class ? " · " + esc(m.reading_class) : "") + (m.reason ? " · " + esc(m.reason) : "") + '</small></div>'); });
        lines.push('</div>');
      }
      if (job.diagnostic_metrics && job.diagnostic_metrics.length) {
        lines.push('<details class="eval-method"><summary>旧 per-window-aligned 兼容诊断（与主评分分栏）</summary><div class="eval-metrics">');
        job.diagnostic_metrics.forEach(function (m) { lines.push('<div class="eval-metric"><span>' + esc(names[m.metric] || m.metric) + '</span><strong>' + (m.status === "ok" && Number.isFinite(m.value) ? Number(m.value).toPrecision(6) : esc(labels[m.status] || m.status)) + '</strong><small>' + esc(m.window) + ' · 独立窗口配准诊断</small></div>'); });
        lines.push('</div></details>');
      }
      if (job.version_binding) {
        lines.push('<details class="eval-method"><summary>提交、GT 与冻结版本 SHA256</summary><p>指标卡的数据快照同时保存 metric JSON SHA 与 fit manifest SHA；相同 T_OBS/T_FUTURE 复用同一观测配准。</p><div class="eval-bindings">');
        Object.entries(job.version_binding).forEach(function (v) { if (v[1] != null) lines.push('<p><span>' + esc(v[0]) + '</span><code title="' + esc(v[1]) + '">' + esc(v[1]) + '</code></p>'); });
        lines.push('</div></details>');
      }
    }
    if (axis === "E" && record.E_scope) lines.push('<p class="eval-note">E 分类：' + esc(record.E_scope.group) + '。' + esc(record.E_scope.interpretation) + '</p>');
    lines.push('<div class="eval-downloads">' + link(downloads.gt, "GT 数据包") + link(downloads.source, "GT 生成代码") + link(downloads.prediction_source, "GPT 冻结源码") + '</div>');
    lines.push('<details class="eval-method"><summary>指标口径、版本与访问审计</summary><p>' + esc(record.release) + '。视频与评测输入逐项 SHA256 核对。TIPS 反映视觉语义相似度；等时 Chamfer 使用 GT 初始动态点云半径归一，越低越好。两者均不能单独证明动力学或接触正确。原始互穿读数受开放布面与连接几何影响。</p><p>mesh_watertight 是网格几何诊断。开放布料曲面本来可以不封闭，其 0 读数不能直接解释成物理失败，也不用于跨类别 Overall。</p><p>兼容固定 4DCodeBench 指标，不等同原论文榜单；缺失、失败、超时分别列示，绝不补 0，不计算 Overall。DINOv3 与相关 GeoPhys 暂缓。</p><p>旧 GT 展示早于评测公开可得；已有网络访问日志审计只发现模型服务域名，未发现展厅或 GT 路径访问模式。这不构成无污染证明。抽桌布 T/A/V 的当前模型源码已冻结，本次先发布已准入展示视频；后续任务将记录这一公开时间。</p></details>');
    lines.push('<details class="eval-method"><summary>配准窗口、单次尝试与隔离边界</summary><p>主评分采用 observed/reference-frozen_v1：T 只用 T_OBS，A/E 只用 q_ref，冻结变换、采样权重与伙伴再应用目标窗口。V 使用独立已知相机版本，只用该任务自己的 REF 拟合，并传递同一世界映射；相机遵从与物理不变性另列，不用隐藏窗口重新拟合。T 同时报观测段和未来段。Scene3D 本身只比较该窗口首帧；Dynamic IoU 与 TIPS 不使用空间配准。旧独立窗口配准保留在兼容诊断栏，不计作新版主评分。</p><p>每任务固定模型、medium、单次6h预算。15份命令构造期基础设施失败在模型调用与其计时建立前发生，原证据保留；修复后才首启真实尝试，未重试已运行模型。缺失、重建超时与模型超时分别列示。</p><p>同构建器实测中宿主 GT、native、私有 query 和其他任务路径均不可见。模型阶段持有自己的认证与网络代理；查询阶段不挂载认证、代理或参考视频，但固定程序副本可写。这不构成无污染或不可逃逸证明。</p></details>');
    lines.push('<p class="eval-updated">数据快照：' + esc(data.updated_beijing) + ' · 成绩逐项更新，任务结束不等于提交合格。</p>');
    panel.innerHTML = lines.join("");
  }
  window.addEventListener("gallery:selection", function (event) { panel.querySelectorAll("video").forEach(function (v) { v.pause(); }); selection = event.detail; render(); });
  fetch("data/evaluation.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("manifest unavailable"); return r.json(); }).then(function (x) { data = x; render(); }).catch(function () { panel.innerHTML = '<p class="eval-note">评测数据暂未载入。原始 GT 视频可继续播放与下载。</p>'; });
})();
