import fs from "fs";
import path from "path";


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

export default function AppVersionUpdatesPage() {
  const rows = loadTimeline();
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
