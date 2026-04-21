import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const root = process.cwd();
const configPath = path.join(root, "data", "app-market-apps.json");
const timelinePath = path.join(root, "data", "app-version-timeline.json");

const apps = JSON.parse(fs.readFileSync(configPath, "utf8"));
const timeline = fs.existsSync(timelinePath) ? JSON.parse(fs.readFileSync(timelinePath, "utf8")) : [];

function formatDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toISOString();
}

async function fetchLookup(trackId) {
  const url = `https://itunes.apple.com/lookup?id=${trackId}&country=cn`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`lookup failed: ${trackId} ${res.status}`);
  const json = await res.json();
  return json?.results?.[0] || null;
}

function uniq(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

async function fetchMiDetailApi(miDetailId) {
  if (!miDetailId) return null;
  try {
    const url = `https://m.app.mi.com/detailapi/${miDetailId}`;
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const json = await res.json();
    const appMap = json?.appMap || {};
    const screenshots = uniq((json?.appScreenshot || []).map((x) => String(x || "").replace("http://", "https://"))).slice(0, 8);
    return {
      screenshots,
      versionName: appMap.versionName || appMap.vname || "",
      releaseNotes: appMap.changeLog || appMap.description || appMap.introduction || "",
      appName: appMap.displayName || "",
      packageName: appMap.packageName || "",
      uploadTime: appMap.uploadtime || "",
      sourceUrl: url,
    };
  } catch {
    return null;
  }
}

async function fetchAppStoreHtmlScreenshots(trackId) {
  try {
    const url = `https://apps.apple.com/cn/app/id${trackId}`;
    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const matches = html.match(/https:\/\/is\d+-ssl\.mzstatic\.com\/image\/thumb\/[^"]+/g) || [];
    const cleaned = matches
      .map((x) => x.replace(/\\u002F/g, "/").replace(/\/$/, ""))
      .filter((x) => /\/(source|bb)\./.test(x));
    return uniq(cleaned).slice(0, 8);
  } catch {
    return [];
  }
}

async function fetchAndroidMarketScreenshots(app) {
  // Fallback chain #3a: static html regex
  if (!app.androidMarketUrl) return { screenshots: [], source: "" };
  try {
    const res = await fetch(app.androidMarketUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });
    if (!res.ok) return { screenshots: [], source: "" };
    const html = await res.text();

    const patterns = [
      /https?:\/\/[^"'\s>]*?(?:screenshot|screen|preview)[^"'\s>]*\.(?:jpg|jpeg|png|webp)/gi,
      /https?:\/\/img\.app\.mi\.com\/[^"'\s>]+/gi,
      /https?:\/\/[^"'\s>]*hms\.dbankcloud\.com[^"'\s>]+/gi,
      /https?:\/\/static\.sj\.qq\.com\/wupload2\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s>]*)?/gi,
    ];

    const all = [];
    for (const re of patterns) {
      const m = html.match(re) || [];
      all.push(...m);
    }

    const screenshots = uniq(all).slice(0, 8);
    return { screenshots, source: screenshots.length ? "android-market-html" : "" };
  } catch {
    return { screenshots: [], source: "" };
  }
}

async function fetchAndroidMarketScreenshotsRendered(app) {
  // Fallback chain #3b: rendered DOM extraction (for JS-driven pages such as sj.qq.com)
  if (!app.androidMarketUrl) return { screenshots: [], source: "" };
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" });
    await page.goto(app.androidMarketUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(6000);

    const urls = await page.evaluate(() => {
      const out = [];
      const push = (u) => {
        if (!u) return;
        const v = String(u);
        if (/\.(jpg|jpeg|png|webp)(\?|$)/i.test(v)) out.push(v);
      };

      document.querySelectorAll("img").forEach((img) => {
        push(img.getAttribute("src"));
        push(img.getAttribute("data-src"));
        push(img.getAttribute("data-original"));
      });

      // CSS background-image fallback
      document.querySelectorAll("*").forEach((el) => {
        const bg = getComputedStyle(el).backgroundImage || "";
        const m = bg.match(/url\(["']?([^"')]+)["']?\)/i);
        if (m) push(m[1]);
      });

      return out;
    });

    const screenshots = uniq(
      (urls || []).filter((u) =>
        /(?:wupload2|screenshot|screen|preview|appdetail)/i.test(u) &&
        !/yyb-logo|qrcode|account|avatar|icon/i.test(u)
      )
    ).slice(0, 8);

    await browser.close();
    return { screenshots, source: screenshots.length ? "android-market-render" : "" };
  } catch {
    if (browser) await browser.close();
    return { screenshots: [], source: "" };
  }
}

function existsSameVersion(arr, item) {
  return arr.some(
    (x) =>
      x.competitor === item.competitor &&
      x.market === item.market &&
      x.trackId === item.trackId &&
      x.version === item.version
  );
}

async function main() {
  const capturedAt = new Date().toISOString();
  const added = [];
  const skipped = [];
  const failed = [];
  const addedItems = [];

  for (const app of apps) {
    try {
      const data = await fetchLookup(app.trackId);
      if (!data) {
        failed.push({ app, reason: "no result" });
        continue;
      }

      let screenshotUrls = Array.isArray(data.screenshotUrls) ? data.screenshotUrls.slice(0, 8) : [];
      let screenshotSource = screenshotUrls.length ? "appstore-lookup" : "";

      const mi = await fetchMiDetailApi(app.miDetailId);

      // Fallback #2a: Xiaomi detail API (high-quality fallback for Android screenshots/text)
      if (!screenshotUrls.length && mi?.screenshots?.length) {
        screenshotUrls = mi.screenshots;
        screenshotSource = "xiaomi-detailapi";
      }

      // Fallback #2b: App Store detail HTML parsing
      if (!screenshotUrls.length) {
        const htmlShots = await fetchAppStoreHtmlScreenshots(app.trackId);
        if (htmlShots.length) {
          screenshotUrls = htmlShots;
          screenshotSource = "appstore-html";
        }
      }

      // Fallback #3a: Android market static html
      if (!screenshotUrls.length) {
        const android = await fetchAndroidMarketScreenshots(app);
        if (android.screenshots.length) {
          screenshotUrls = android.screenshots;
          screenshotSource = android.source;
        }
      }

      // Fallback #3b: Android market rendered DOM
      if (!screenshotUrls.length) {
        const androidRendered = await fetchAndroidMarketScreenshotsRendered(app);
        if (androidRendered.screenshots.length) {
          screenshotUrls = androidRendered.screenshots;
          screenshotSource = androidRendered.source;
        }
      }

      const item = {
        competitor: app.competitor,
        platform: app.platform,
        market: screenshotSource === "xiaomi-detailapi" ? "Xiaomi Market (fallback)" : app.market,
        trackId: app.trackId,
        trackName: data.trackName || mi?.appName || "",
        sellerName: data.sellerName || "",
        bundleId: data.bundleId || mi?.packageName || "",
        version: data.version || mi?.versionName || "",
        currentVersionReleaseDate: formatDate(data.currentVersionReleaseDate || mi?.uploadTime),
        releaseNotes: data.releaseNotes || mi?.releaseNotes || "",
        appStoreUrl: screenshotSource === "xiaomi-detailapi" ? (mi?.sourceUrl || "") : (data.trackViewUrl || ""),
        iconUrl: data.artworkUrl100 || data.artworkUrl60 || "",
        screenshotUrls,
        screenshotSource,
        androidMarketUrl: app.androidMarketUrl || "",
        miDetailId: app.miDetailId || "",
        capturedAt,
      };

      if (existsSameVersion(timeline, item)) {
        skipped.push(`${app.competitor} v${item.version}`);
      } else {
        timeline.push(item);
        addedItems.push(item);
        added.push(`${app.competitor} v${item.version}${item.screenshotSource ? ` (${item.screenshotSource})` : ""}`);
      }
    } catch (e) {
      failed.push({ app, reason: String(e) });
    }
  }

  // Quality gate: remove shared/generic android-market images accidentally reused across competitors
  const urlToCompetitors = new Map();
  for (const item of addedItems) {
    if (!String(item.screenshotSource || "").startsWith("android-market")) continue;
    for (const u of item.screenshotUrls || []) {
      const set = urlToCompetitors.get(u) || new Set();
      set.add(item.competitor);
      urlToCompetitors.set(u, set);
    }
  }

  for (const item of addedItems) {
    if (!String(item.screenshotSource || "").startsWith("android-market")) continue;
    const filtered = (item.screenshotUrls || []).filter((u) => {
      const set = urlToCompetitors.get(u);
      const sharedAcrossApps = set && set.size > 1;
      const looksGeneric = /static\.sj\.qq\.com\/wupload2\//i.test(u);
      return !(sharedAcrossApps && looksGeneric);
    });

    item.screenshotUrls = filtered;
    if (!filtered.length) item.screenshotSource = "";
  }

  timeline.sort((a, b) => {
    const ta = new Date(a.currentVersionReleaseDate || a.capturedAt).getTime();
    const tb = new Date(b.currentVersionReleaseDate || b.capturedAt).getTime();
    return tb - ta;
  });

  fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2));

  console.log("\n=== App version fetch done (with 2+3 fallback) ===");
  console.log("Added:", added.length, added);
  console.log("Skipped:", skipped.length, skipped);
  console.log("Failed:", failed.length, failed);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
