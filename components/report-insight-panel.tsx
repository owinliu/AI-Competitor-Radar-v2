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

type ViewerImage = { src: string; label: string };

export default function ReportInsightPanel({ insights }: { insights: Insight[] }) {
  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [period, setPeriod] = useState("全部");
  const [changeScope, setChangeScope] = useState<"显著变化" | "全部">("显著变化");
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
    if (changeScope === "显著变化") {
      const text = `${x.conclusion}${x.compare || ""}`;
      const isSmall = /变化不大|基本一致|整体稳定|省略详细过程|主链路稳定/.test(text);
      const isStrongSignal = /显著|明显|新增|强化|增强|加码/.test(text);
      if (isSmall) return false;
      if (!(x.impact === "高" || isStrongSignal)) return false;
    }
    return true;
  }), [insights, competitor, dimension, period, changeScope]);

  const stageInsights = useMemo(() => {
    const active = filtered.filter((x) => x.competitor === stageCompetitor);
    const order = ["APP", "客服", "消金", "留存促活运营", "风控"];
    return order
      .map((d) => ({ dimension: d, rows: active.filter((x) => x.dimension === d) }))
      .filter((x) => x.rows.length > 0);
  }, [filtered, stageCompetitor]);

  const dimensionSummaries = useMemo(() => {
    const byDim = new Map<string, typeof filtered>();
    for (const d of dimensionOrder) byDim.set(d, [] as any);
    for (const item of filtered) {
      const arr = byDim.get(item.dimension) || [];
      arr.push(item as any);
      byDim.set(item.dimension, arr as any);
    }

    const pickIssue = (arr: typeof filtered) => {
      if (!arr.length) return "暂无数据";
      return arr[0].conclusion.replace(/。$/, "");
    };

    const targetDims = dimension === "全部" ? dimensionOrder : [dimension];

    return targetDims.map((d) => {
      const arr = (byDim.get(d) || []) as typeof filtered;
      if (!arr.length) {
        return { dim: d, text: `${displayLabel(d)}：暂无数据，当前无法判断该维度变化。` };
      }

      if (competitor === "全部") {
        const fql = arr.filter((x) => x.competitor === "分期乐");
        const dxm = arr.filter((x) => x.competitor === "度小满");
        const fqlTxt = pickIssue(fql);
        const dxmTxt = pickIssue(dxm);
        return {
          dim: d,
          text: `${displayLabel(d)}：分期乐（${fqlTxt}）；度小满（${dxmTxt}）。`,
        };
      }

      const keyIssues = arr
        .slice(0, 2)
        .map((x) => x.conclusion.replace(/。$/, ""))
        .join("；");
      const hasReview = arr.some((x) => `${x.confidence}`.includes("是"));
      const reviewText = hasReview ? "；其中部分结论建议人工复核。" : "。";
      return {
        dim: d,
        text: `${displayLabel(d)}：${keyIssues}${reviewText}`,
      };
    });
  }, [filtered, competitor, dimension]);

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
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">单产品阶段更新（含对比图）</h2>
          <div className="flex flex-wrap gap-2">
            {stageTabs.map((x) => (
              <Button key={x} size="sm" variant={x === stageCompetitor ? "default" : "outline"} onClick={() => setStageCompetitor(x)}>{x}</Button>
            ))}
          </div>
        </div>

        {stageInsights.length === 0 ? (
          <p className="text-sm text-muted-foreground">当前筛选下暂无该竞品的阶段更新。</p>
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
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 shrink-0">{x.impact}</span>
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
                            <p className="line-clamp-3"><span className="font-medium text-foreground">事实：</span>{x.conclusion || "-"}</p>
                            <p className="line-clamp-3"><span className="font-medium text-foreground">体验：</span>{x.compare || "变化不大，省略详细过程"}</p>
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
        <h2 className="text-lg font-semibold">动态结论面板（按筛选联动）</h2>
        <div className="grid gap-3 md:grid-cols-[2fr_2fr_1fr_1fr]">
          {group("竞品", competitors, competitor, setCompetitor)}
          {group("维度", dimensions, dimension, setDimension)}
          {group("周期", periods, period, setPeriod)}
          <div className="md:text-right md:justify-self-end">
            {group("变化范围", ["显著变化", "全部"], changeScope, (v) => setChangeScope(v as "显著变化" | "全部"))}
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-2">
          <p className="mb-1 text-sm font-medium">按维度总结（APP / 客服 / 消金 / 运营 / 风控）</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {dimensionSummaries.map((s) => (
              <li key={s.dim}>{s.text}</li>
            ))}
          </ul>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[1200px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b border-slate-200 px-3 py-2">竞品</th>
                <th className="border-b border-slate-200 px-3 py-2">分析维度</th>
                <th className="border-b border-slate-200 px-3 py-2">页面位点</th>
                <th className="border-b border-slate-200 px-3 py-2">结论</th>
                <th className="border-b border-slate-200 px-3 py-2">0323截图（上期）</th>
                <th className="border-b border-slate-200 px-3 py-2">0402截图（本期）</th>
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
                const smallChange = /稳定|变化不大|未见明显变化|基本一致/.test(`${x.conclusion}${x.compare || ""}`);
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
                    <td className="border-b border-slate-100 px-3 py-3 max-w-[320px]">{smallChange ? "（变化不大，省略详细过程）" : (x.compare || "-")}</td>
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
