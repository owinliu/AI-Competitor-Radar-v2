import { getAllReports, getReportBySlug, type Insight } from "@/lib/reports";

const DIMENSIONS = ["APP", "风控", "客服", "消金", "留存促活运营"] as const;

function dimLabel(dim: string) {
  return dim === "留存促活运营" ? "运营" : dim;
}

function countByCompetitor(insights: Insight[]) {
  const map = new Map<string, number>();
  for (const x of insights) map.set(x.competitor, (map.get(x.competitor) || 0) + 1);
  return Array.from(map.entries())
    .map(([competitor, count]) => ({ competitor, count }))
    .sort((a, b) => b.count - a.count);
}

function competitorDimensionBreakdown(insights: Insight[]) {
  const competitors = Array.from(new Set(insights.map((x) => x.competitor)));
  return competitors.map((c) => {
    const values = DIMENSIONS.map((d) => ({ dimension: d, count: insights.filter((x) => x.competitor === c && x.dimension === d).length }));
    const total = values.reduce((n, x) => n + x.count, 0);
    return { competitor: c, total, values };
  });
}

function keyChanges(insights: Insight[]) {
  const map = new Map<string, { competitor: string; dimension: string; page: string; count: number; sample: string }>();
  for (const x of insights) {
    const page = x.page || "未标注页面";
    const key = `${x.competitor}__${x.dimension}__${page}`;
    const prev = map.get(key);
    if (prev) prev.count += 1;
    else map.set(key, { competitor: x.competitor, dimension: x.dimension, page, count: 1, sample: x.conclusion });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 12);
}

function buildConic(values: { dimension: string; count: number }[]) {
  const palette: Record<string, string> = {
    APP: "#334155",
    风控: "#7c3aed",
    客服: "#0f766e",
    消金: "#b45309",
    留存促活运营: "#be123c",
  };
  const total = values.reduce((n, x) => n + x.count, 0) || 1;
  let start = 0;
  const parts = values
    .filter((x) => x.count > 0)
    .map((x) => {
      const pct = (x.count / total) * 100;
      const end = start + pct;
      const seg = `${palette[x.dimension] || "#64748b"} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      start = end;
      return seg;
    });
  return `conic-gradient(${parts.join(", ")})`;
}

function buildConsensus(latestInsights: Insight[]) {
  const competitors = Array.from(new Set(latestInsights.map((x) => x.competitor)));
  const byDim = DIMENSIONS.map((d) => {
    const products = competitors.filter((c) => latestInsights.some((x) => x.competitor === c && x.dimension === d));
    return { dimension: d, products, coverage: products.length };
  });

  const common = byDim.filter((x) => x.coverage >= 3).sort((a, b) => b.coverage - a.coverage).slice(0, 3);
  const diff = byDim.filter((x) => x.coverage <= 2).sort((a, b) => a.coverage - b.coverage).slice(0, 3);

  return {
    common: common.map((x) => `${dimLabel(x.dimension)}在${x.coverage}个产品出现变化（${x.products.join("、")}）`),
    diff: diff.map((x) => `${dimLabel(x.dimension)}分化明显，仅${x.coverage}个产品出现变化（${x.products.join("、") || "暂无"}）`),
  };
}

function buildProductDimensionTrends(reports: ReturnType<typeof getAllReports>) {
  const recentReports = reports.slice(0, 4).sort((a, b) => (a.date > b.date ? 1 : -1));
  const details = recentReports.map((r) => ({ meta: r, data: getReportBySlug(r.slug) }));
  const competitors = Array.from(new Set(details.flatMap((x) => (x.data?.insights || []).map((i) => i.competitor))));

  return competitors.map((c) => {
    const weeks = details.map(({ meta, data }) => {
      const rows = (data?.insights || []).filter((x) => x.competitor === c);
      const dimCounts = DIMENSIONS.map((d) => ({ dim: d, count: rows.filter((x) => x.dimension === d).length }));
      const top = [...dimCounts].sort((a, b) => b.count - a.count)[0];
      return { date: meta.date, total: rows.length, topDim: top?.dim || "APP", topDimCount: top?.count || 0 };
    });

    const change = weeks.length >= 2 ? weeks[weeks.length - 1].total - weeks[weeks.length - 2].total : 0;
    const direction = change > 0 ? "上升" : change < 0 ? "回落" : "持平";

    return { competitor: c, weeks, direction, change };
  });
}

export default function DashboardPage() {
  const reports = getAllReports();
  const latestMeta = reports[0];
  const latest = latestMeta ? getReportBySlug(latestMeta.slug) : null;

  if (!latest) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">仪表盘</h1>
        <p className="mt-2 text-sm text-muted-foreground">暂无可展示报告数据。</p>
      </div>
    );
  }

  const latestInsights = latest.insights;
  const compHeat = countByCompetitor(latestInsights);
  const breakdown = competitorDimensionBreakdown(latestInsights);
  const changes = keyChanges(latestInsights);
  const consensus = buildConsensus(latestInsights);
  const productTrends = buildProductDimensionTrends(reports);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">竞品变化仪表盘</h1>
        <p className="mt-2 text-sm text-muted-foreground">首页优先回答：本期谁变化最多、变化集中在哪些维度、共性与分化是什么、趋势如何。</p>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">产品变动排序（本期）</h2>
        <p className="mt-1 text-xs text-muted-foreground">鼠标悬停产品行可查看该产品维度构成饼图。</p>
        <div className="mt-4 space-y-3">
          {compHeat.map((item) => {
            const max = Math.max(compHeat[0]?.count || 1, 1);
            const width = `${Math.max((item.count / max) * 100, 4)}%`;
            const dist = breakdown.find((x) => x.competitor === item.competitor);
            const pie = buildConic(dist?.values || []);
            return (
              <div key={item.competitor} className="group rounded border p-3 hover:bg-muted/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.competitor}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 rounded bg-slate-100">
                      <div className="h-2 rounded bg-slate-800" style={{ width }} />
                    </div>
                  </div>

                  <div className="hidden items-center gap-3 rounded border bg-white p-2 group-hover:flex">
                    <div className="h-14 w-14 rounded-full border" style={{ background: pie }} />
                    <div className="text-xs text-muted-foreground">
                      {(dist?.values || []).filter((x) => x.count > 0).map((x) => (
                        <p key={`${item.competitor}-${x.dimension}`}>{dimLabel(x.dimension)}：{x.count}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">整体结论：一致变化</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {consensus.common.length > 0 ? consensus.common.map((x, i) => <li key={`c-${i}`}>{x}</li>) : <li>暂无明显一致变化</li>}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">整体结论：差异变化</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {consensus.diff.length > 0 ? consensus.diff.map((x, i) => <li key={`d-${i}`}>{x}</li>) : <li>暂无明显分化</li>}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">变化趋势（按产品看维度）</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b px-3 py-2">产品</th>
                <th className="border-b px-3 py-2">近4周总变动（从旧到新）</th>
                <th className="border-b px-3 py-2">本期主变化维度</th>
                <th className="border-b px-3 py-2">趋势判断</th>
              </tr>
            </thead>
            <tbody>
              {productTrends.map((row) => {
                const latestWeek = row.weeks[row.weeks.length - 1];
                return (
                  <tr key={row.competitor}>
                    <td className="border-b px-3 py-2 font-medium">{row.competitor}</td>
                    <td className="border-b px-3 py-2">{row.weeks.map((w) => w.total).join(" → ")}</td>
                    <td className="border-b px-3 py-2">{dimLabel(latestWeek?.topDim || "APP")}（{latestWeek?.topDimCount || 0}）</td>
                    <td className="border-b px-3 py-2 text-muted-foreground">{row.direction}{row.change !== 0 ? `（${row.change > 0 ? "+" : ""}${row.change}）` : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">本期具体变化（Top 12）</h2>
        <p className="mt-1 text-xs text-muted-foreground">按“页面内变化点位数量”排序，先定位变化最密集的位置。</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b px-3 py-2">排名</th>
                <th className="border-b px-3 py-2">产品</th>
                <th className="border-b px-3 py-2">维度</th>
                <th className="border-b px-3 py-2">页面</th>
                <th className="border-b px-3 py-2">变动点位数</th>
                <th className="border-b px-3 py-2">摘要</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((x, idx) => (
                <tr key={`${x.competitor}-${x.dimension}-${x.page}`}>
                  <td className="border-b px-3 py-2">{idx + 1}</td>
                  <td className="border-b px-3 py-2">{x.competitor}</td>
                  <td className="border-b px-3 py-2">{dimLabel(x.dimension)}</td>
                  <td className="border-b px-3 py-2">{x.page}</td>
                  <td className="border-b px-3 py-2 font-semibold">{x.count}</td>
                  <td className="border-b px-3 py-2 text-muted-foreground">{x.sample || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
