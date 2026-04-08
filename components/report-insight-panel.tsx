"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Insight } from "@/lib/reports";
import { Button } from "@/components/ui/button";

function displayLabel(x: string) {
  return x === "留存促活运营" ? "运营" : x;
}

function group(title: string, arr: string[], value: string, onChange: (v: string) => void) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{title}</p>
      <div className="flex flex-nowrap gap-2">
        {arr.map((x) => (
          <Button key={x} size="sm" className="whitespace-nowrap" variant={x === value ? "default" : "outline"} onClick={() => onChange(x)}>{displayLabel(x)}</Button>
        ))}
      </div>
    </div>
  );
}

function hasStructuralChange(text: string) {
  return /入口|布局|层级|主操作|主链路|路径|结构|改版|切换|新增|强化|调整/.test(text);
}

function experienceText(compare: string, impact: "高" | "中" | "低") {
  if (!hasStructuralChange(compare) && impact === "低") return "用户主路径基本不变，感知为延续性更新。";
  if (!hasStructuralChange(compare) && impact === "中") return "用户主路径变化有限，感知为局部优化。";
  if (impact === "高") return "用户决策入口或操作路径发生明显变化。";
  return "用户感知有一定变化，但整体学习成本可控。";
}

function impactChipClass(impact: "高" | "中" | "低") {
  if (impact === "高") return "bg-red-100 text-red-700 border border-red-200";
  if (impact === "中") return "bg-amber-100 text-amber-700 border border-amber-200";
  return "bg-slate-100 text-slate-700 border border-slate-200";
}

type ViewerImage = { src: string; label: string };

export default function ReportInsightPanel({ insights }: { insights: Insight[] }) {
  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [period, setPeriod] = useState("全部");
  const [changeScope, setChangeScope] = useState<"全部" | "高" | "中" | "低">("全部");
  const preferredCompetitorOrder = ["分期乐", "度小满", "安逸花", "小赢", "奇富借条"];
  const stageTabs = preferredCompetitorOrder.filter((x) => insights.some((i) => i.competitor === x));
  const [stageCompetitor, setStageCompetitor] = useState(stageTabs[0] || "全部");

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<ViewerImage[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!stageTabs.length) return;
    if (!stageTabs.includes(stageCompetitor)) {
      setStageCompetitor(stageTabs[0]);
    }
  }, [stageTabs, stageCompetitor]);

  const competitors = ["全部", ...Array.from(new Set(insights.map((x) => x.competitor)))];
  const dimensionOrder = ["APP", "客服", "消金", "留存促活运营", "风控"];
  const dimensions = ["全部", ...dimensionOrder.filter((d) => Array.from(new Set(insights.map((x) => x.dimension))).includes(d) || d === "风控")];
  const periods = ["全部", ...Array.from(new Set(insights.map((x) => x.period)))];

  const filtered = useMemo(() => insights.filter((x) => {
    if (competitor !== "全部" && x.competitor !== competitor) return false;
    if (dimension !== "全部" && x.dimension !== dimension) return false;
    if (period !== "全部" && x.period !== period) return false;
    if (changeScope !== "全部" && x.impact !== changeScope) return false;
    return true;
  }), [insights, competitor, dimension, period, changeScope]);

  const stageInsights = useMemo(() => {
    const active = filtered.filter((x) => x.competitor === stageCompetitor);
    const order = ["APP", "客服", "消金", "留存促活运营", "风控"];
    return order
      .map((d) => ({ dimension: d, rows: active.filter((x) => x.dimension === d) }))
      .filter((x) => x.rows.length > 0);
  }, [filtered, stageCompetitor]);

  const openViewer = (images: ViewerImage[], idx: number) => {
    if (images.length === 0) return;
    setViewerImages(images);
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const nextImage = () => setViewerIndex((i) => (i + 1) % viewerImages.length);
  const prevImage = () => setViewerIndex((i) => (i - 1 + viewerImages.length) % viewerImages.length);

  return (
    <>
      <section className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="text-lg font-semibold">全局筛选</h2>
        <div className="grid gap-3 md:grid-cols-[2fr_2fr_1fr_1fr]">
          {group("竞品", competitors, competitor, setCompetitor)}
          {group("维度", dimensions, dimension, setDimension)}
          {group("周期", periods, period, setPeriod)}
          <div className="md:text-right md:justify-self-end">
            {group("变化等级", ["全部", "高", "中", "低"], changeScope, (v) => setChangeScope(v as "全部" | "高" | "中" | "低"))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">单产品结构变化页（按截图对比）</h2>
          <div className="flex flex-wrap gap-2">
            {stageTabs.map((x) => (
              <Button key={x} size="sm" variant={x === stageCompetitor ? "default" : "outline"} onClick={() => setStageCompetitor(x)}>{x}</Button>
            ))}
          </div>
        </div>

        {stageInsights.length === 0 ? (
          <p className="text-sm text-muted-foreground">当前筛选下暂无结构层明显变化页面。</p>
        ) : (
          <div className="space-y-5">
            {stageInsights.map(({ dimension: dim, rows }) => (
              <div key={dim} className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{displayLabel(dim)}</p>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {rows.slice(0, 6).map((x) => {
                    const prevImgs = (x.prevEvidence || []).filter((src) => src && src !== "无").map((src) => ({ src, label: "上期" }));
                    const currImgs = (x.currEvidence || []).filter((src) => src && src !== "无").map((src) => ({ src, label: "本期" }));
                    const allImgs = [...prevImgs, ...currImgs];
                    return (
                      <article key={x.id} className="rounded-lg border bg-card/60 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{x.page || "页面位点未标注"}</p>
                          <span className={`rounded px-2 py-0.5 text-xs shrink-0 ${impactChipClass(x.impact)}`}>{x.impact}</span>
                        </div>

                        <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center">
                              {prevImgs[0] ? (
                                <button type="button" onClick={() => openViewer(allImgs, 0)} className="rounded border p-1 hover:bg-slate-50">
                                  <img src={prevImgs[0].src} alt="上期截图" className="mx-auto h-28 w-16 rounded object-cover" />
                                </button>
                              ) : <div className="mx-auto h-28 w-16 rounded border border-dashed text-xs text-muted-foreground grid place-items-center">无</div>}
                              <p className="mt-1 text-[11px] text-muted-foreground">上期</p>
                            </div>
                            <div className="text-center">
                              {currImgs[0] ? (
                                <button type="button" onClick={() => openViewer(allImgs, prevImgs.length)} className="rounded border p-1 hover:bg-slate-50">
                                  <img src={currImgs[0].src} alt="本期截图" className="mx-auto h-28 w-16 rounded object-cover" />
                                </button>
                              ) : <div className="mx-auto h-28 w-16 rounded border border-dashed text-xs text-muted-foreground grid place-items-center">无</div>}
                              <p className="mt-1 text-[11px] text-muted-foreground">本期</p>
                            </div>
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground min-w-0">
                            <p className="line-clamp-3"><span className="font-medium text-foreground">1）截图变化：</span>{x.compare || "两期截图差异较小。"}</p>
                            <p className="line-clamp-3"><span className="font-medium text-foreground">2）事实：</span>{x.conclusion || "-"}</p>
                            <p className="line-clamp-3"><span className="font-medium text-foreground">3）体验：</span>{experienceText(x.compare || "", x.impact)}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="text-lg font-semibold">动态结论面板</h2>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[1200px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b border-slate-200 px-3 py-2">竞品</th>
                <th className="border-b border-slate-200 px-3 py-2">分析维度</th>
                <th className="border-b border-slate-200 px-3 py-2">页面位点</th>
                <th className="border-b border-slate-200 px-3 py-2">结论</th>
                <th className="border-b border-slate-200 px-3 py-2">上期截图</th>
                <th className="border-b border-slate-200 px-3 py-2">本期截图</th>
                <th className="border-b border-slate-200 px-3 py-2">对比过程（仅变化明显时展示）</th>
                <th className="border-b border-slate-200 px-3 py-2">影响等级</th>
                <th className="border-b border-slate-200 px-3 py-2">是否建议人工复核</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((x) => {
                const prevImgs = (x.prevEvidence || []).filter((src) => src && src !== "无").map((src) => ({ src, label: "上期" }));
                const currImgs = (x.currEvidence || []).filter((src) => src && src !== "无").map((src) => ({ src, label: "本期" }));
                const allImgs = [...prevImgs, ...currImgs];
                const needReview = `${x.confidence}`.includes("是");
                return (
                  <tr key={x.id}>
                    <td className="border-b border-slate-100 px-3 py-3 whitespace-nowrap min-w-[6em] w-[6em]">{x.competitor}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{displayLabel(x.dimension)}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{x.page || "-"}</td>
                    <td className="border-b border-slate-100 px-3 py-3 max-w-[280px]">{x.conclusion}</td>
                    <td className="border-b border-slate-100 px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        {prevImgs.length > 0 ? prevImgs.map((img) => {
                          const idx = allImgs.findIndex((i) => i.src === img.src);
                          return (
                            <button key={img.src} onClick={() => openViewer(allImgs, idx)} className="rounded border p-1 hover:bg-slate-50" type="button">
                              <img src={img.src} alt={img.src} className="h-24 w-16 rounded object-cover" />
                            </button>
                          );
                        }) : <span className="text-xs text-muted-foreground">无</span>}
                      </div>
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        {currImgs.length > 0 ? currImgs.map((img) => {
                          const idx = allImgs.findIndex((i) => i.src === img.src);
                          return (
                            <button key={img.src} onClick={() => openViewer(allImgs, idx)} className="rounded border p-1 hover:bg-slate-50" type="button">
                              <img src={img.src} alt={img.src} className="h-24 w-16 rounded object-cover" />
                            </button>
                          );
                        }) : <span className="text-xs text-muted-foreground">无</span>}
                      </div>
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3 max-w-[320px]">{x.compare || "-"}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{x.impact}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{needReview ? "是（建议人工复核）" : "否"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && <p className="text-sm text-muted-foreground">当前筛选条件下暂无匹配数据。</p>}
      </section>

      {mounted && viewerOpen && viewerImages.length > 0 && createPortal(
        <div className="fixed inset-0 z-[2147483647] bg-black/85" onClick={() => setViewerOpen(false)}>
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={prevImage} className="mr-3 rounded bg-white/90 px-3 py-2 text-sm">上一张</button>
            <div className="rounded bg-white p-3">
              <div className="mb-2 text-center text-xs text-slate-500">{viewerImages[viewerIndex]?.label}（{viewerIndex + 1}/{viewerImages.length}）</div>
              <img src={viewerImages[viewerIndex]?.src} alt="preview" className="max-h-[80vh] max-w-[70vw] rounded object-contain" />
            </div>
            <button type="button" onClick={nextImage} className="ml-3 rounded bg-white/90 px-3 py-2 text-sm">下一张</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
