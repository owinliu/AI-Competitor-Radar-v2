import { Suspense } from "react";
import { getAllReports, getReportBySlug, type Insight } from "@/lib/reports";
import { TimelineSwitcher } from "@/components/timeline-switcher";
import { TimelineSummary } from "@/components/timeline-summary-client";
import DashboardTimelineCardsClient from "@/components/dashboard-timeline-cards-client";

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

const TIMELINES = [
  { key: "0323-0402", label: "0323 → 0402" },
  { key: "0323-0428", label: "0323 → 0428" },
] as const;

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

  const selectedTimeline = "0323-0402";
  const selectedTimelineLabel = TIMELINES.find((x) => x.key === selectedTimeline)?.label || "0323 → 0402";

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
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-[#061b31]">本期结论总览</h1>
          <Suspense fallback={null}>
            <TimelineSwitcher options={TIMELINES as unknown as { key: string; label: string }[]} defaultValue={selectedTimeline} />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <TimelineSummary
            data={{
              "0323-0402": {
                period: `${selectedTimelineLabel}（报告日期：${latestMeta?.date || "-"}）`,
                sample: `${competitorCount}家竞品 / ${latestInsights.length}条变化`,
                ratio: `${validRatio}%`,
                summary: "本期竞品整体呈现“转化前置 + 触达增强”趋势，建议优先关注高影响变化项与可执行动作。",
                bullets: ["小赢运营维度占比高，活动触达频率密集。", "分期乐与安逸花借贷入口表达持续前置。"],
              },
              "0323-0428": {
                period: "0323 → 0428",
                sample: "5家竞品 / 关键位点对比（APP/客服/消金/运营）",
                ratio: "风控证据不足（仅小赢有样本）",
                summary: "0428对比0323显示：结构性大改不多，但运营触达和消金表达增强更明显。",
                bullets: ["运营位点新增最明显：度小满1→4、安逸花3→5、小赢5→6。", "APP多为稳态迭代，变化集中在文案、活动层和入口呈现。", "消金维度以奇富借条增强最明显（4→6），其余多为同位点更新。"],
              },
            }}
          />
        </Suspense>

        <Suspense fallback={null}>
          <DashboardTimelineCardsClient
            data={{
              "0323-0402": {
                cards: [
                  { title: "关键结论1（高）", desc: "运营触达是本期最密集变化位点。", bullets: ["小赢运营维度占比最高。", "度小满活动主题切换，触达表达增强。"], action: "复盘活动位到借钱页转化链路" },
                  { title: "关键结论2（高）", desc: "APP层持续借贷入口前置。", bullets: ["分期乐借钱页权益卡更新。", "安逸花首页借款表达前置。"], action: "评估首页借款入口层级" },
                  { title: "关键结论3（中）", desc: "客服侧以承接效率优化为主。", bullets: ["分期乐IM会话承接增强。", "度小满对话页结构稳定微调。"], action: "对标首轮解决率与承接路径" },
                ],
                items: compHeat.map((item) => ({ competitor: item.competitor, count: item.count, values: breakdown.find((x) => x.competitor === item.competitor)?.values || [], highlights: latest.insights.filter((x) => x.competitor === item.competitor).slice(0, 4).map((x) => `${dimLabel(x.dimension)} · ${x.page || "未标注页面"}：${x.conclusion}`) })),
              },
              "0323-0428": {
                cards: [
                  { title: "关键结论1（高）", desc: "运营位点新增是0428窗口最显著变化。", bullets: ["度小满运营位点由1增至4。", "安逸花运营位点由3增至5。"], action: "优先复盘新增活动位的转化承接" },
                  { title: "关键结论2（高）", desc: "APP主链路整体稳态，表达层迭代增强。", bullets: ["多数产品APP截图数量持平。", "变化集中在文案、活动层、入口呈现。"], action: "建立稳态页的表达更新监控" },
                  { title: "关键结论3（中）", desc: "消金与客服呈局部优化，风控证据不足。", bullets: ["奇富借条消金位点4增至6。", "风控仅小赢有样本，跨品结论受限。"], action: "补齐风控位点截图后再做强结论" },
                ],
                items: [
                  { competitor: "度小满金融", count: 16, values: [{ dimension: "APP", count: 6 }, { dimension: "风控", count: 0 }, { dimension: "客服", count: 4 }, { dimension: "消金", count: 2 }, { dimension: "留存促活运营", count: 4 }], highlights: ["运营 · 活动落地页：由1张增至4张，活动触达增强", "APP · 借钱页：结构延续，文案表达更新"] },
                  { competitor: "安逸花", count: 19, values: [{ dimension: "APP", count: 3 }, { dimension: "风控", count: 0 }, { dimension: "客服", count: 5 }, { dimension: "消金", count: 6 }, { dimension: "留存促活运营", count: 5 }], highlights: ["运营 · 活动位：由3张增至5张，新增主题页", "客服 · 对话页：承接路径延续优化"] },
                ],
              },
            }}
          />
        </Suspense>
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
