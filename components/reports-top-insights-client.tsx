"use client";

import { useTimeline } from "@/components/timeline-key-bridge-client";

type Props = {
  baseTopDim: string;
  baseDiffSummary: string[];
  report0428HighCount: number;
  report0428ReviewCount: number;
};

export default function ReportsTopInsightsClient({
  baseTopDim,
  baseDiffSummary,
  report0428HighCount,
  report0428ReviewCount,
}: Props) {
  const key = useTimeline();

  if (key === "0323-0428") {
    return (
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="text-base font-semibold text-[#061b31]">本轮关键结论</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
            <li>本页仅在 0323→0428 下切换为全量截图反推的证据口径。</li>
            <li>高影响变化共 {report0428HighCount} 行，主要集中在 APP 导向切换、留存促活新增位、以及消金新增承接页。</li>
            <li>建议人工复核 {report0428ReviewCount} 行，主要是单边新增或缺少基线位点。</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-base font-semibold text-[#061b31]">差异总结</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
            <li>分期乐：首页、借钱、消息页都出现更强的转化前置导向。</li>
            <li>安逸花：0428 新增多张活动承接页，运营触达扩容最明显。</li>
            <li>奇富借条/度小满：分别新增富能计划页、代言人活动弹窗与落地页，新增位均已标复核口径。</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-4">
        <h3 className="text-base font-semibold text-[#061b31]">本轮关键结论</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
          <li>从明细截图对比看，本轮变化主要集中在{baseTopDim === "留存促活运营" ? "运营" : baseTopDim}维度。</li>
          <li>各产品变化以首屏文案与活动位替换为主，结构性改版相对有限。</li>
          <li>业务上呈现“转化信息前置 + 活动触达增强”的共同趋势。</li>
        </ul>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-base font-semibold text-[#061b31]">差异总结</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
          {baseDiffSummary.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
