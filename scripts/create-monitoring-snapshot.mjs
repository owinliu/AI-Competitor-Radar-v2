import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = process.cwd();
const snapshotsPath = path.join(root, "data", "monitoring-snapshots.json");
const timelinePath = path.join(root, "data", "app-version-timeline.json");
const brandPagePath = path.join(root, "app", "brand-strategy", "page.tsx");

function readJson(p, fallback) {
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; }
}

function hash(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}

function buildAppMetrics() {
  const timeline = readJson(timelinePath, []);
  const byComp = new Map();
  for (const item of timeline) {
    const arr = byComp.get(item.competitor) || [];
    arr.push(item);
    byComp.set(item.competitor, arr);
  }
  let changed = 0;
  let withVersion = 0;
  for (const [, arr] of byComp.entries()) {
    arr.sort((a, b) => new Date(b.currentVersionReleaseDate || b.capturedAt).getTime() - new Date(a.currentVersionReleaseDate || a.capturedAt).getTime());
    if (arr[0]?.version) withVersion += 1;
    if (arr[0]?.version && arr[1]?.version && arr[0].version !== arr[1].version) changed += 1;
  }
  return {
    competitors: byComp.size,
    withVersion,
    changedCompetitors: changed,
    totalRecords: timeline.length,
  };
}

function buildBrandMetrics() {
  const content = fs.existsSync(brandPagePath) ? fs.readFileSync(brandPagePath, "utf8") : "";
  const shotMatches = [...content.matchAll(/screenshot:\s*"([^"]+)"/g)].map((m) => m[1]);
  const statuses = [...content.matchAll(/status:\s*"([^"]+)"/g)].map((m) => m[1]);
  const resolved = shotMatches.filter((s) => s.includes("-full.")).length;
  const pending = statuses.filter((s) => s.includes("待补")).length;

  const shotHashes = {};
  for (const s of shotMatches) {
    const full = path.join(root, "public", s.replace(/^\//, ""));
    if (fs.existsSync(full)) {
      shotHashes[s] = hash(fs.readFileSync(full));
    }
  }

  return {
    competitors: shotMatches.length,
    resolvedScreenshots: resolved,
    pendingScreenshots: pending,
    screenshotHashes: shotHashes,
  };
}

const old = readJson(snapshotsPath, { snapshots: [] });
const snapshots = Array.isArray(old.snapshots) ? old.snapshots : [];

const newItem = {
  id: new Date().toISOString().slice(0, 10) + "-" + String(snapshots.length + 1).padStart(3, "0"),
  createdAt: new Date().toISOString(),
  appUpdates: buildAppMetrics(),
  brandStrategy: buildBrandMetrics(),
};

snapshots.push(newItem);
fs.writeFileSync(snapshotsPath, JSON.stringify({ snapshots }, null, 2));
console.log("snapshot saved:", newItem.id);
