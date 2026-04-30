import evidenceDataJson from "@/data/evidence_page_data.json";
import { TimelineSwitcher } from "@/components/timeline-switcher";

type EvidenceData = {
  bossConclusions: string[];
  diffSummary: string[];
  productCards: { name: string; iconUrl: string; bullets: string[] }[];
  logRows: { name: string; latestVersion: string; previousVersion: string; updatedAt: string; noteDiff: string[] }[];
  evidenceRows: { competitor: string; conclusion: string; prevList: string[]; latestList: string[] }[];
};

function loadEvidenceData(): EvidenceData {
  return (evidenceDataJson as EvidenceData) || { bossConclusions: [], diffSummary: [], productCards: [], logRows: [], evidenceRows: [] };
}

function fmtDate(s?: string) {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString("zh-CN", { hour12: false });
}

const TIMELINES = [
  { key: "0323-0402", label: "0323 → 0402" },
  { key: "0323-0428", label: "0323 → 0428" },
] as const;

export default function AppVersionUpdatesPage({
  searchParams,
}: {
  searchParams?: { timeline?: string };
}) {
  const data = loadEvidenceData();
  const selectedTimeline = TIMELINES.some((x) => x.key === searchParams?.timeline)
    ? (searchParams?.timeline as string)
    : "0323-0402";
  const selectedTimelineLabel = TIMELINES.find((x) => x.key === selectedTimeline)?.label || "0323 → 0402";
  const totalScreenshotCount = data.evidenceRows.reduce((n, r) => n + (r.latestList?.length || 0), 0);

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-[#061b31]">详细追踪分析｜本轮关键结论总览</h1>
          <TimelineSwitcher options={TIMELINES as unknown as { key: string; label: string }[]} value={selectedTimeline} />
        </div>
        <div className="mt-3 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：{selectedTimelineLabel}</p>
          <p>覆盖样本：5家产品 / APP</p>
          <p>数据说明：来源于app截图共（{totalScreenshotCount}张），部分一级页面。</p>
        </div>
        {selectedTimeline === "0323-0428" ? (
          <p className="mt-2 text-xs text-amber-700">提示：0323→0428 数据已预留切换位，当前待你导入该时间线结论后将自动替换展示。</p>
        ) : null}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">本轮关键结论</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">{data.bossConclusions.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">差异总结</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">{data.diffSummary.slice(0, 5).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">各产品主打信息</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {data.productCards.map((x) => (
            <div key={x.name} className="rounded-lg border p-3">
              <div className="flex items-center gap-2">{x.iconUrl ? <img src={x.iconUrl} alt="icon" className="h-8 w-8 rounded-lg border" /> : null}<p className="text-sm font-medium">{x.name}</p></div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">{x.bullets.map((b) => <li key={`${x.name}-${b}`}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">更新日志变化观察</h2>
        <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[1200px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="px-2 py-2">竞品</th><th className="px-2 py-2">最新版本</th><th className="px-2 py-2">上一版本</th><th className="px-2 py-2">更新时间</th><th className="px-2 py-2">新增日志要点</th></tr></thead><tbody>{data.logRows.map((r) => <tr key={r.name} className="border-b align-top"><td className="px-2 py-2 font-medium">{r.name}</td><td className="px-2 py-2">{r.latestVersion}</td><td className="px-2 py-2">{r.previousVersion}</td><td className="px-2 py-2 text-xs text-muted-foreground">{fmtDate(r.updatedAt)}</td><td className="px-2 py-2 text-xs">{r.noteDiff?.length ? r.noteDiff.join("；") : "—"}</td></tr>)}</tbody></table></div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">证据明细表</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="px-2 py-2">竞品</th><th className="px-2 py-2">结论</th><th className="px-2 py-2">上期截图</th><th className="px-2 py-2">本期截图</th></tr></thead>
            <tbody>
              {data.evidenceRows.map((r) => (
                <tr key={r.competitor} className="border-b align-top">
                  <td className="whitespace-nowrap px-2 py-2 font-medium">{r.competitor}</td><td className="w-[280px] max-w-[280px] px-2 py-2 text-sm leading-6">{r.conclusion}</td>
                  <td className="min-w-[500px] px-2 py-2"><div className="flex flex-wrap gap-2">{r.prevList?.length ? r.prevList.map((src) => <a key={`${r.competitor}-p-${src}`} href={src} target="_blank" rel="noreferrer"><img src={src} alt="上期截图" className="h-[220px] w-[150px] rounded-md border border-slate-300 object-cover" /></a>) : "—"}</div></td>
                  <td className="min-w-[500px] px-2 py-2"><div className="flex flex-wrap gap-2">{r.latestList?.length ? r.latestList.map((src) => <a key={`${r.competitor}-c-${src}`} href={src} target="_blank" rel="noreferrer"><img src={src} alt="本期截图" className="h-[220px] w-[150px] rounded-md border border-slate-300 object-cover" /></a>) : "—"}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
