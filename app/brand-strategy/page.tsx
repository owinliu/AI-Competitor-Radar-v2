const rows = [
  {
    brand: "分期乐",
    site: "https://www.fenqile.com",
    positioning: "年轻消费与小微信贷双线，强调‘信赖之选’与普惠创业故事",
    heroCopy: "超两亿用户的信赖之选",
    featureShowcase: "借款/商城/小微周转并列展示，突出额度、到账速度、免息与分期",
    pricing: "明确披露‘年利率低至8%起、新人最长30天免息’",
    cta: "扫码下载、借款入口、客服触点并行，导向下载与转化",
    trust: "ISO认证、0数据泄露纪录、百家银行合作与品牌荣誉",
    status: "已抓取"
  },
  {
    brand: "奇富借条（360借条）",
    site: "https://www.360jie.com",
    positioning: "主打大平台风控与便捷借款（本轮自动抓取受限）",
    heroCopy: "待补抓",
    featureShowcase: "待补抓",
    pricing: "待补抓",
    cta: "待补抓",
    trust: "待补抓",
    status: "官网反爬限制，待人工补抓"
  },
  {
    brand: "安逸花",
    site: "https://www.anyihua.com",
    positioning: "主打普惠借款与便捷服务（本轮自动抓取受限）",
    heroCopy: "待补抓",
    featureShowcase: "待补抓",
    pricing: "待补抓",
    cta: "待补抓",
    trust: "待补抓",
    status: "官网反爬限制，待人工补抓"
  },
  {
    brand: "小赢",
    site: "https://www.xiaoying.com",
    positioning: "上市公司背景下的普惠服务平台，强调服务个体与小微",
    heroCopy: "页面主视觉偏‘金融权益保障’导向，品牌口号露出较克制",
    featureShowcase: "官网以公司简介/动态为主，产品功能呈现相对轻",
    pricing: "首页未见强定价露出，偏品牌与机构背书路径",
    cta: "客服热线 952592 + 内容入口，转化偏‘咨询型’",
    trust: "纽交所上市公司背景、投诉热线与公开备案信息",
    status: "已抓取"
  },
  {
    brand: "度小满",
    site: "https://www.duxiaoman.com",
    positioning: "科技金融平台定位，强调‘伙伴先赢，持续共赢’与AI能力",
    heroCopy: "一站式金科开放平台 / 助力小微企业成就美好生活（轮播）",
    featureShowcase: "信贷、理财、保险、支付、金融科技全线能力，强调开放生态",
    pricing: "首页以能力与生态叙事为主，定价信息不前置",
    cta: "在线客服、下载、登录等多入口，偏平台化分流",
    trust: "合作金融机构规模、CSR叙事、资质备案与联系方式完备",
    status: "已抓取"
  }
];

export default function BrandStrategyPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">品牌策略分析</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          对比对象：分期乐、奇富借条、安逸花、小赢、度小满。维度覆盖：品牌定位、首屏文案、功能展示、定价策略、CTA 转化、信任背书。
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          数据来源：官网首页自动访问与页面结构抓取（本轮抓取时间：2026-04-09）。
        </p>
      </section>

      <section className="rounded-xl border bg-card p-4 md:p-6 overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="px-3 py-3">品牌</th>
              <th className="px-3 py-3">品牌定位</th>
              <th className="px-3 py-3">首屏文案</th>
              <th className="px-3 py-3">功能展示</th>
              <th className="px-3 py-3">定价策略</th>
              <th className="px-3 py-3">CTA 转化</th>
              <th className="px-3 py-3">信任背书</th>
              <th className="px-3 py-3">抓取状态</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.brand} className="border-b align-top last:border-0">
                <td className="px-3 py-3 font-medium">
                  <div>{r.brand}</div>
                  <a href={r.site} target="_blank" className="text-xs text-primary underline-offset-2 hover:underline" rel="noreferrer">
                    官网
                  </a>
                </td>
                <td className="px-3 py-3">{r.positioning}</td>
                <td className="px-3 py-3">{r.heroCopy}</td>
                <td className="px-3 py-3">{r.featureShowcase}</td>
                <td className="px-3 py-3">{r.pricing}</td>
                <td className="px-3 py-3">{r.cta}</td>
                <td className="px-3 py-3">{r.trust}</td>
                <td className="px-3 py-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">本轮关键结论（先给可行动结论）</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>分期乐在“价格与效率”信息上最前置，属于强转化导向官网结构。</li>
          <li>度小满以“平台能力 + 生态合作”叙事为主，偏 B 端可信度与综合品牌势能。</li>
          <li>小赢首页更偏品牌与资讯承接，产品卖点与价格信息前置程度较低。</li>
          <li>奇富借条、安逸花本轮受反爬限制，建议补充人工截图后完成最终对照评分。</li>
        </ul>
      </section>
    </div>
  );
}
