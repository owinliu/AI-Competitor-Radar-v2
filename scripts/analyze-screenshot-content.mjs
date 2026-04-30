import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { execFileSync } from "child_process";

const root = process.cwd();
const timelinePath = path.join(root, "data", "app-version-timeline.json");
const outPath = path.join(root, "data", "screenshot-content-analysis.json");

function toTime(s) {
  const t = new Date(s || "").getTime();
  return Number.isNaN(t) ? 0 : t;
}

function dedupeByVersion(items) {
  const map = new Map();
  for (const item of items) {
    const prev = map.get(item.version);
    if (!prev || toTime(item.capturedAt) > toTime(prev.capturedAt)) map.set(item.version, item);
  }
  return Array.from(map.values()).sort((a, b) => toTime(b.currentVersionReleaseDate || b.capturedAt) - toTime(a.currentVersionReleaseDate || a.capturedAt));
}

async function download(url, filepath) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buf);
}

function runTesseract(imagePath) {
  const outBase = imagePath + ".ocr";
  try {
    execFileSync("tesseract", [imagePath, outBase, "-l", "chi_sim+eng", "--psm", "6"], { stdio: "ignore" });
    const txtPath = outBase + ".txt";
    const txt = fs.existsSync(txtPath) ? fs.readFileSync(txtPath, "utf8") : "";
    return txt;
  } catch {
    return "";
  }
}

function cleanText(s) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function tokens(s) {
  return cleanText(s)
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/)
    .filter((x) => x.length >= 2)
    .slice(0, 2000);
}

function diffWords(latest, prev) {
  const a = tokens(latest);
  const b = new Set(tokens(prev));
  const out = [];
  for (const w of a) if (!b.has(w) && !out.includes(w)) out.push(w);
  return out.slice(0, 20);
}

function inferFocus(text) {
  const t = text.toLowerCase();
  const rules = [
    ["转化导向", /(loan|credit|borrow|cash|额度|借款|借钱|分期|申请|立即|提额)/],
    ["优惠活动导向", /(coupon|bonus|reward|offer|优惠|免息|红包|福利|活动|折扣)/],
    ["服务触达导向", /(service|support|message|help|客服|服务|消息|提醒)/],
    ["体验稳定导向", /(fix|improve|optimi|performance|stable|修复|优化|升级|稳定)/],
  ];
  const hit = rules.filter(([, re]) => re.test(t)).map(([k]) => k);
  return hit.length ? hit : ["常规更新"];
}

async function main() {
  if (!fs.existsSync(timelinePath)) {
    fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), items: [] }, null, 2));
    return;
  }

  const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf8"));
  const byComp = new Map();
  for (const item of timeline) {
    const arr = byComp.get(item.competitor) || [];
    arr.push(item);
    byComp.set(item.competitor, arr);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "radar-ocr-"));
  const items = [];

  for (const [competitor, rows] of byComp.entries()) {
    const versions = dedupeByVersion(rows);
    const latest = versions[0];
    const previous = versions[1];
    if (!latest) continue;

    async function ocrFor(entry) {
      const urls = (entry?.screenshotUrls || []).slice(0, 2);
      const chunks = [];
      for (const url of urls) {
        try {
          const ext = url.includes(".png") ? ".png" : ".jpg";
          const file = path.join(tmpDir, crypto.createHash("md5").update(url).digest("hex") + ext);
          await download(url, file);
          chunks.push(cleanText(runTesseract(file)));
        } catch {
          chunks.push("");
        }
      }
      return cleanText(chunks.filter(Boolean).join(" \n "));
    }

    const latestOcr = await ocrFor(latest);
    const previousOcr = await ocrFor(previous);
    const textBase = `${latest.releaseNotes || ""}\n${latestOcr}`;

    items.push({
      competitor,
      latestVersion: latest.version || "",
      previousVersion: previous?.version || "",
      screenshotCount: (latest.screenshotUrls || []).length,
      focus: inferFocus(textBase),
      newWords: diffWords(`${latest.releaseNotes || ""}\n${latestOcr}`, `${previous?.releaseNotes || ""}\n${previousOcr}`),
      latestOcrSnippet: latestOcr.slice(0, 240),
      previousOcrSnippet: previousOcr.slice(0, 240),
    });
  }

  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), engine: "tesseract-eng", items }, null, 2));
  console.log(`wrote ${outPath}`);
}

main();
