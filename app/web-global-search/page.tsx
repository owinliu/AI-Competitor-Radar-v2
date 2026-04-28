export default function WebGlobalSearchPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#e5edf5] bg-white px-5 py-4 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.10),0_30px_45px_-30px_rgba(50,50,93,0.25)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[#533afd]">Global Analysis</p>
        <h1 className="mt-1 text-xl font-semibold text-[#061b31]">全局分析</h1>
        <p className="mt-2 text-sm text-[#64748d]">基于外部网页设计语言提取与竞品信息聚合的全局视图。</p>
        <p className="mt-1 text-xs text-[#94a3b8]">数据说明：来源于网络公开数据抓取，更新可能存在时延，请以最新官方信息为准。</p>
      </section>

      <div className="h-[calc(100vh-13rem)] w-full overflow-hidden rounded-xl border border-[#e5edf5] bg-white shadow-[0_18px_36px_-18px_rgba(0,0,0,0.10),0_30px_45px_-30px_rgba(50,50,93,0.25)]">
        <iframe
          title="消费信贷平台竞品分析报告"
          src={`${basePath}/web-global-search/competitive-analysis.html`}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
