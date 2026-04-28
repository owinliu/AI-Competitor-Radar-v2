import { getAllReports, getReportBySlug } from "@/lib/reports";
import ReportsCenterClient from "@/components/reports-center-client";

export default function ReportsPage() {
  const metas = getAllReports();
  const reports = metas.map((m) => {
    const d = getReportBySlug(m.slug);
    return {
      slug: m.slug,
      title: m.title,
      date: m.date,
      period: m.period,
      competitors: m.competitors,
      dimensions: m.dimensions,
      insights: d?.insights || [],
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#061b31]">详细追踪分析｜本轮关键结论总览</h1>
        <div className="mt-3 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：2026-W15（0408重读）</p>
          <p>覆盖样本：5家产品 / APP</p>
          <p>数据说明：来源于app截图共（xx张），部分一级页面。</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">本轮关键结论</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
              <li>行业竞争重点继续前移至入口效率与触达效率。</li>
              <li>本期APP端首屏与借贷入口表达变化更明显。</li>
              <li>运营活动仍是短期转化拉动的高频抓手。</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">差异总结</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
              <li>分期乐：APP维度变化最明显，转化前置信号增强。</li>
              <li>度小满：品牌信息流切换营销主题，活动露出增强。</li>
              <li>安逸花：首页架构转向内容+借款并列。</li>
              <li>奇富借条：运营活动触达延续高频。</li>
              <li>小赢：活动驱动与转化导向并行。</li>
            </ul>
          </div>
        </div>
      </section>

      <ReportsCenterClient reports={reports} />
    </div>
  );
}
