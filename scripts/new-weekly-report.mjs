import fs from 'fs';
import path from 'path';

const title = process.argv[2] || '新周报';
const date = process.argv[3] || new Date().toISOString().slice(0,10);
const slug = `${date}-${title.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g,'-').replace(/(^-|-$)/g,'')}`;
const out = path.join(process.cwd(),'content','reports',`${slug}.md`);
if (fs.existsSync(out)) {
  console.error('exists:', out);
  process.exit(1);
}
const tpl = `---
title: "${title}"
date: "${date}"
summary: "待补"
tags:\n  - 周报
competitors:\n  - 分期乐
dimensions:\n  - APP
period: "${date.slice(0,4)}-Wxx"
highlights:\n  - 待补
actions:\n  - 待补
insights:\n  - id: sample
    competitor: 分期乐
    dimension: APP
    period: ${date.slice(0,4)}-Wxx
    conclusion: 待补
    impact: 中
    confidence: 中/是
    actions:\n      - 待补
    evidence:\n      - /evidence/sample.jpg
---

## 结构化主表（按固定表头）

| 竞品 | 分析维度 | 页面位点 | 结论 | 上期 | 本期 | 对比过程 | 影响等级 | 置信度/复核 |
|---|---|---|---|---|---|---|---|---|
| 待补 | 待补 | 待补 | 待补 | 待补 | 待补 | 待补 | 中 | 中/是 |
`;
fs.writeFileSync(out,tpl);
console.log(out);
