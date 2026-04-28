export default function WebGlobalSearchPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-[0_0_0_1px_rgba(148,163,184,0.08)]">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Global Search</p>
        <h1 className="mt-2 text-2xl font-semibold">网络全局搜索</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          聚合外部公开信息、竞品官网动态、应用市场变化与舆情信号，形成可追溯的全网检索视图。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "市场概览", desc: "按时间窗汇总竞品动态密度与热点方向。" },
          { title: "产品画像", desc: "按竞品聚合品牌定位、发布节奏、内容重心。" },
          { title: "核心对比", desc: "对比不同产品在功能、传播、策略侧的变化。" },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-base font-semibold text-slate-100">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-5 text-sm text-slate-400">
        页面已创建为暗色风格占位版。下一步可接入你的抓取与分析数据源，填充 L1-L4 结构化内容。
      </section>
    </div>
  );
}
