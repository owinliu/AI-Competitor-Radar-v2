import fs from 'fs';
import path from 'path';

const root = process.cwd();
const fail = (msg) => { console.error(`SOURCE_BOUNDARY_FAIL: ${msg}`); process.exitCode = 1; };

function read(p){ return fs.readFileSync(path.join(root,p),'utf8'); }

const brand = read('data/brand_strategy_page_data.json');
if (/应用市场|更新日志|appStore|App\s*Store|日志/.test(brand)) fail('brand_strategy_page_data.json contains non-official-site terms');

const evidence = read('data/evidence_page_data.json');
if (/官网|官网整页|官方网站/.test(evidence)) fail('evidence_page_data.json contains official-site terms');

if (!process.exitCode) console.log('source-boundary validation passed');
