"use client";

import { useSearchParams } from "next/navigation";

export function TimelineSummary({
  data,
}: {
  data: Record<string, { period: string; sample: string; ratio?: string; summary: string; bullets: string[] }>;
}) {
  const sp = useSearchParams();
  const key = sp.get("timeline") || "0323-0402";
  const d = data[key] || data["0323-0402"];

  return (
    <>
      <p className="mt-3 text-sm text-[#334155]">{d.summary}</p>
      <div className="mt-4 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
        <p>时间范围：{d.period}</p>
        <p>覆盖样本：{d.sample}</p>
        <p>可判断占比：{d.ratio || "-"}</p>
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#64748d]">
        {d.bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </>
  );
}
