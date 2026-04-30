import { Suspense } from "react";
import { getAllReports, getReportBySlug, type Insight } from "@/lib/reports";
import { TimelineSwitcher } from "@/components/timeline-switcher";
import { TimelineSummary } from "@/components/timeline-summary-client";
import DashboardTimelineCardsClient from "@/components/dashboard-timeline-cards-client";
import Dashboard0428EvidenceClient from "@/components/dashboard-0428-evidence-client";
import recompare0428Data from "@/data/recompare_0323_0428_dashboard.json";

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

  const recompareRows = (recompare0428Data as any).rows || [];
  const recompareCards = [
    {
      title: "关键结论1（高）",
      desc: "APP 高影响变化集中在分期乐与安逸花，前台转化导向更前置。",
      bullets: ["分期乐首页/借钱/消息页出现明显导向切换。", "安逸花首页由借款首屏转向内容+借款并列结构。"],
      action: "优先复盘首页与借钱页的卡位迁移对转化的影响",
    },
    {
      title: "关键结论2（高）",
      desc: "运营新增位是 0428 窗口最密集的变化源。",
      bullets: ["安逸花新增马上绿洲/马上小镇/智慧养鸡/英才学堂。", "度小满新增代言人活动弹窗、落地页与奖励浮层。"],
      action: "优先拆新增活动位与主链路之间的承接关系",
    },
    {
      title: "关键结论3（中）",
      desc: "其余大部分位点属于稳态微调，需避免把命名差异误判为产品改版。",
      bullets: ["98行中高影响17行、建议复核18行。", "单边新增/缺失位点已单独打上复核标记。"],
      action: "后续继续补齐同位点命名与缺图复核",
    },
  ];
  const recompareCompetitors = Array.from(new Set(recompareRows.map((x: any) => x.competitor))) as string[];
  const recompareItems = recompareCompetitors.map((competitor) => {
    const rows = recompareRows.filter((x: any) => x.competitor === competitor);
    return {
      competitor,
      count: rows.length,
      values: DIMENSIONS.map((dimension) => ({ dimension, count: rows.filter((x: any) => x.dimension === dimension).length })),
      highlights: rows.filter((x: any) => x.impact === "高").slice(0, 4).map((x: any) => `${dimLabel(x.dimension)} · ${x.page}：${x.conclusion}`),
    };
  });

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
                sample: "180张全量截图 / 98行对比位点（含单边新增或缺失）",
                ratio: "高影响17行 / 建议复核18行",
                summary: "0428 对比 0323：本轮以全量截图重排出的 98 行明细证据表为准，只从证据反推五维结论。",
                bullets: ["高影响集中在分期乐 APP 转化前置、安逸花与度小满新增运营承接位、奇富借条新增富能计划页。", "大部分 APP/消金/客服位点仍属稳态微调，主链路未改。", "单边新增或缺失位点统一标记人工复核，避免把命名变化误判成产品改版。"],
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
                cards: recompareCards,
                items: recompareItems,
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

      <Suspense fallback={null}>
        <Dashboard0428EvidenceClient data={recompare0428Data as any} />
      </Suspense>
    </div>
  );
}
