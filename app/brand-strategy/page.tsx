import fs from "fs";
import path from "path";

type Row = {
  brand: string;
  site: string;
  positioning: string;
  heroCopy: string;
  featureShowcase: string;
  pricing: string;
  cta: string;
  trust: string;
  status: string;
  screenshot: string;
};

type PageData = {
  generatedAt: string;
  range: string;
  rows: Row[];
  bossConclusions: string[];
  diffSummary: string[];
};

function loadData(): PageData {
  const p = path.join(process.cwd(), "data", "brand_strategy_page_data.json");
  if (!fs.existsSync(p)) return { generatedAt: "", range: "本期", rows: [], bossConclusions: [], diffSummary: [] };
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return { generatedAt: "", range: "本期", rows: [], bossConclusions: [], diffSummary: [] }; }
}

export default function BrandStrategyPage() {
  const data = loadData();
  const rows = data.rows || [];

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#061b31]">本轮关键结论与差异总结</h2>
        <div className="mt-3 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：{data.range || "本期"}</p>
          <p>覆盖样本：{rows.length}家品牌官网/应用市场</p>
          <p>数据说明：基于截图与页面可提取文本自动生成。</p>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-md border border-[#e5edf5] bg-[#fafcff] p-4">
            <h3 className="text-base font-semibold text-[#061b31]">本轮关键结论</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#64748d]">{data.bossConclusions.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>

          <div className="rounded-md border border-[#e5edf5] bg-[#fafcff] p-4">
            <h3 className="text-base font-semibold text-[#061b31]">差异总结</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#64748d]">{data.diffSummary.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4 md:p-6 overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead><tr className="border-b text-left text-muted-foreground"><th className="px-3 py-3">品牌</th><th className="px-3 py-3">品牌定位</th><th className="px-3 py-3">首屏文案</th><th className="px-3 py-3">功能展示</th><th className="px-3 py-3">定价策略</th><th className="px-3 py-3">CTA 转化</th><th className="px-3 py-3">信任背书</th><th className="px-3 py-3">抓取状态</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.brand} className="border-b align-top last:border-0">
                <td className="px-3 py-3 font-medium"><div>{r.brand}</div><a href={r.site} target="_blank" className="text-xs text-primary underline-offset-2 hover:underline" rel="noreferrer">来源</a></td>
                <td className="px-3 py-3">{r.positioning}</td><td className="px-3 py-3">{r.heroCopy}</td><td className="px-3 py-3">{r.featureShowcase}</td><td className="px-3 py-3">{r.pricing}</td><td className="px-3 py-3">{r.cta}</td><td className="px-3 py-3">{r.trust}</td><td className="px-3 py-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">截图样本</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rows.map((r) => (
            <figure key={`${r.brand}-shot`} className="overflow-hidden rounded-lg border bg-background">
              {r.screenshot ? <img src={r.screenshot} alt={`${r.brand} 截图`} className="w-full object-contain bg-slate-50" /> : <div className="h-40 grid place-items-center text-xs text-muted-foreground">无截图</div>}
              <figcaption className="border-t px-3 py-2 text-xs text-muted-foreground">{r.brand}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
