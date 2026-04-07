---
title: "竞品追踪雷达（分期乐 vs 度小满）全量复盘"
date: "2026-04-07"
summary: "修复同义位点归并（含活动页/活动落地页），避免误判互相缺失。"
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
  - 已修复同义位点归并，当前可比位点 21 个。
  - 活动页/活动落地页已统一，不再互相缺失。
  - 风控与客服缺口仍需优先补图。
actions:
  - 维护位点别名字典并在每轮分析前加载。
  - 输出前执行“同义位点冲突扫描”。
insights:
  - id: 分期乐-app-借钱
    competitor: 分期乐
    dimension: APP
    period: 2026-W15
    page: 借钱
    conclusion: 借钱位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-app-0323-借钱.jpg
    currEvidence:
      - /evidence/分期乐-app-0402-借钱.jpg
    evidence:
      - /evidence/分期乐-app-0323-借钱.jpg
      - /evidence/分期乐-app-0402-借钱.jpg
  - id: 分期乐-app-我的页
    competitor: 分期乐
    dimension: APP
    period: 2026-W15
    page: 我的页
    conclusion: 我的页位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：我的。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-app-0323-我的页.jpg
    currEvidence:
      - /evidence/分期乐-app-0402-我的页.jpg
    evidence:
      - /evidence/分期乐-app-0323-我的页.jpg
      - /evidence/分期乐-app-0402-我的页.jpg
  - id: 分期乐-app-消息页
    competitor: 分期乐
    dimension: APP
    period: 2026-W15
    page: 消息页
    conclusion: 消息页位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：消息。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-app-0323-消息页.jpg
    currEvidence:
      - /evidence/分期乐-app-0402-消息页.jpg
    evidence:
      - /evidence/分期乐-app-0323-消息页.jpg
      - /evidence/分期乐-app-0402-消息页.jpg
  - id: 分期乐-app-购物推荐页
    competitor: 分期乐
    dimension: APP
    period: 2026-W15
    page: 购物推荐页
    conclusion: 购物推荐页位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：推荐、购物。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-app-0323-购物推荐页.jpg
    currEvidence:
      - /evidence/分期乐-app-0402-购物推荐页.jpg
    evidence:
      - /evidence/分期乐-app-0323-购物推荐页.jpg
      - /evidence/分期乐-app-0402-购物推荐页.jpg
  - id: 分期乐-app-购物页-买吖超市
    competitor: 分期乐
    dimension: APP
    period: 2026-W15
    page: 购物页 买吖超市
    conclusion: 购物页 买吖超市位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：购物。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-app-0323-购物页-买吖超市.jpg
    currEvidence:
      - /evidence/分期乐-app-0402-购物页-买吖超市.jpg
    evidence:
      - /evidence/分期乐-app-0323-购物页-买吖超市.jpg
      - /evidence/分期乐-app-0402-购物页-买吖超市.jpg
  - id: 分期乐-app-首页
    competitor: 分期乐
    dimension: APP
    period: 2026-W15
    page: 首页
    conclusion: 首页位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：首页。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-app-0323-首页.jpg
    currEvidence:
      - /evidence/分期乐-app-0402-首页.jpg
    evidence:
      - /evidence/分期乐-app-0323-首页.jpg
      - /evidence/分期乐-app-0402-首页.jpg
  - id: 分期乐-客服-im半浮层
    competitor: 分期乐
    dimension: 客服
    period: 2026-W15
    page: IM半浮层
    conclusion: IM半浮层会话与入口展示存在变化信号。
    compare: 同位点可比；识别信号：浮层。由于会话状态可能不一致，建议人工复核。
    impact: 中
    confidence: 是（建议人工复核）
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-客服-0323-im半浮层.jpg
    currEvidence:
      - /evidence/分期乐-客服-0402-im半浮层.jpg
    evidence:
      - /evidence/分期乐-客服-0323-im半浮层.jpg
      - /evidence/分期乐-客服-0402-im半浮层.jpg
  - id: 分期乐-客服-服务大厅
    competitor: 分期乐
    dimension: 客服
    period: 2026-W15
    page: 服务大厅
    conclusion: 服务大厅页面整体稳定，未见明显变化。
    compare: 双图关键结构一致（入口布局、信息层级、主操作位），变化不大，省略详细过程。
    impact: 低
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-客服-0323-服务大厅.jpg
    currEvidence:
      - /evidence/分期乐-客服-0402-服务大厅.jpg
    evidence:
      - /evidence/分期乐-客服-0323-服务大厅.jpg
      - /evidence/分期乐-客服-0402-服务大厅.jpg
  - id: 分期乐-消金-plus活动
    competitor: 分期乐
    dimension: 消金
    period: 2026-W15
    page: plus活动
    conclusion: plus活动本期缺图，无法完成跨期判断。
    compare: 仅有0323截图；识别信号：活动。需补拍0402同位点。
    impact: 中
    confidence: 是（建议人工复核）
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-消金-0323-plus活动.jpg
    currEvidence:
      - 无
    evidence:
      - /evidence/分期乐-消金-0323-plus活动.jpg
      - 无
  - id: 分期乐-消金-会员plus
    competitor: 分期乐
    dimension: 消金
    period: 2026-W15
    page: 会员plus
    conclusion: 会员plus基期缺图，无法完成跨期判断。
    compare: 仅有0402截图；识别信号：会员。需补拍0323同位点。
    impact: 中
    confidence: 是（建议人工复核）
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - 无
    currEvidence:
      - /evidence/分期乐-消金-0402-会员plus.jpg
    evidence:
      - 无
      - /evidence/分期乐-消金-0402-会员plus.jpg
  - id: 分期乐-消金-借钱
    competitor: 分期乐
    dimension: 消金
    period: 2026-W15
    page: 借钱
    conclusion: 借钱位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-消金-0323-借钱.jpg
    currEvidence:
      - /evidence/分期乐-消金-0402-借钱.jpg
    evidence:
      - /evidence/分期乐-消金-0323-借钱.jpg
      - /evidence/分期乐-消金-0402-借钱.jpg
  - id: 分期乐-消金-减息金活动
    competitor: 分期乐
    dimension: 消金
    period: 2026-W15
    page: 减息金活动
    conclusion: 减息金活动位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：减息、活动。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-消金-0323-减息金活动.jpg
    currEvidence:
      - /evidence/分期乐-消金-0402-减息金活动.jpg
    evidence:
      - /evidence/分期乐-消金-0323-减息金活动.jpg
      - /evidence/分期乐-消金-0402-减息金活动.jpg
  - id: 分期乐-消金-减息金活动2
    competitor: 分期乐
    dimension: 消金
    period: 2026-W15
    page: 减息金活动2
    conclusion: 减息金活动2位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：减息、活动。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-消金-0323-减息金活动2.jpg
    currEvidence:
      - /evidence/分期乐-消金-0402-减息金活动2.jpg
    evidence:
      - /evidence/分期乐-消金-0323-减息金活动2.jpg
      - /evidence/分期乐-消金-0402-减息金活动2.jpg
  - id: 分期乐-消金-额度中心
    competitor: 分期乐
    dimension: 消金
    period: 2026-W15
    page: 额度中心
    conclusion: 额度中心位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：额度。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-消金-0323-额度中心.jpg
    currEvidence:
      - /evidence/分期乐-消金-0402-额度中心.jpg
    evidence:
      - /evidence/分期乐-消金-0323-额度中心.jpg
      - /evidence/分期乐-消金-0402-额度中心.jpg
  - id: 分期乐-留存促活运营-活动落地页
    competitor: 分期乐
    dimension: 留存促活运营
    period: 2026-W15
    page: 活动落地页
    conclusion: 活动落地页运营触达方式发生变化，活动表达更活跃。
    compare: 同位点双周期可比；识别信号：弹窗、活动。本期活动素材/触达形式较上期更强。
    impact: 高
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/分期乐-留存促活运营-0323-活动落地页.jpg
    currEvidence:
      - /evidence/分期乐-留存促活运营-0402-活动落地页.jpg
    evidence:
      - /evidence/分期乐-留存促活运营-0323-活动落地页.jpg
      - /evidence/分期乐-留存促活运营-0402-活动落地页.jpg
  - id: 度小满-app-保险
    competitor: 度小满
    dimension: APP
    period: 2026-W15
    page: 保险
    conclusion: 保险位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：保险。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-app-0323-保险.jpg
    currEvidence:
      - /evidence/度小满-app-0402-保险.jpg
    evidence:
      - /evidence/度小满-app-0323-保险.jpg
      - /evidence/度小满-app-0402-保险.jpg
  - id: 度小满-app-借钱
    competitor: 度小满
    dimension: APP
    period: 2026-W15
    page: 借钱
    conclusion: 借钱位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-app-0323-借钱.jpg
    currEvidence:
      - /evidence/度小满-app-0402-借钱.jpg
    evidence:
      - /evidence/度小满-app-0323-借钱.jpg
      - /evidence/度小满-app-0402-借钱.jpg
  - id: 度小满-app-我的
    competitor: 度小满
    dimension: APP
    period: 2026-W15
    page: 我的
    conclusion: 我的位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：我的。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-app-0323-我的.jpg
    currEvidence:
      - /evidence/度小满-app-0402-我的.jpg
    evidence:
      - /evidence/度小满-app-0323-我的.jpg
      - /evidence/度小满-app-0402-我的.jpg
  - id: 度小满-app-理财
    competitor: 度小满
    dimension: APP
    period: 2026-W15
    page: 理财
    conclusion: 理财位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：理财。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-app-0323-理财.jpg
    currEvidence:
      - /evidence/度小满-app-0402-理财.jpg
    evidence:
      - /evidence/度小满-app-0323-理财.jpg
      - /evidence/度小满-app-0402-理财.jpg
  - id: 度小满-app-首页
    competitor: 度小满
    dimension: APP
    period: 2026-W15
    page: 首页
    conclusion: 首页运营活动露出显著增强，属于明显变化位点。
    compare: 同位点双周期均有截图；0402首屏活动化露出强于0323，运营触达感显著提升。
    impact: 高
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-app-0323-首页.jpg
    currEvidence:
      - /evidence/度小满-app-0402-首页.jpg
    evidence:
      - /evidence/度小满-app-0323-首页.jpg
      - /evidence/度小满-app-0402-首页.jpg
  - id: 度小满-客服-对话页
    competitor: 度小满
    dimension: 客服
    period: 2026-W15
    page: 对话页
    conclusion: 对话页本期缺图，无法完成跨期判断。
    compare: 仅有0323截图；识别信号：对话。需补拍0402同位点。
    impact: 高
    confidence: 是（建议人工复核）
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-客服-0323-对话页.jpg
    currEvidence:
      - 无
    evidence:
      - /evidence/度小满-客服-0323-对话页.jpg
      - 无
  - id: 度小满-客服-对话页2
    competitor: 度小满
    dimension: 客服
    period: 2026-W15
    page: 对话页2
    conclusion: 对话页2本期缺图，无法完成跨期判断。
    compare: 仅有0323截图；识别信号：对话。需补拍0402同位点。
    impact: 高
    confidence: 是（建议人工复核）
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-客服-0323-对话页2.jpg
    currEvidence:
      - 无
    evidence:
      - /evidence/度小满-客服-0323-对话页2.jpg
      - 无
  - id: 度小满-客服-消息中心
    competitor: 度小满
    dimension: 客服
    period: 2026-W15
    page: 消息中心
    conclusion: 消息中心本期缺图，无法完成跨期判断。
    compare: 仅有0323截图；识别信号：消息。需补拍0402同位点。
    impact: 高
    confidence: 是（建议人工复核）
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-客服-0323-消息中心.jpg
    currEvidence:
      - 无
    evidence:
      - /evidence/度小满-客服-0323-消息中心.jpg
      - 无
  - id: 度小满-客服-消息中心2
    competitor: 度小满
    dimension: 客服
    period: 2026-W15
    page: 消息中心2
    conclusion: 消息中心2本期缺图，无法完成跨期判断。
    compare: 仅有0323截图；识别信号：消息。需补拍0402同位点。
    impact: 高
    confidence: 是（建议人工复核）
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-客服-0323-消息中心2.jpg
    currEvidence:
      - 无
    evidence:
      - /evidence/度小满-客服-0323-消息中心2.jpg
      - 无
  - id: 度小满-消金-借钱
    competitor: 度小满
    dimension: 消金
    period: 2026-W15
    page: 借钱
    conclusion: 借钱位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-消金-0323-借钱.jpg
    currEvidence:
      - /evidence/度小满-消金-0402-借钱.jpg
    evidence:
      - /evidence/度小满-消金-0323-借钱.jpg
      - /evidence/度小满-消金-0402-借钱.jpg
  - id: 度小满-消金-额度页
    competitor: 度小满
    dimension: 消金
    period: 2026-W15
    page: 额度页
    conclusion: 额度页位点主链路稳定，局部内容有更新。
    compare: 同位点双周期均有截图；识别信号：额度。未见主流程重构，变化集中在素材与信息层。
    impact: 中
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-消金-0323-额度页.jpg
    currEvidence:
      - /evidence/度小满-消金-0402-额度页.jpg
    evidence:
      - /evidence/度小满-消金-0323-额度页.jpg
      - /evidence/度小满-消金-0402-额度页.jpg
  - id: 度小满-留存促活运营-活动落地页
    competitor: 度小满
    dimension: 留存促活运营
    period: 2026-W15
    page: 活动落地页
    conclusion: 活动落地页运营触达方式发生变化，活动表达更活跃。
    compare: 同位点双周期可比；识别信号：弹窗、活动。本期活动素材/触达形式较上期更强。
    impact: 高
    confidence: 否
    actions:
      - 按同位点继续追踪；缺图项优先补拍后再定版。
    prevEvidence:
      - /evidence/度小满-留存促活运营-0323-活动落地页.jpg
    currEvidence:
      - /evidence/度小满-留存促活运营-0402-活动落地页.jpg
    evidence:
      - /evidence/度小满-留存促活运营-0323-活动落地页.jpg
      - /evidence/度小满-留存促活运营-0402-活动落地页.jpg
---

## 结构化主表（按固定表头）

| 竞品 | 分析维度 | 页面位点 | 结论 | 0323截图（上期） | 0402截图（本期） | 对比过程（详细） | 影响等级 | 是否建议人工复核 |
|---|---|---|---|---|---|---|---|---|
| 分期乐 | APP | 借钱 | 借钱位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-app-0323-借钱.jpg) | ![](/evidence/分期乐-app-0402-借钱.jpg) | 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | APP | 我的页 | 我的页位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-app-0323-我的页.jpg) | ![](/evidence/分期乐-app-0402-我的页.jpg) | 同位点双周期均有截图；识别信号：我的。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | APP | 消息页 | 消息页位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-app-0323-消息页.jpg) | ![](/evidence/分期乐-app-0402-消息页.jpg) | 同位点双周期均有截图；识别信号：消息。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | APP | 购物推荐页 | 购物推荐页位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-app-0323-购物推荐页.jpg) | ![](/evidence/分期乐-app-0402-购物推荐页.jpg) | 同位点双周期均有截图；识别信号：推荐、购物。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | APP | 购物页 买吖超市 | 购物页 买吖超市位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-app-0323-购物页-买吖超市.jpg) | ![](/evidence/分期乐-app-0402-购物页-买吖超市.jpg) | 同位点双周期均有截图；识别信号：购物。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | APP | 首页 | 首页位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-app-0323-首页.jpg) | ![](/evidence/分期乐-app-0402-首页.jpg) | 同位点双周期均有截图；识别信号：首页。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | 客服 | IM半浮层 | IM半浮层会话与入口展示存在变化信号。 | ![](/evidence/分期乐-客服-0323-im半浮层.jpg) | ![](/evidence/分期乐-客服-0402-im半浮层.jpg) | 同位点可比；识别信号：浮层。由于会话状态可能不一致，建议人工复核。 | 中 | 是（建议人工复核） |
| 分期乐 | 客服 | 服务大厅 | 服务大厅页面整体稳定，未见明显变化。 | ![](/evidence/分期乐-客服-0323-服务大厅.jpg) | ![](/evidence/分期乐-客服-0402-服务大厅.jpg) | 双图关键结构一致（入口布局、信息层级、主操作位），变化不大，省略详细过程。 | 低 | 否 |
| 分期乐 | 消金 | plus活动 | plus活动本期缺图，无法完成跨期判断。 | ![](/evidence/分期乐-消金-0323-plus活动.jpg) | 无 | 仅有0323截图；识别信号：活动。需补拍0402同位点。 | 中 | 是（建议人工复核） |
| 分期乐 | 消金 | 会员plus | 会员plus基期缺图，无法完成跨期判断。 | 无 | ![](/evidence/分期乐-消金-0402-会员plus.jpg) | 仅有0402截图；识别信号：会员。需补拍0323同位点。 | 中 | 是（建议人工复核） |
| 分期乐 | 消金 | 借钱 | 借钱位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-消金-0323-借钱.jpg) | ![](/evidence/分期乐-消金-0402-借钱.jpg) | 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | 消金 | 减息金活动 | 减息金活动位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-消金-0323-减息金活动.jpg) | ![](/evidence/分期乐-消金-0402-减息金活动.jpg) | 同位点双周期均有截图；识别信号：减息、活动。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | 消金 | 减息金活动2 | 减息金活动2位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-消金-0323-减息金活动2.jpg) | ![](/evidence/分期乐-消金-0402-减息金活动2.jpg) | 同位点双周期均有截图；识别信号：减息、活动。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | 消金 | 额度中心 | 额度中心位点主链路稳定，局部内容有更新。 | ![](/evidence/分期乐-消金-0323-额度中心.jpg) | ![](/evidence/分期乐-消金-0402-额度中心.jpg) | 同位点双周期均有截图；识别信号：额度。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 分期乐 | 留存促活运营 | 活动落地页 | 活动落地页运营触达方式发生变化，活动表达更活跃。 | ![](/evidence/分期乐-留存促活运营-0323-活动落地页.jpg) | ![](/evidence/分期乐-留存促活运营-0402-活动落地页.jpg) | 同位点双周期可比；识别信号：弹窗、活动。本期活动素材/触达形式较上期更强。 | 高 | 否 |
| 度小满 | APP | 保险 | 保险位点主链路稳定，局部内容有更新。 | ![](/evidence/度小满-app-0323-保险.jpg) | ![](/evidence/度小满-app-0402-保险.jpg) | 同位点双周期均有截图；识别信号：保险。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 度小满 | APP | 借钱 | 借钱位点主链路稳定，局部内容有更新。 | ![](/evidence/度小满-app-0323-借钱.jpg) | ![](/evidence/度小满-app-0402-借钱.jpg) | 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 度小满 | APP | 我的 | 我的位点主链路稳定，局部内容有更新。 | ![](/evidence/度小满-app-0323-我的.jpg) | ![](/evidence/度小满-app-0402-我的.jpg) | 同位点双周期均有截图；识别信号：我的。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 度小满 | APP | 理财 | 理财位点主链路稳定，局部内容有更新。 | ![](/evidence/度小满-app-0323-理财.jpg) | ![](/evidence/度小满-app-0402-理财.jpg) | 同位点双周期均有截图；识别信号：理财。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 度小满 | APP | 首页 | 首页运营活动露出显著增强，属于明显变化位点。 | ![](/evidence/度小满-app-0323-首页.jpg) | ![](/evidence/度小满-app-0402-首页.jpg) | 同位点双周期均有截图；0402首屏活动化露出强于0323，运营触达感显著提升。 | 高 | 否 |
| 度小满 | 客服 | 对话页 | 对话页本期缺图，无法完成跨期判断。 | ![](/evidence/度小满-客服-0323-对话页.jpg) | 无 | 仅有0323截图；识别信号：对话。需补拍0402同位点。 | 高 | 是（建议人工复核） |
| 度小满 | 客服 | 对话页2 | 对话页2本期缺图，无法完成跨期判断。 | ![](/evidence/度小满-客服-0323-对话页2.jpg) | 无 | 仅有0323截图；识别信号：对话。需补拍0402同位点。 | 高 | 是（建议人工复核） |
| 度小满 | 客服 | 消息中心 | 消息中心本期缺图，无法完成跨期判断。 | ![](/evidence/度小满-客服-0323-消息中心.jpg) | 无 | 仅有0323截图；识别信号：消息。需补拍0402同位点。 | 高 | 是（建议人工复核） |
| 度小满 | 客服 | 消息中心2 | 消息中心2本期缺图，无法完成跨期判断。 | ![](/evidence/度小满-客服-0323-消息中心2.jpg) | 无 | 仅有0323截图；识别信号：消息。需补拍0402同位点。 | 高 | 是（建议人工复核） |
| 度小满 | 消金 | 借钱 | 借钱位点主链路稳定，局部内容有更新。 | ![](/evidence/度小满-消金-0323-借钱.jpg) | ![](/evidence/度小满-消金-0402-借钱.jpg) | 同位点双周期均有截图；识别信号：借钱。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 度小满 | 消金 | 额度页 | 额度页位点主链路稳定，局部内容有更新。 | ![](/evidence/度小满-消金-0323-额度页.jpg) | ![](/evidence/度小满-消金-0402-额度页.jpg) | 同位点双周期均有截图；识别信号：额度。未见主流程重构，变化集中在素材与信息层。 | 中 | 否 |
| 度小满 | 留存促活运营 | 活动落地页 | 活动落地页运营触达方式发生变化，活动表达更活跃。 | ![](/evidence/度小满-留存促活运营-0323-活动落地页.jpg) | ![](/evidence/度小满-留存促活运营-0402-活动落地页.jpg) | 同位点双周期可比；识别信号：弹窗、活动。本期活动素材/触达形式较上期更强。 | 高 | 否 |