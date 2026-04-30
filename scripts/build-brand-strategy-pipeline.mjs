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
 '共性策略1（利益点前置）：多数品牌在首屏或更新文案中优先呈现“免息/便捷/省心/稳定”等低门槛价值点，先降低用户决策阻力。',
 '共性策略2（流程与效率弱承诺）：普遍使用“流程简捷、功能稳定、体验优化”等表达，减少理解成本并强化“可快速上手”的感知。',
 '共性策略3（平台背书兜底）：核心信息主要锚定应用市场可见内容与官方渠道信息，帮助提升初次接触阶段的信任感与安全感。'
];

const mainstream = '偏品牌叙事导向（品牌与平台信息占比更高）';
const outlierRows = compRows.filter(r => r.positioning !== mainstream);
const diffSummary = outlierRows.length
  ? outlierRows.map(r=>`${r.brand}：在“价格/效率信息密度”维度明显高于主流。优点：更直接推动转化；缺点：若信任与服务信息承接不足，易产生短促营销感。`)
  : ['本期各品牌在展示策略上整体接近，未出现明显离群者；差异主要体现在文案细节强弱。'];
const out={generatedAt:new Date().toISOString(),range:snaps[snaps.length-1]?.id||'本期',rows:compRows,bossConclusions,diffSummary};
fs.writeFileSync(path.join(root,'data/brand_strategy_page_data.json'),JSON.stringify(out,null,2));
console.log('wrote brand_strategy_page_data.json');
