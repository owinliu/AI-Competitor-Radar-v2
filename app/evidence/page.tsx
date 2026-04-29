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

function loadMarketConclusions(): Record<string, string> {
  const p = path.join(process.cwd(), "data", "evidence_market_conclusions.json");
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) || {};
  } catch {
    return {};
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
  const marketConclusions = loadMarketConclusions();
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
  ].map((item) => {
    const latest = competitorPairs.find((x) => x.name === item.name)?.latest;
    return {
      ...item,
      iconUrl: latest?.iconUrl || "",
      screenshots: [],
    };
  });

  const bossConclusions = [
    "行业竞争重点继续前移至入口效率与触达效率。",
    "本期APP端首屏与借贷入口表达变化更明显。",
    "运营活动仍是短期转化拉动的高频抓手。",
  ];

  const diffSummary = [
    "分期乐：APP维度变化最明显，转化前置信号增强。",
    "度小满：品牌信息流切换营销主题，活动露出增强。",
    "安逸花：首页架构转向内容+借款并列。",
    "奇富借条：运营活动触达延续高频。",
    "小赢：活动驱动与转化导向并行。",
  ];

  const totalScreenshotCount = competitorPairs.reduce((sum, x) => sum + (x.latest?.screenshotUrls?.length || 0), 0);
  function buildMarketScreenshotConclusion(prevList: string[], latestList: string[]) {
    if (!prevList.length && latestList.length) return `仅抓取到本期${latestList.length}张截图，缺少上期对照，暂判为新增观察。`;
    if (prevList.length && !latestList.length) return `仅抓取到上期${prevList.length}张截图，本期截图缺失，无法完成有效对比。`;

    const prevSet = new Set(prevList);
    const latestSet = new Set(latestList);
    const kept = prevList.filter((u) => latestSet.has(u)).length;
    const replaced = Math.max(prevList.length, latestList.length) - kept;
    const add = Math.max(0, latestList.length - prevList.length);
    const remove = Math.max(0, prevList.length - latestList.length);

    if (replaced >= 3 || (kept <= 1 && latestList.length >= 4)) {
      return `应用市场截图对比显示变化明显：保留${kept}张，替换/新增变化位约${replaced}处（上期${prevList.length}张→本期${latestList.length}张）。`;
    }
    if (replaced >= 1 || add > 0 || remove > 0) {
      return `应用市场截图对比显示中等变化：保留${kept}张，存在${replaced}处替换或数量变化（上期${prevList.length}张→本期${latestList.length}张）。`;
    }
    return `应用市场截图整体稳定：上期与本期均为${latestList.length}张，截图集合基本一致。`;
  }

  const evidenceRows = competitorPairs.map(({ name, latest, previous }) => {
    const prevList = previous?.screenshotUrls || [];
    const latestList = latest?.screenshotUrls || [];
    const conclusion = marketConclusions[name] || buildMarketScreenshotConclusion(prevList, latestList);

    return {
      competitor: name,
      conclusion,
      prevList,
      latestList,
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#061b31]">详细追踪分析｜本轮关键结论总览</h1>
        <div className="mt-3 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：2026-W15（0408重读）</p>
          <p>覆盖样本：5家产品 / APP</p>
          <p>数据说明：来源于app截图共（{totalScreenshotCount}张），部分一级页面。</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">本轮关键结论</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">{bossConclusions.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">差异总结</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">{diffSummary.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">各产品主打信息</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {productBullets.map((x) => (
            <div key={x.name} className="rounded-lg border p-3">
              <div className="flex items-center gap-2">
                {x.iconUrl ? <img src={x.iconUrl} alt={`${x.name} 图标`} className="h-8 w-8 rounded-lg border border-slate-200" /> : null}
                <p className="text-sm font-medium">{x.name}</p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">{x.bullets.map((b) => <li key={`${x.name}-${b}`}>{b}</li>)}</ul>

            </div>
          ))}
        </div>
      </section>


      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">更新日志变化观察</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="px-2 py-2">竞品</th><th className="px-2 py-2">最新版本</th><th className="px-2 py-2">上一版本</th><th className="px-2 py-2">更新时间</th><th className="px-2 py-2">新增日志要点</th><th className="px-2 py-2">观察</th></tr></thead>
            <tbody>
              {competitorPairs.map(({ name, latest, previous }) => {
                const noteDiff = compareNotes(latest?.releaseNotes, previous?.releaseNotes);
                const obs = noteDiff.length
                  ? (noteDiff.some((x) => /(活动|优惠|券|免息|福利)/.test(x))
                      ? "本期更新偏运营活动与转化触达。"
                      : noteDiff.some((x) => /(修复|优化|稳定|性能)/.test(x))
                      ? "本期更新偏体验优化与稳定性。"
                      : "本期更新存在新增文案，建议结合截图复核影响等级。")
                  : "未识别到显著新增日志文案。";
                return (
                  <tr key={`log-${name}`} className="border-b align-top">
                    <td className="px-2 py-2 font-medium">{name}</td>
                    <td className="px-2 py-2">{latest?.version || "—"}</td>
                    <td className="px-2 py-2">{previous?.version || "—"}</td>
                    <td className="px-2 py-2 text-xs text-muted-foreground">{fmtDate(latest?.currentVersionReleaseDate || latest?.capturedAt)}</td>
                    <td className="px-2 py-2">{noteDiff.length ? <ul className="list-disc pl-4 text-xs text-muted-foreground">{noteDiff.slice(0,3).map((n) => <li key={`${name}-${n}`}>{n}</li>)}</ul> : "—"}</td>
                    <td className="px-2 py-2 text-xs">{obs}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">证据明细表</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="px-2 py-2">竞品</th><th className="px-2 py-2">结论</th><th className="px-2 py-2">上期截图</th><th className="px-2 py-2">本期截图</th></tr></thead>
            <tbody>
              {evidenceRows.map((r) => (
                <tr key={r.competitor} className="border-b align-top">
                  <td className="whitespace-nowrap px-2 py-2 font-medium">{r.competitor}</td><td className="w-[280px] max-w-[280px] px-2 py-2 text-sm leading-6">{r.conclusion}</td>
                  <td className="min-w-[500px] px-2 py-2">
                    <div className="flex flex-wrap gap-2">
                      {r.prevList?.length ? r.prevList.map((src: string) => (
                        <a key={`${r.competitor}-prev-${src}`} href={src} target="_blank" rel="noreferrer" className="shrink-0">
                          <img src={src} alt="上期截图" className="h-[220px] w-[150px] rounded-md border border-slate-300 object-cover" />
                        </a>
                      )) : "—"}
                    </div>
                  </td>
                  <td className="min-w-[500px] px-2 py-2">
                    <div className="flex flex-wrap gap-2">
                      {r.latestList?.length ? r.latestList.map((src: string) => (
                        <a key={`${r.competitor}-latest-${src}`} href={src} target="_blank" rel="noreferrer" className="shrink-0">
                          <img src={src} alt="本期截图" className="h-[220px] w-[150px] rounded-md border border-slate-300 object-cover" />
                        </a>
                      )) : "—"}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
