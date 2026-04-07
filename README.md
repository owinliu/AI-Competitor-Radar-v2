# AI Competitor Radar Web

正式版报告站：Next.js + Tailwind + shadcn/ui 风格组件。

## 本地启动

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 报告发布规则

1. 新增 Markdown 到 `content/reports/`
2. 文件名即 slug：`YYYY-MM-DD-xxx.md`
3. 必填 frontmatter：

```yaml
---
title: "标题"
date: "2026-04-07"
summary: "一句话摘要"
---
```

4. 提交到 `main` 后，Vercel 自动部署。
