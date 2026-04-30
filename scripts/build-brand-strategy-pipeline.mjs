import fs from 'fs';
import path from 'path';
const root=process.cwd();
const timeline=JSON.parse(fs.readFileSync(path.join(root,'data/app-version-timeline.json'),'utf8'));

function fileExistsUnderPublic(webPath=''){
  if(!webPath || /^https?:\/\//.test(webPath)) return false;
  const normalized = webPath.startsWith('/') ? webPath.slice(1) : webPath;
  return fs.existsSync(path.join(root,'public',normalized));
}
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
 const preferredShot = officialShots[name] || (latest?.screenshotUrls||[])[0] || '';
 const screenshotOk = fileExistsUnderPublic(preferredShot);
 compRows.push({
  brand:name,
  site:latest?.appStoreUrl||'#',
  positioning,
  heroCopy:diff[0]||'基于截图与日志，未识别到稳定可提取的大标题变化。',
  featureShowcase:diff[1]||'功能展示以应用市场截图可见信息为准。',
  pricing:hasPrice?'日志/截图中存在额度或利率相关表达。':'未识别到明确价格型表达。',
  cta:hasSpeed?'存在效率/转化导向表达。':'未识别到强转化文案。',
  trust:'以应用市场官方页可见信息为准。',
  status:screenshotOk?'已抓取应用市场截图与日志':'缺少截图（请核对 public/brand-screenshots）',
  screenshot: screenshotOk ? preferredShot : ''
 })
}
const bossConclusions=[
 '本轮样本整体以品牌叙事型表达为主，价格/效率型强转化表达占比偏低。',
 '可提取文本主要来自应用市场更新日志，品牌官网层面的功能与权益表达证据相对不足。',
 '当前证据更适合支持“风格倾向判断”，不宜直接外推为长期战略迁移结论。'
];
const diffSummary=compRows.map(r=>`${r.brand}：${r.positioning}`);
const out={generatedAt:new Date().toISOString(),range:snaps[snaps.length-1]?.id||'本期',rows:compRows,bossConclusions,diffSummary};
fs.writeFileSync(path.join(root,'data/brand_strategy_page_data.json'),JSON.stringify(out,null,2));
console.log('wrote brand_strategy_page_data.json');
