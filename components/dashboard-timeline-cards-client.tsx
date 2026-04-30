"use client";
import DashboardProductFocusClient from "@/components/dashboard-product-focus-client";
import { useTimeline } from "@/components/timeline-key-bridge-client";

export default function DashboardTimelineCardsClient({ data }: { data: any }) {
  const key = useTimeline();
  const d = data[key] || data["0323-0402"];
  return (
    <>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {d.cards.map((c: any) => (
          <div key={c.title} className="rounded-md border border-[#e5edf5] bg-[#fafcff] p-4">
            <h3 className="text-base font-semibold text-[#061b31]">{c.title}</h3>
            <p className="mt-2 text-sm text-[#334155]">{c.desc}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#64748d]">{c.bullets.map((b:string)=><li key={b}>{b}</li>)}</ul>
            <p className="mt-2 text-sm text-[#334155]">建议动作：{c.action}</p>
          </div>
        ))}
      </div>
      <section className="rounded-md border border-[#e5edf5] bg-white p-5 mt-6">
        <h2 className="text-base font-semibold text-[#061b31]">产品变动排序（本期）</h2>
        <p className="mt-1 text-xs text-[#64748d]">左侧选择竞品，右侧同步展示该竞品的维度构成与关键变化。</p>
        <DashboardProductFocusClient items={d.items} />
      </section>
    </>
  );
}
