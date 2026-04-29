import fs from 'fs';
import path from 'path';
const root=process.cwd();
const timeline=JSON.parse(fs.readFileSync(path.join(root,'data/app-version-timeline.json'),'utf8'));
const snapsPath=path.join(root,'data/monitoring-snapshots.json');
const snaps=fs.existsSync(snapsPath)?(JSON.parse(fs.readFileSync(snapsPath,'utf8')).snapshots||[]):[];

function t(s){const x=new Date(s||'').getTime();return Number.isNaN(x)?0:x}
function dedupe(items){const m=new Map();for(const i of items){const p=m.get(i.version);if(!p||t(i.capturedAt)>t(p.capturedAt))m.set(i.version,i)}return [...m.values()].sort((a,b)=>t(b.currentVersionReleaseDate||b.capturedAt)-t(a.currentVersionReleaseDate||a.capturedAt))}
function noteDiff(a='',b=''){const x=a.split(/\n+/).map(s=>s.trim()).filter(Boolean);const y=new Set(b.split(/\n+/).map(s=>s.trim()).filter(Boolean));return x.filter(v=>!y.has(v)).slice(0,4)}

const grouped=new Map();for(const r of timeline){const arr=grouped.get(r.competitor)||[];arr.push(r);grouped.set(r.competitor,arr)}
const compRows=[];
for(const [name,items] of grouped.entries()){
 const u=dedupe(items), latest=u[0], prev=u[1];
 const diff=noteDiff(latest?.releaseNotes||'',prev?.releaseNotes||'');
 const hasPrice=diff.some(x=>/(利率|额度|免息|年化)/.test(x));
 const hasSpeed=diff.some(x=>/(分钟|审批|放款|快速|立即)/.test(x));
 const positioning=hasPrice||hasSpeed?'偏转化导向（价格/效率信息更突出）':'偏品牌叙事导向（品牌与平台信息占比更高）';
 const officialShots = {
  '分期乐':'/brand-screenshots/fenqile-full.png',
  '奇富借条':'/brand-screenshots/qifu-full.png',
  '安逸花':'/brand-screenshots/anyihua-full.png',
  '小赢':'/brand-screenshots/xiaoying-full.png',
  '度小满':'/brand-screenshots/duxiaoman-full.png'
 };
 compRows.push({
  brand:name,
  site:latest?.appStoreUrl||'#',
  positioning,
  heroCopy:diff[0]||'基于截图与日志，未识别到稳定可提取的大标题变化。',
  featureShowcase:diff[1]||'功能展示以应用市场截图可见信息为准。',
  pricing:hasPrice?'日志/截图中存在额度或利率相关表达。':'未识别到明确价格型表达。',
  cta:hasSpeed?'存在效率/转化导向表达。':'未识别到强转化文案。',
  trust:'以应用市场官方页可见信息为准。',
  status:'已抓取应用市场截图与日志',
  screenshot: officialShots[name] || (latest?.screenshotUrls||[])[0] || ''
 })
}
const bossConclusions=[
 '本页结论仅基于应用市场截图与可提取文本（更新日志）生成。',
 '当截图与日志同时出现额度/利率/审批速度表达时，判为转化导向增强。',
 '当可提取价格与效率表达较少时，判为品牌叙事占比更高。'
];
const diffSummary=compRows.map(r=>`${r.brand}：${r.positioning}`);
const out={generatedAt:new Date().toISOString(),range:snaps[snaps.length-1]?.id||'本期',rows:compRows,bossConclusions,diffSummary};
fs.writeFileSync(path.join(root,'data/brand_strategy_page_data.json'),JSON.stringify(out,null,2));
console.log('wrote brand_strategy_page_data.json');
