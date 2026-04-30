"use client";

import { useTimeline } from "@/components/timeline-key-bridge-client";

type Row = {
  competitor: string;
  dimension: string;
  page: string;
  conclusion: string;
  prevEvidence: string | null;
  currEvidence: string | null;
  compare: string;
  impact: "高" | "中" | "低";
  impactReason: string;
  review: "是" | "否";
};

type Payload = {
  meta: {
    timeline: string;
    title: string;
    sample: string;
    highCount: number;
    reviewCount: number;
    rowCount: number;
  };
  rows: Row[];
  dimensionSummary: Record<string, string[]>;
};

const DIM_ORDER = ["APP", "客服", "消金", "留存促活运营", "风控"] as const;

function ImgCell({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return <div className="text-xs text-[#94a3b8]">无</div>;
  return (
    <a href={src} target="_blank" rel="noreferrer" className="block">
      <img src={src} alt={alt} className="h-[220px] w-[150px] rounded-md border border-[#dbe7f3] object-cover" />
    </a>
  );
}

export default function Dashboard0428EvidenceClient({ data }: { data: Payload }) {
  const key = useTimeline();
  if (key !== "0323-0428") return null;

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#061b31]">{data.meta.title}</h2>
            <p className="mt-2 text-sm text-[#475569]">{data.meta.sample}</p>
          </div>
          <div className="grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
            <p>总位点：{data.meta.rowCount} 行</p>
            <p>高影响：{data.meta.highCount} 行</p>
            <p>建议复核：{data.meta.reviewCount} 行</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {DIM_ORDER.map((dim) => {
          const bullets = data.dimensionSummary[dim];
          if (!bullets?.length) return null;
          return (
            <div key={dim} className="rounded-md border border-[#e5edf5] bg-white p-5">
              <h3 className="text-base font-semibold text-[#061b31]">{dim}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#334155]">
                {bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#061b31]">明细证据表（98行）</h2>
        <p className="mt-2 text-sm text-[#64748d]">
          固定字段：竞品｜分析维度｜页面位点｜结论｜上期截图｜本期截图｜对比过程｜影响等级｜是否建议人工复核
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[2100px] text-sm align-top">
            <thead>
              <tr className="border-b border-[#e5edf5] text-left text-[#64748d]">
                <th className="px-2 py-3 font-medium">竞品</th>
                <th className="px-2 py-3 font-medium">分析维度</th>
                <th className="px-2 py-3 font-medium">页面位点</th>
                <th className="px-2 py-3 font-medium">结论</th>
                <th className="px-2 py-3 font-medium">上期截图</th>
                <th className="px-2 py-3 font-medium">本期截图</th>
                <th className="px-2 py-3 font-medium">对比过程</th>
                <th className="px-2 py-3 font-medium">影响等级</th>
                <th className="px-2 py-3 font-medium">是否建议人工复核</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={`${row.competitor}-${row.dimension}-${row.page}`} className="border-b border-[#eef2f7] align-top">
                  <td className="whitespace-nowrap px-2 py-3 font-medium text-[#0f172a]">{row.competitor}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-[#334155]">{row.dimension}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-[#334155]">{row.page}</td>
                  <td className="min-w-[330px] px-2 py-3 leading-6 text-[#0f172a]">{row.conclusion}</td>
                  <td className="min-w-[170px] px-2 py-3"><ImgCell src={row.prevEvidence} alt={`${row.competitor}-${row.page}-0323`} /></td>
                  <td className="min-w-[170px] px-2 py-3"><ImgCell src={row.currEvidence} alt={`${row.competitor}-${row.page}-0428`} /></td>
                  <td className="min-w-[360px] px-2 py-3 leading-6 text-[#334155]">{row.compare}</td>
                  <td className="min-w-[140px] px-2 py-3">
                    <div className="font-medium text-[#0f172a]">{row.impact}</div>
                    <div className="mt-1 text-xs leading-5 text-[#64748d]">{row.impactReason}</div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3 text-[#334155]">{row.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
