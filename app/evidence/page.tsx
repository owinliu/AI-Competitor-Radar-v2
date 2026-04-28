import fs from "fs";
import path from "path";


type ContentAnalysisItem = {
  competitor: string;
  latestVersion: string;
  previousVersion: string;
  screenshotCount: number;
  focus: string[];
  newWords: string[];
  latestOcrSnippet?: string;
};

type VersionItem = {
  competitor: string;
  platform: string;
  market: string;
  trackId: number;
  trackName: string;
  sellerName: string;
  bundleId: string;
  version: string;
  currentVersionReleaseDate: string;
  releaseNotes: string;
  appStoreUrl: string;
  iconUrl: string;
  screenshotUrls: string[];
  screenshotSource?: string;
  androidMarketUrl?: string;
  capturedAt: string;
};

function loadTimeline(): VersionItem[] {
  const p = path.join(process.cwd(), "data", "app-version-timeline.json");
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed as VersionItem[];
}

function loadContentAnalysis(): ContentAnalysisItem[] {
  const p = path.join(process.cwd(), "data", "screenshot-content-analysis.json");
  if (!fs.existsSync(p)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(p, "utf8"));
    return Array.isArray(parsed?.items) ? (parsed.items as ContentAnalysisItem[]) : [];
  } catch {
    return [];
  }
}

function loadSnapshots(): any[] {
  const p = path.join(process.cwd(), "data", "monitoring-snapshots.json");
  if (!fs.existsSync(p)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(p, "utf8"));
    return Array.isArray(parsed?.snapshots) ? parsed.snapshots : [];
  } catch {
    return [];
  }
}

function toTime(s?: string) {
  if (!s) return 0;
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function fmtDate(s?: string) {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString("zh-CN", { hour12: false });
}

function dedupeByVersion(items: VersionItem[]) {
  const map = new Map<string, VersionItem>();
  for (const item of items) {
    const prev = map.get(item.version);
    if (!prev) {
      map.set(item.version, item);
      continue;
    }
    if (toTime(item.capturedAt) > toTime(prev.capturedAt)) {
      map.set(item.version, item);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) =>
      toTime(b.currentVersionReleaseDate || b.capturedAt) -
      toTime(a.currentVersionReleaseDate || a.capturedAt)
  );
}

function compareNotes(latest?: string, previous?: string) {
  const latestLines = (latest || "")
    .split(/\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
  const prevSet = new Set(
    (previous || "")
      .split(/\n+/)
      .map((x) => x.trim())
      .filter(Boolean)
  );
  return latestLines.filter((line) => !prevSet.has(line)).slice(0, 4);
}

function buildRawLines(competitor: string, snippet: string, releaseNotes: string) {
  const manual: Record<string, string[]> = {
    "奇富借条": ["额度最高20万", "快捷申请（仅需3步）", "灵活还款", "最长30天免息", "限时年化利率4.8%起"],
    "安逸花": ["额度最高20万", "安全可靠", "正规持牌金融机构旗下产品", "快速放款", "申请便捷", "灵活分期", "随借随用"],
    "小赢": ["美股上市公司", "最高额度200000", "线上申请", "最快5分钟审批", "期限灵活"],
    "度小满": ["最高额度200000", "年化利率7.29%起", "借1万元1天利息2元起", "面向22~55周岁非学生用户提供借款服务"],
    "分期乐": ["中国国家击剑队官方合作伙伴", "分期借钱", "分期购物", "专业分期借款借钱购物App"],
  };

  const base = manual[competitor] || [];
  const text = `${snippet || ""}\n${releaseNotes || ""}`.replace(/\s+/g, " ");
  const extra = (text.match(/(额度最高\d+万|最高额度\d+|年化利率[0-9.]+%起|最长\d+天免息|最快\d+分钟审批|灵活还款|灵活分期|快速放款|线上申请|申请便捷)/g) || [])
    .map((x) => x.trim());

  return Array.from(new Set([...base, ...extra]));
}

export default function AppVersionUpdatesPage() {
  const rows = loadTimeline();
  const contentAnalysis = loadContentAnalysis();
  const snapshots = loadSnapshots();
  const latestSnap = snapshots[snapshots.length - 1];
  const competitorOptions = Array.from(new Set(rows.map((r) => r.competitor)));
  const filtered = rows;

  const grouped = new Map<string, VersionItem[]>();
  for (const row of filtered) {
    const arr = grouped.get(row.competitor) || [];
    arr.push(row);
    grouped.set(row.competitor, arr);
  }

  const competitorPairs = [...grouped.entries()].map(([name, items]) => {
    const uniqueVersions = dedupeByVersion(items);
    return {
      name,
      latest: uniqueVersions[0],
      previous: uniqueVersions[1],
      count: uniqueVersions.length,
    };
  });

  const productBullets = [
    { name: "奇富借条", bullets: ["额度最高20万", "快捷申请（仅需3步）", "最长30天免息", "限时年化利率4.8%起"] },
    { name: "小赢", bullets: ["美股上市公司", "最高额度200000", "线上申请", "最快5分钟审批"] },
    { name: "安逸花", bullets: ["额度最高20万", "正规持牌金融机构旗下产品", "快速放款", "申请便捷"] },
    { name: "度小满", bullets: ["最高额度200000", "年化利率7.29%起", "借1万元1天利息2元起", "面向22~55周岁非学生用户提供借款服务"] },
    { name: "分期乐", bullets: ["中国国家击剑队官方合作伙伴", "分期借钱", "分期购物", "专业分期借款借钱购物App"] },
  ];

  const bossConclusions = [
    {
      title: "高额度+低成本诉求最强",
      text: "奇富借条、安逸花在截图中更集中强调额度、免息、利率与申请效率。",
      evidence: "奇富借条：额度最高20万、最长30天免息、年化利率4.8%起；安逸花：额度最高20万、快速放款、申请便捷。",
    },
    {
      title: "效率转化话术高频出现",
      text: "小赢、安逸花、奇富借条都在强调快速审批/申请便捷/快速放款。",
      evidence: "小赢：线上申请、最快5分钟审批；安逸花：申请便捷、快速放款；奇富借条：快捷申请（仅需3步）。",
    },
    {
      title: "品牌背书型表达",
      text: "分期乐、度小满截图中出现较多品牌/机构背书与合规提示表达。",
      evidence: "分期乐：中国国家击剑队官方合作伙伴；度小满：面向22~55周岁非学生用户提供借款服务。",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#061b31]">APP版本更新｜本轮关键变化总览</h1>
        <p className="mt-3 text-sm text-[#334155]">
          本轮五家竞品在APP层面总体呈现“借贷入口前置 + 运营触达增强 + 服务承接优化”三条主线；
          其中小赢与奇富借条变化密度较高，分期乐在借钱/首页转化表达调整更明显。
        </p>
        <div className="mt-4 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：{latestSnap?.id || "本期"}</p>
          <p>覆盖样本：5家产品 / APP相关变化位点</p>
          <p>数据说明：部分位点仍存在基线缺口，已标注待补图</p>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">各产品主打信息</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {productBullets.map((x) => (
            <div key={x.name} className="rounded-lg border p-3">
              <p className="text-sm font-medium">{x.name}</p>
              {x.bullets.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                  {x.bullets.map((b) => (
                    <li key={`${x.name}-${b}`}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">-</p>
              )}
            </div>
          ))}
        </div>

        <details className="mt-4 rounded-lg border p-3">
          <summary className="cursor-pointer text-sm font-medium">查看详细对比（原话）</summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="border-b px-3 py-2">产品</th>
                  <th className="border-b px-3 py-2">主打方向</th>
                  <th className="border-b px-3 py-2">截图原话关键词（去重）</th>
                </tr>
              </thead>
              <tbody>
                {productBullets.map((x) => (
                  <tr key={`row-${x.name}`}>
                    <td className="border-b px-3 py-2 font-medium">{x.name}</td>
                    <td className="border-b px-3 py-2">截图原话卖点</td>
                    <td className="border-b px-3 py-2 text-muted-foreground">{x.bullets.join("、") || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      {competitorPairs.map(({ name, latest, previous, count }) => {
        const noteDiff = compareNotes(latest?.releaseNotes, previous?.releaseNotes);
        const latestShots = (latest?.screenshotUrls || []).slice(0, 4);
        const prevShots = (previous?.screenshotUrls || []).slice(0, 4);
        const maxShots = Math.max(latestShots.length, prevShots.length, 1);

        return (
          <section key={name} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{name}</h2>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">历史版本数：{count}</span>
            </div>

            {!latest ? (
              <p className="mt-3 text-sm text-muted-foreground">暂无版本数据。</p>
            ) : !previous ? (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                当前仅有一个版本快照（v{latest.version}），还不能做最近两次对比。请后续抓到新版本后再对比。
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium">
                    版本对比：v{previous.version} → <span className="text-primary">v{latest.version}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    上次发布：{fmtDate(previous.currentVersionReleaseDate)} ｜ 本次发布：{fmtDate(latest.currentVersionReleaseDate)}
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">本次新增/变化更新点（基于文案）</p>
                      {noteDiff.length ? (
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                          {noteDiff.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">暂无可识别的新增文案差异。</p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>应用名：{latest.trackName}</p>
                      <p className="mt-1">市场：{latest.market}</p>
                      <p className="mt-1">截图来源：{latest.screenshotSource || "未获取"}</p>
                      <p className="mt-1">抓取时间：{fmtDate(latest.capturedAt)}</p>
                      <a href={latest.appStoreUrl} target="_blank" className="mt-2 inline-block text-blue-600 underline">
                        查看应用市场页面
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="mb-2 text-sm font-medium">上一版本截图（v{previous.version}）</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {Array.from({ length: maxShots }).map((_, i) => {
                        const url = prevShots[i];
                        return url ? (
                          <a key={url} href={url} target="_blank" className="block rounded border bg-slate-50 p-2">
                            <img
                              src={url}
                              alt={`${name}-prev-${i + 1}`}
                              className="h-64 w-full rounded object-contain"
                            />
                          </a>
                        ) : (
                          <div key={`prev-empty-${i}`} className="flex h-64 items-center justify-center rounded border border-dashed text-xs text-muted-foreground">
                            无对应截图
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="mb-2 text-sm font-medium">最新版本截图（v{latest.version}）</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {Array.from({ length: maxShots }).map((_, i) => {
                        const url = latestShots[i];
                        return url ? (
                          <a key={url} href={url} target="_blank" className="block rounded border bg-slate-50 p-2">
                            <img
                              src={url}
                              alt={`${name}-latest-${i + 1}`}
                              className="h-64 w-full rounded object-contain"
                            />
                          </a>
                        ) : (
                          <div key={`latest-empty-${i}`} className="flex h-64 items-center justify-center rounded border border-dashed text-xs text-muted-foreground">
                            无对应截图
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })}

      {rows.length === 0 && (
        <section className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          暂无版本快照数据。请先运行 <code>npm run market:fetch</code> 生成演示数据。
        </section>
      )}

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">快照归档</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="px-2 py-2">快照</th><th className="px-2 py-2">时间</th><th className="px-2 py-2">版本变更竞品数</th><th className="px-2 py-2">记录数</th></tr></thead>
            <tbody>
              {[...snapshots].reverse().map((s: any) => (
                <tr key={s.id} className="border-b"><td className="px-2 py-2">{s.id}</td><td className="px-2 py-2">{fmtDate(s.createdAt)}</td><td className="px-2 py-2">{s.appUpdates?.changedCompetitors ?? 0}</td><td className="px-2 py-2">{s.appUpdates?.totalRecords ?? 0}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
