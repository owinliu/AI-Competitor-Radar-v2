import { getAllReports, getReportBySlug, type Insight } from "@/lib/reports";
import DashboardProductFocusClient from "@/components/dashboard-product-focus-client";

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

function buildCompetitorHighlights(insights: Insight[]) {
  const byCompetitor = new Map<string, { text: string; weight: number }[]>();
  for (const x of insights) {
    const uncertain = /无法判断|无法跨期|缺图|待复核/.test(x.conclusion || "");
    if (uncertain) continue;
    const arr = byCompetitor.get(x.competitor) || [];
    const weight = x.impact === "高" ? 3 : x.impact === "中" ? 2 : 1;
    arr.push({ text: `${dimLabel(x.dimension)} · ${x.page || "未标注页面"}：${x.conclusion}`, weight });
    byCompetitor.set(x.competitor, arr);
  }

  return new Map(
    Array.from(byCompetitor.entries()).map(([competitor, rows]) => {
      const uniq = Array.from(new Map(rows.map((r) => [r.text, r])).values())
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 4)
        .map((r) => r.text);
      return [competitor, uniq];
    })
  );
}

function classifyChangeType(text: string) {
  const t = text || "";
  if (/结构|路径|主链路|入口|改版|重心|转为|切换/.test(t)) return "策略级";
  if (/活动|弹窗|文案|素材|主题|运营|触达|横幅/.test(t)) return "运营级";
  return "一般更新";
}

function buildNarrativeSummary(latestInsights: Insight[]) {
  const valid = latestInsights.filter((x) => !/无法判断|缺图|待复核|无法跨期/.test(x.conclusion || ""));
  const competitors = Array.from(new Set(valid.map((x) => x.competitor)));

  const pickEvidenceBalanced = (rows: Insight[], max = 3) => {
    const byComp = new Map<string, Insight[]>();
    for (const r of rows) {
      const arr = byComp.get(r.competitor) || [];
      arr.push(r);
      byComp.set(r.competitor, arr);
    }
    const picked: Insight[] = [];
    for (const c of byComp.keys()) {
      if (picked.length >= max) break;
      const first = byComp.get(c)?.[0];
      if (first) picked.push(first);
    }
    return picked.slice(0, max).map((r) => `${r.competitor}/${dimLabel(r.dimension)}/${r.page || "未标注"}`).join("；");
  };

  const has = (rows: Insight[], re: RegExp) => rows.some((r) => re.test(`${r.page || ""} ${r.conclusion || ""}`));

  const productModes = competitors.map((c) => {
    const rows = valid.filter((x) => x.competitor === c);
    const tags: string[] = [];
    if (has(rows, /借钱|额度|银行卡|降息|免息|提额/)) tags.push("转化前置");
    if (has(rows, /活动|消息|通知|横幅|弹窗|主题|代言/)) tags.push("运营触达增强");
    if (has(rows, /客服|会话|服务大厅|IM|消息中心/)) tags.push("服务承接增强");
    if (has(rows, /结构稳定|主链路总体稳定|框架保持稳定|局部信息层有更新/)) tags.push("消金链路稳态微调");
    if (!tags.length) tags.push("常规迭代优化");

    return `${c}当前模式：${tags.join(" + ")}。[证据锚点：${pickEvidenceBalanced(rows, 2)}]`;
  });

  const appRows = valid.filter((x) => x.dimension === "APP");
  const csRows = valid.filter((x) => x.dimension === "客服");
  const opRows = valid.filter((x) => x.dimension === "留存促活运营");

  const commonModes: string[] = [];
  if (new Set(appRows.map((x) => x.competitor)).size >= 3) {
    commonModes.push(`APP层面共性：各产品普遍加强借贷入口与权益表达，重心偏向转化前置。[证据锚点：${pickEvidenceBalanced(appRows)}]`);
  }
  if (new Set(csRows.map((x) => x.competitor)).size >= 3) {
    commonModes.push(`客服层面共性：会话承接与快速响应路径持续优化，强调连续服务体验。[证据锚点：${pickEvidenceBalanced(csRows)}]`);
  }
  if (new Set(opRows.map((x) => x.competitor)).size >= 3) {
    commonModes.push(`运营层面共性：活动主题与触达位迭代密集，以内容运营强化品牌与转化。[证据锚点：${pickEvidenceBalanced(opRows)}]`);
  }
  if (!commonModes.length) commonModes.push("本期共性模式尚不稳定，暂不做统一策略判断。[证据锚点：-]");

  const profiles = competitors.map((c) => {
    const rows = valid.filter((x) => x.competitor === c);
    const strategyCnt = rows.filter((x) => classifyChangeType(x.conclusion) === "策略级").length;
    const opCnt = rows.filter((x) => classifyChangeType(x.conclusion) === "运营级").length;
    const total = Math.max(rows.length, 1);
    return {
      competitor: c,
      rows,
      strategyRatio: strategyCnt / total,
      operationRatio: opCnt / total,
    };
  });

  const strategyDriven = profiles.filter((p) => p.strategyRatio >= 0.45 && p.strategyRatio > p.operationRatio + 0.1);
  const operationDriven = profiles.filter((p) => p.operationRatio >= 0.45 && p.operationRatio > p.strategyRatio + 0.1);
  const balanced = profiles.filter((p) => !strategyDriven.includes(p) && !operationDriven.includes(p));

  const diffModes: string[] = [];
  const pct = (n: number) => `${Math.round(n * 100)}%`;

  if (strategyDriven.length) {
    const anchorRows = strategyDriven.flatMap((p) => p.rows.filter((x) => classifyChangeType(x.conclusion) === "策略级"));
    const ratioText = strategyDriven.map((x) => `${x.competitor}(策略${pct(x.strategyRatio)}/运营${pct(x.operationRatio)})`).join("、");
    diffModes.push(`${ratioText}偏策略级分化：主路径/入口/结构调整更突出。[证据锚点：${pickEvidenceBalanced(anchorRows)}]`);
  }
  if (operationDriven.length) {
    const anchorRows = operationDriven.flatMap((p) => p.rows.filter((x) => classifyChangeType(x.conclusion) === "运营级"));
    const ratioText = operationDriven.map((x) => `${x.competitor}(策略${pct(x.strategyRatio)}/运营${pct(x.operationRatio)})`).join("、");
    diffModes.push(`${ratioText}偏运营级分化：活动位、文案、触达策略更新更密集。[证据锚点：${pickEvidenceBalanced(anchorRows)}]`);
  }
  if (balanced.length) {
    const anchorRows = balanced.flatMap((p) => p.rows.slice(0, 1));
    const ratioText = balanced.map((x) => `${x.competitor}(策略${pct(x.strategyRatio)}/运营${pct(x.operationRatio)})`).join("、");
    diffModes.push(`${ratioText}偏均衡型：策略与运营同步迭代，暂无单侧偏移。[证据锚点：${pickEvidenceBalanced(anchorRows)}]`);
  }
  if (!diffModes.length) diffModes.push("本期差异模式不明显，主要是常规优化延续。[证据锚点：-]");

  return {
    productModes: productModes.slice(0, 5),
    commonModes: commonModes.slice(0, 3),
    diffModes: diffModes.slice(0, 3),
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
  const narrative = buildNarrativeSummary(latestInsights);
  const highlights = buildCompetitorHighlights(latestInsights);
  const productTrends = buildProductDimensionTrends(reports);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">竞品变化仪表盘</h1>
        <p className="mt-2 text-sm text-muted-foreground">首页优先回答：本期谁变化最多、变化集中在哪些维度、共性与分化是什么、趋势如何。</p>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">产品变动排序（本期）</h2>
        <p className="mt-1 text-xs text-muted-foreground">左侧选择竞品，右侧同步展示该竞品的维度饼图。</p>
        <DashboardProductFocusClient
          items={compHeat.map((item) => ({
            competitor: item.competitor,
            count: item.count,
            values: breakdown.find((x) => x.competitor === item.competitor)?.values || [],
            highlights: highlights.get(item.competitor) || [],
          }))}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">整体结论：单产品模式</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {narrative.productModes.map((x, i) => <li key={`p-${i}`}>{x}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">整体结论：全产品共性模式</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {narrative.commonModes.map((x, i) => <li key={`c-${i}`}>{x}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">整体结论：差异模式</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {narrative.diffModes.map((x, i) => <li key={`d-${i}`}>{x}</li>)}
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
