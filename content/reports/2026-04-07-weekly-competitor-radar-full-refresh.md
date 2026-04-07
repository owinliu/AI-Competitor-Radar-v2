---
title: "竞品追踪雷达（分期乐 vs 度小满）全量复盘"
date: "2026-04-07"
summary: "已全量读取56张截图并重建台账：覆盖APP/客服/消金/运营，明确风控与客服缺口优先级。"
tags:
  - 竞品追踪
  - 周报
  - 分期乐
  - 度小满
competitors:
  - 分期乐
  - 度小满
dimensions:
  - APP
  - 风控
  - 客服
  - 消金
  - 留存促活运营
period: "2026-W15"
highlights:
  - 分期乐在APP与消金维持稳态，小幅优化集中在运营位与客服会话展示。
  - 度小满在运营侧持续加码，APP首屏活动化表达强于分期乐。
  - 两家风控位点仍缺图，客服在度小满侧存在0402缺口，需作为下轮补拍重点。
actions:
  - 固化“筛选后子表”阅读路径，周会默认以竞品×维度切片汇报。
  - 风控与客服缺口纳入必拍清单，优先补齐度小满0402客服与两家风控位点。
  - 运营活动位新增“周期变化+触达形式”追踪字段，支持连续周趋势判断。
insights:
  - id: fql-app-home
    competitor: 分期乐
    dimension: APP
    period: 2026-W15
    page: 首页
    conclusion: 首页结构稳定，中腰部货架内容迭代。
    compare: 0323与0402均保留核心入口与底部导航，主要变化在运营货架素材。
    impact: 中
    confidence: 高/否
    actions:
      - 保持主结构稳定，继续小步测试中腰部活动位。
    prevEvidence:
      - /evidence/fenqile-app-home-0323.jpg
    currEvidence:
      - /evidence/fenqile-app-home-0402.jpg
    evidence:
      - /evidence/fenqile-app-home-0323.jpg
      - /evidence/fenqile-app-home-0402.jpg
  - id: fql-cs-im
    competitor: 分期乐
    dimension: 客服
    period: 2026-W15
    page: IM半浮层
    conclusion: 会话状态可见性疑似增强，需同状态复核。
    compare: 两期截图状态不同（输入态/浏览态），当前先按疑似变化标记。
    impact: 中
    confidence: 中/是
    actions:
      - 下轮补同状态截图后确认是否属于真实改版。
    prevEvidence:
      - /evidence/fenqile-cs-im-0323.jpg
    currEvidence:
      - /evidence/fenqile-cs-im-0402.jpg
    evidence:
      - /evidence/fenqile-cs-im-0323.jpg
      - /evidence/fenqile-cs-im-0402.jpg
  - id: fql-credit
    competitor: 分期乐
    dimension: 消金
    period: 2026-W15
    page: 额度中心
    conclusion: 额度与提额入口保持稳定。
    compare: 核心额度信息与主要操作路径未出现结构变化。
    impact: 中
    confidence: 高/否
    actions:
      - 继续以权益位优化为主，避免频繁改动主交易结构。
    prevEvidence:
      - /evidence/fenqile-credit-0323.jpg
    currEvidence:
      - /evidence/fenqile-credit-0402.jpg
    evidence:
      - /evidence/fenqile-credit-0323.jpg
      - /evidence/fenqile-credit-0402.jpg
  - id: fql-ops
    competitor: 分期乐
    dimension: 留存促活运营
    period: 2026-W15
    page: 活动落地页
    conclusion: 活动位延续更新，但0402证据数量低于0323。
    compare: 0323有活动落地页+弹窗双图，0402当前仅活动页单图，强度判断保守。
    impact: 中
    confidence: 中/是
    actions:
      - 运营位补图以确认弹窗触达是否弱化或仅采集缺失。
    prevEvidence:
      - /evidence/fenqile-ops-0323.jpg
    currEvidence:
      - /evidence/fenqile-ops-0402.jpg
    evidence:
      - /evidence/fenqile-ops-0323.jpg
      - /evidence/fenqile-ops-0402.jpg
  - id: dxm-app-home
    competitor: 度小满
    dimension: APP
    period: 2026-W15
    page: 首页
    conclusion: 首屏活动化表达增强，主交易入口保留。
    compare: 0402首页活动感更强，仍保留借钱等核心入口。
    impact: 高
    confidence: 高/否
    actions:
      - 结合转化指标评估活动化增强的净收益。
    prevEvidence:
      - /evidence/dxm-app-home-0323.jpg
    currEvidence:
      - /evidence/dxm-app-home-0402.jpg
    evidence:
      - /evidence/dxm-app-home-0323.jpg
      - /evidence/dxm-app-home-0402.jpg
  - id: dxm-credit
    competitor: 度小满
    dimension: 消金
    period: 2026-W15
    page: 额度页
    conclusion: 已匹配位点稳定，借钱命名差异不影响核心判断。
    compare: 额度页核心信息一致；借钱/借钱页命名差异需在映射表统一。
    impact: 中
    confidence: 中/是
    actions:
      - 统一命名映射后再做更细的逐字段差异比较。
    prevEvidence:
      - /evidence/dxm-credit-0323.jpg
    currEvidence:
      - /evidence/dxm-credit-0402.jpg
    evidence:
      - /evidence/dxm-credit-0323.jpg
      - /evidence/dxm-credit-0402.jpg
  - id: dxm-ops
    competitor: 度小满
    dimension: 留存促活运营
    period: 2026-W15
    page: 活动落地页
    conclusion: 活动周期拉长且触达形式增多，运营加码明显。
    compare: 0402新增代言人弹窗/浮层等素材，活动持续性与触达频次均提升。
    impact: 高
    confidence: 高/否
    actions:
      - 跟踪高频触达带来的关闭率和留存变化，避免过度打断。
    prevEvidence:
      - /evidence/dxm-ops-campaign-0323.jpg
    currEvidence:
      - /evidence/dxm-ops-campaign-0402.jpg
    evidence:
      - /evidence/dxm-ops-campaign-0323.jpg
      - /evidence/dxm-ops-campaign-0402.jpg
  - id: dxm-cs-gap
    competitor: 度小满
    dimension: 客服
    period: 2026-W15
    page: 消息中心/对话页
    conclusion: 0402客服同位点缺失，暂不输出跨期变化结论。
    compare: 仅有0323客服证据，无法完成同周期对照。
    impact: 高
    confidence: 高/是
    actions:
      - 下轮优先补齐0402客服同位点截图。
    prevEvidence:
      - /evidence/dxm-cs-0323.jpg
    currEvidence: []
    evidence:
      - /evidence/dxm-cs-0323.jpg
---

## 全量读取范围与底稿

- 全量读取图片：56 张（分期乐 29，度小满金融 27）
- 逐图台账：`/Users/owinliu/Desktop/竞品分析/outputs/image-ledger-20260407-1642.md`
- 对比映射：`/Users/owinliu/Desktop/竞品分析/outputs/comparison-map-20260407-1642.md`
- 缺口优先级：`/Users/owinliu/Desktop/竞品分析/outputs/gap-priority-20260407-1642.md`
- 高优先缺口：两家风控（0323/0402均缺）、度小满客服0402缺失

## 结构化主表（按固定表头）

| 竞品 | 分析维度 | 页面位点 | 结论 | 0323截图（上期） | 0402截图（本期） | 对比过程（详细） | 影响等级 | 置信度/复核 |
|---|---|---|---|---|---|---|---|---|
| 分期乐 | APP | 首页 | 首页结构稳定，中腰部货架内容迭代 | ![](/evidence/fenqile-app-home-0323.jpg) | ![](/evidence/fenqile-app-home-0402.jpg) | 核心入口与底部导航一致，变化主要在运营货架素材。 | 中 | 高/否 |
| 分期乐 | 客服 | IM半浮层 | 会话状态可见性疑似增强 | ![](/evidence/fenqile-cs-im-0323.jpg) | ![](/evidence/fenqile-cs-im-0402.jpg) | 两期截图状态不同，先按疑似变化标记。 | 中 | 中/是 |
| 分期乐 | 消金 | 额度中心 | 额度与提额入口保持稳定 | ![](/evidence/fenqile-credit-0323.jpg) | ![](/evidence/fenqile-credit-0402.jpg) | 核心额度信息与主要操作路径未出现结构变化。 | 中 | 高/否 |
| 分期乐 | 留存促活运营 | 活动落地页 | 活动位延续更新，0402证据偏少 | ![](/evidence/fenqile-ops-0323.jpg) | ![](/evidence/fenqile-ops-0402.jpg) | 0323双图，0402单图，强度判断保守。 | 中 | 中/是 |
| 度小满 | APP | 首页 | 首屏活动化表达增强 | ![](/evidence/dxm-app-home-0323.jpg) | ![](/evidence/dxm-app-home-0402.jpg) | 0402活动表达更强，主交易入口仍保留。 | 高 | 高/否 |
| 度小满 | 消金 | 额度页 | 已匹配位点稳定 | ![](/evidence/dxm-credit-0323.jpg) | ![](/evidence/dxm-credit-0402.jpg) | 额度页核心信息一致；借钱位命名待统一。 | 中 | 中/是 |
| 度小满 | 留存促活运营 | 活动落地页 | 运营加码明显 | ![](/evidence/dxm-ops-campaign-0323.jpg) | ![](/evidence/dxm-ops-campaign-0402.jpg) | 0402新增弹窗/浮层素材，触达形式更丰富。 | 高 | 高/否 |
| 度小满 | 客服 | 消息中心/对话页 | 0402缺失，暂不输出跨期结论 | ![](/evidence/dxm-cs-0323.jpg) | 无 | 缺少同周期对照证据，列为缺口项。 | 高 | 高/是 |
| 两家 | 风控 | 风控关键页 | 两家两期均无截图，不纳入变化结论 | 无 | 无 | 仅保留缺口标注，下轮必须补拍。 | 高 | 高/是 |
