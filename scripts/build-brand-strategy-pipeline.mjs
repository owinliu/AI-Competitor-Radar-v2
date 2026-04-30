import fs from 'fs';
import path from 'path';
const root=process.cwd();

function fileExistsUnderPublic(webPath=''){
  if(!webPath || /^https?:\/\//.test(webPath)) return false;
  const normalized = webPath.startsWith('/') ? webPath.slice(1) : webPath;
  return fs.existsSync(path.join(root,'public',normalized));
}

const siteDataPath = path.join(root,'data','brand_strategy_site_data.json');
const siteData = fs.existsSync(siteDataPath) ? JSON.parse(fs.readFileSync(siteDataPath,'utf8')) : { range: '本期', rows: [] };

const rows = (siteData.rows || []).map((r)=>{
  const screenshotOk = fileExistsUnderPublic(r.screenshot || '');
  return {
    ...r,
    status: screenshotOk ? (r.status || '已抓取官网整页截图') : '缺少官网截图（请核对 public/brand-screenshots）',
    screenshot: screenshotOk ? r.screenshot : ''
  };
});

const out={
  generatedAt:new Date().toISOString(),
  range:siteData.range || '本期',
  rows,
  bossConclusions:siteData.bossConclusions || [],
  diffSummary:siteData.diffSummary || []
};

fs.writeFileSync(path.join(root,'data/brand_strategy_page_data.json'),JSON.stringify(out,null,2));
console.log('wrote brand_strategy_page_data.json from brand_strategy_site_data.json');
