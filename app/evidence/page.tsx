export default function AppVersionUpdatesPage() {
  const imgs = [
    "fenqile-app-home-0323.jpg",
    "fenqile-app-home-0402.jpg",
    "dxm-app-home-0323.jpg",
    "dxm-app-home-0402.jpg",
    "dxm-ops-campaign-0323.jpg",
    "dxm-ops-campaign-0402.jpg",
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">APP版本更新</h1>
      <p className="mt-2 text-sm text-slate-600">按时间线查看各产品版本页面变化与截图证据。</p>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        {imgs.map((src) => (
          <img key={src} src={`/evidence/${src}`} alt={src} className="rounded-lg border border-slate-200" />
        ))}
      </div>
    </div>
  );
}
