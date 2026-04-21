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
    status: "已补全页截图",
    screenshot: "/brand-screenshots/fenqile-full.png"
  },
  {
    brand: "奇富借条（360借条）",
    site: "https://www.360jie.com.cn/",
    positioning: "以“上市系科技信贷平台”形象承接借款转化，强调便捷与安全并重。",
    heroCopy: "2023年度亚洲银行家中国最佳信贷项目（首屏荣誉露出 + 借款卡片并列）",
    featureShowcase: "产品优势与借款步骤前置：线上申请、智能风控、便捷借款路径清晰。",
    pricing: "页面借款卡片露出“最高额度200,000”，定价信息弱于额度信息。",
    cta: "首屏“立即借款/查看额度”导向明显，后续区域继续承接借款路径。",
    trust: "荣誉奖项、集团里程碑、安全保障、合作机构与ESG板块完整呈现。",
    status: "已补全页截图",
    screenshot: "/brand-screenshots/qifu-full.png"
  },
  {
    brand: "安逸花",
    site: "https://anyihua.msxf.com/",
    positioning: "主打“额度+速度+分期”的普惠借款平台叙事，强调可得性与便捷性。",
    heroCopy: "首屏主文案“最长可分12期还”，并配下载二维码与导航入口。",
    featureShowcase: "“安逸花贷款5大优势”清晰列出：额度高、放款快、更灵活、享权益、持牌消金。",
    pricing: "APP示意卡露出“最高可借200,000”；优势文案含“年化利率(单利)7.2%-24%”。",
    cta: "扫码下载与借款申请路径并行，导向“下载-申请-放款”闭环。",
    trust: "“持牌金融机构产品”与企业服务信息（服务热线95090）共同构成信任背书。",
    status: "已补全页截图",
    screenshot: "/brand-screenshots/anyihua-full.png"
  },
  {
    brand: "小赢",
    site: "https://www.xiaoyinggroup.com/",
    positioning: "集团品牌官网定位，主叙事偏‘金融向善、服务美好数字生活’。",
    heroCopy: "首屏主文案“科技融汇金融向善 共筑美好数字生活”。",
    featureShowcase: "首屏以下信息密度较低，当前抓取画面以品牌页框架与底部联系信息为主。",
    pricing: "未见借款额度/利率等价格型露出。",
    cta: "页面以品牌信息浏览为主，未见强借款转化按钮前置。",
    trust: "企业品牌识别、联系方式、二维码等基础信息露出。",
    status: "已补全页截图",
    screenshot: "/brand-screenshots/xiaoying-full.png"
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
    status: "已补全页截图",
    screenshot: "/brand-screenshots/duxiaoman-full.png"
  }
];

export default function BrandStrategyPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">品牌策略分析</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          对比对象：分期乐、奇富借条、安逸花、小赢、度小满。维度覆盖：品牌定位、首屏文案、功能展示、定价策略、CTA 转化、信任背书。
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          数据来源：官网首页自动访问与页面截图（本轮抓取时间：2026-04-09）。
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
        <h2 className="text-lg font-semibold">官网截图（5个产品）</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rows.map((r) => (
            <figure key={`${r.brand}-shot`} className="overflow-hidden rounded-lg border bg-background">
              <img src={`${basePath}${r.screenshot}`} alt={`${r.brand} 官网截图`} className="w-full object-contain bg-slate-50" />
              <figcaption className="border-t px-3 py-2 text-xs text-muted-foreground">
                {r.brand} · {r.site}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">本轮关键结论</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>分期乐、奇富借条、安逸花的首页均明显前置“额度/借款效率”信息，转化导向更强。</li>
          <li>度小满以“平台能力+生态合作+社会责任”叙事为主，产品能力展示广但价格信息不前置。</li>
          <li>小赢集团官网当前首屏以品牌主张为核心，借款产品与价格卖点露出较少。</li>
          <li>五家官网在信任背书上都较重：奖项、合作机构、资质/合规与品牌历史均有露出。</li>
        </ul>
      </section>
    </div>
  );
}
