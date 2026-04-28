export default function WebGlobalSearchPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Global Analysis</p>
        <h1 className="mt-1 text-xl font-semibold text-white">全局分析</h1>
        <p className="mt-2 text-sm text-neutral-400">基于外部网页设计语言提取与竞品信息聚合的全局视图。</p>
      </section>

      <div className="h-[calc(100vh-13rem)] w-full overflow-hidden rounded-xl border border-neutral-800 bg-black shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
        <iframe
          title="消费信贷平台竞品分析报告"
          src={`${basePath}/web-global-search/competitive-analysis.html`}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
