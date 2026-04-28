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
        <p className="mt-3 text-sm text-[#334155]">
          本轮五家竞品整体呈现“APP主导策略调整 + 运营放大触达转化”的双主线。
          其中，分期乐、安逸花、度小满在APP侧的首屏与借贷入口表达变化更明显；奇富借条在运营侧延续高频活动触达；小赢保持“活动驱动 + 转化导向”并行节奏。
          从业务含义看，行业竞争重点继续前移到“入口效率（能否更快进入申请）与触达效率（能否更强拉动转化）”两项核心能力。
        </p>
        <div className="mt-4 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：2026-W15（0408重读）</p>
          <p>覆盖样本：5家产品 / APP</p>
          <p>数据说明：当前结论基于已纳入可比证据，缺口位点继续标注待补图</p>
        </div>
      </section>

      <ReportsCenterClient reports={reports} />
    </div>
  );
}
