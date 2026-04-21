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

function buildPromoThemes(text: string) {
  const t = text || "";
  const rules = [
    { key: "体验流畅", re: /(体验|流畅|性能|稳定|修复|优化|升级)/ },
    { key: "借款转化", re: /(借款|借钱|额度|分期|申请|放款|提额)/ },
    { key: "权益优惠", re: /(优惠|免息|券|福利|折扣|活动|奖励)/ },
    { key: "安全合规", re: /(安全|隐私|风控|认证|合规|保护)/ },
    { key: "服务运营", re: /(客服|服务|消息|提醒|运营|触达)/ },
  ];

  const hit = rules.filter((r) => r.re.test(t)).map((r) => r.key);
  return hit.length ? hit : ["常规维护"];
}

function buildVisualSignals(latestShots: string[], prevShots: string[]) {
  const latest = latestShots.filter(Boolean);
  const prev = prevShots.filter(Boolean);
  const latestSet = new Set(latest);
  const prevSet = new Set(prev);
  const overlap = [...latestSet].filter((x) => prevSet.has(x)).length;
  const overlapRate = latest.length ? overlap / latest.length : 0;

  const tags: string[] = [];
  if (latest.length && prev.length) tags.push("双版本有图");
  if (latest.length > prev.length) tags.push("展示素材扩张");
  if (latest.length < prev.length) tags.push("展示素材收敛");
  if (latest.length === prev.length && overlapRate < 0.4 && latest.length > 0) tags.push("素材替换明显");
  if (latest.length === prev.length && overlapRate >= 0.7 && latest.length > 0) tags.push("素材延续稳定");
  if (!latest.length) tags.push("当前版本缺图");
  if (!prev.length) tags.push("上一版本缺图");

  return tags.length ? tags : ["图像信号有限"];
}

export default function AppVersionUpdatesPage() {
  const rows = loadTimeline();
  const contentAnalysis = loadContentAnalysis();
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

  const promoSummary = competitorPairs.map(({ name, latest, previous }) => {
    const latestText = latest?.releaseNotes || "";
    const diffText = compareNotes(latest?.releaseNotes, previous?.releaseNotes).join("；");
    const themes = buildPromoThemes(`${latestText}\n${diffText}`);
    const latestShots = (latest?.screenshotUrls || []).filter(Boolean);
    const prevShots = (previous?.screenshotUrls || []).filter(Boolean);
    const visualSignals = buildVisualSignals(latestShots, prevShots);
    const shotCount = latestShots.length;
    return {
      name,
      themes,
      visualSignals,
      signal: diffText || (latestText ? "文案有更新，但差异点不明显" : "暂无文案信息"),
      shotCount,
      screenshotSource: latest?.screenshotSource || (shotCount > 0 ? "已获取（历史来源）" : "未获取"),
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">APP版本更新（最近两次迭代对比）</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          当前为手动抓取演示：从 App Store CN 拉取竞品版本信息与商店截图，按竞品展示最近两次版本迭代对比。
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          手动更新命令：<code>npm run market:fetch</code>
        </p>
      </section>

      <section className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
        当前线上静态页已固定展示全部竞品（共 {competitorOptions.length} 个），如需筛选可先用浏览器页面查找（⌘/Ctrl + F）。
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">应用市场宣传重点差异（截图文字+内容级识别）</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          说明：基于版本文案 + 截图OCR提取文本 + 双版本截图对比信号综合生成。
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {promoSummary.map((x) => {
            const ca = contentAnalysis.find((i) => i.competitor === x.name);
            const focus = ca?.focus?.length ? ca.focus : x.themes;
            const newWords = ca?.newWords?.slice(0, 8) || [];
            return (
              <div key={x.name} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{x.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">截图状态：{x.shotCount > 0 ? `已获取 ${x.shotCount} 张` : "未获取"}（来源：{x.screenshotSource}）</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {focus.map((t) => (
                    <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{t}</span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {x.visualSignals.map((t) => (
                    <span key={t} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{t}</span>
                  ))}
                </div>
                {newWords.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">截图/文案新词：{newWords.join("、")}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3">文案差异信号：{x.signal}</p>
              </div>
            );
          })}
        </div>
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
    </div>
  );
}
