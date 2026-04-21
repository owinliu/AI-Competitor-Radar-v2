import { chromium } from "playwright";

const urls = [
  "https://m.app.mi.com/?word=%E5%AE%89%E9%80%B8%E8%8A%B1#page=detail&id=329292",
  "https://m.app.mi.com/?word=%E5%B0%8F%E8%B5%A2#page=detail&id=432142",
];

function pickInteresting(obj, out = []) {
  if (!obj) return out;
  if (typeof obj === "string") {
    if (/https?:\/\/.+\.(png|jpg|jpeg|webp)/i.test(obj)) out.push({ type: "image", value: obj });
    return out;
  }
  if (Array.isArray(obj)) {
    for (const x of obj) pickInteresting(x, out);
    return out;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (/version|ver|update|release|screenshot|screen|intro|desc|content|note/i.test(k)) {
        out.push({ type: "field", key: k, value: typeof v === "string" ? v.slice(0, 200) : Array.isArray(v) ? `array(${v.length})` : typeof v });
      }
      pickInteresting(v, out);
    }
  }
  return out;
}

async function runOne(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1" });

  const hits = [];
  page.on("response", async (resp) => {
    try {
      const u = resp.url();
      const ct = resp.headers()["content-type"] || "";
      if (!/json|javascript|text\/plain|html/i.test(ct) && !/api|detail|app|mi\.com/i.test(u)) return;
      if (resp.status() >= 400) return;

      let payload = null;
      if (/json/i.test(ct) || /\/api\//i.test(u)) {
        payload = await resp.json().catch(() => null);
      }
      if (!payload) return;

      const info = pickInteresting(payload, []).slice(0, 50);
      const images = info.filter((x) => x.type === "image").map((x) => x.value);
      const fields = info.filter((x) => x.type === "field").slice(0, 20);
      if (images.length || fields.length) {
        hits.push({ url: u, status: resp.status(), images: [...new Set(images)].slice(0, 20), fields });
      }
    } catch {}
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(10000);

  const domImgs = await page.$$eval("img", (nodes) => nodes.map((n) => n.getAttribute("src") || n.getAttribute("data-src") || "").filter(Boolean));

  await browser.close();
  return { url, hits, domImgs: [...new Set(domImgs)] };
}

(async () => {
  const out = [];
  for (const u of urls) out.push(await runOne(u));
  console.log(JSON.stringify(out, null, 2));
})();
