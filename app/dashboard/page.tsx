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

  const productModes = competitors.map((c) => {
    const rows = valid.filter((x) => x.competitor === c);
    const tags: string[] = [];
    if (has(rows, /借钱|额度|银行卡|降息|免息|提额/)) tags.push("转化前置");
    if (has(rows, /活动|消息|通知|横幅|弹窗|主题|代言/)) tags.push("运营触达增强");
    if (has(rows, /客服|会话|服务大厅|IM|消息中心/)) tags.push("服务承接增强");
    if (has(rows, /结构稳定|主链路总体稳定|框架保持稳定|局部信息层有更新/)) tags.push("消金链路稳态微调");
    if (!tags.length) tags.push("常规迭代优化");
    return `${c}当前模式：${tags.join(" + ")}`;
  });

  return {
    productModes: productModes.slice(0, 5),
    commonModes: commonModes.slice(0, 3),
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
      <div className="rounded-md border border-[#e5edf5] bg-white p-6">
        <h1 className="text-xl font-semibold text-[#061b31]">仪表盘</h1>
        <p className="mt-2 text-sm text-[#64748d]">暂无可展示报告数据。</p>
      </div>
    );
  }

  const latestInsights = latest.insights;
  const compHeat = countByCompetitor(latestInsights);
  const breakdown = competitorDimensionBreakdown(latestInsights);
  const narrative = buildNarrativeSummary(latestInsights);
  const productTrends = buildProductDimensionTrends(reports);
  const competitorCount = new Set(latestInsights.map((x) => x.competitor)).size;
  const validCount = latestInsights.filter((x) => !/无法判断|缺图|待复核|无法跨期/.test(x.conclusion || "")).length;
  const validRatio = Math.round((validCount / (latestInsights.length || 1)) * 100);

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#061b31]">本期结论总览</h1>
        <p className="mt-3 text-sm text-[#334155]">
          本期竞品整体呈现“转化前置 + 触达增强”趋势，建议优先关注高影响变化项与可执行动作。
        </p>
        <div className="mt-4 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：{latestMeta?.date || "-"}</p>
          <p>覆盖样本：{competitorCount}家竞品 / {latestInsights.length}条变化</p>
          <p>可判断占比：{validRatio}%</p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-[#e5edf5] bg-[#fafcff] p-4">
            <h3 className="text-base font-semibold text-[#061b31]">关键结论1（高）</h3>
            <p className="mt-2 text-sm text-[#334155]">运营触达是本期最密集变化位点。</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#64748d]">
              <li>小赢运营维度占比最高（9条）。</li>
              <li>度小满活动主题切换，触达表达增强。</li>
            </ul>
            <p className="mt-2 text-sm text-[#334155]">建议动作：复盘“活动位→借钱页”转化链路。</p>
          </div>

          <div className="rounded-md border border-[#e5edf5] bg-[#fafcff] p-4">
            <h3 className="text-base font-semibold text-[#061b31]">关键结论2（高）</h3>
            <p className="mt-2 text-sm text-[#334155]">APP层持续借贷入口前置，转化导向增强。</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#64748d]">
              <li>分期乐借钱页从“降息”转向“绑卡快借”。</li>
              <li>安逸花首页改为“内容/社区+借款并列”。</li>
            </ul>
            <p className="mt-2 text-sm text-[#334155]">建议动作：评估我方首页借款入口层级与首屏点击率。</p>
          </div>

          <div className="rounded-md border border-[#e5edf5] bg-[#fafcff] p-4">
            <h3 className="text-base font-semibold text-[#061b31]">关键结论3（中）</h3>
            <p className="mt-2 text-sm text-[#334155]">客服侧以承接效率优化为主，结构改版少。</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#64748d]">
              <li>分期乐IM历史会话展示拉长。</li>
              <li>度小满对话页结构稳定，推荐问句有更新。</li>
            </ul>
            <p className="mt-2 text-sm text-[#334155]">建议动作：对标首轮解决率与会话承接路径。</p>
          </div>
        </div>
      </section>


      <section className="rounded-md border border-[#e5edf5] bg-white p-5">
        <h2 className="text-base font-semibold text-[#061b31]">产品变动排序（本期）</h2>
        <p className="mt-1 text-xs text-[#64748d]">左侧选择竞品，右侧同步展示该竞品的维度构成与关键变化。</p>
        <DashboardProductFocusClient
          items={compHeat.map((item) => ({
            competitor: item.competitor,
            count: item.count,
            values: breakdown.find((x) => x.competitor === item.competitor)?.values || [],
            highlights: (latest.insights
              .filter((x) => x.competitor === item.competitor)
              .filter((x) => !/无法判断|缺图|待复核|无法跨期/.test(x.conclusion || ""))
              .slice(0, 4)
              .map((x) => `${dimLabel(x.dimension)} · ${x.page || "未标注页面"}：${x.conclusion}`)),
          }))}
        />
      </section>


      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-[#e5edf5] bg-white p-5">
          <h2 className="text-base font-semibold text-[#061b31]">近4周趋势（按产品）</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#334155]">
            {productTrends.map((row) => (
              <li key={row.competitor} className="border-b border-[#eef2f7] pb-2">
                {row.competitor}：{row.weeks.map((w) => w.total).join(" → ")}（{row.direction}{row.change !== 0 ? `${row.change > 0 ? " +" : " "}${row.change}` : ""}）
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-[#e5edf5] bg-white p-5">
          <h2 className="text-base font-semibold text-[#061b31]">本周行动清单</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#334155]">
            <li>优先复盘竞品“运营触达→借贷转化”链路，形成我方可复用位点。</li>
            <li>对标小赢/分期乐借钱入口前置策略，输出入口层级优化建议。</li>
            <li>客服链路做一次“首轮承接效率”对比（入口、推荐问题、会话连续性）。</li>
            <li>补齐缺失基线位点，下一轮校正结论可信度。</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
