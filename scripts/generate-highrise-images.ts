/**
 * generate-highrise-images.ts
 * ────────────────────────────
 * Generates AI images for the Highrise Build Investments website.
 * Uses DashScope qwen-image-max.
 *
 * Usage:
 *   npx ts-node scripts/generate-highrise-images.ts
 *   npx ts-node scripts/generate-highrise-images.ts --only hero-bg
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const API_KEY = process.env.DASHSCOPE_API_KEY;
if (!API_KEY) {
  console.error("❌  DASHSCOPE_API_KEY not set in .env.local");
  process.exit(1);
}

const BASE_URL = "https://dashscope-intl.aliyuncs.com";
const MODEL    = "qwen-image-max";
const OUTPUT_DIR = path.resolve(__dirname, "../public/images");

const NEGATIVE_PROMPT =
  "low quality, blurry, distorted, cartoonish, oversaturated, flat illustration, stock photo watermark, people looking at camera awkwardly, construction hard hat logos, western skyline, European architecture, low resolution.";

/**
 * Brand prefix applied to every prompt.
 * Enforces the Highrise brand aesthetic (derived from logo palette):
 *  - Deep navy-indigo backgrounds (#080c1e → #2d3191)
 *  - Vibrant sky-blue accents (#05adee, #6ecfef)
 *  - Zimbabwe granite / Chiremba balancing rocks visual vocabulary
 *  - Futuristic but grounded in African identity
 */
const BRAND =
  "Cinematic, hyperrealistic architectural photography. Zimbabwe landscape inspiration: ancient weathered granite boulders reminiscent of the Chiremba balancing rocks of Epworth and the stone walls of Great Zimbabwe. Deep navy-indigo backgrounds with vibrant sky-blue and electric-blue accents. Futuristic premium African construction aesthetic — bold, confident, modern. Sharp focus, dramatic blue-hour lighting, high dynamic range.";

interface ImageDef {
  key: string;
  filename: string;
  prompt: string;
  size: string;
}

const images: ImageDef[] = [
  // ── Hero ──
  {
    key:      "hero-bg",
    filename: "hero-bg.png",
    prompt:   `${BRAND} HERO BACKGROUND: Aerial blue-hour view of a futuristic premium residential estate being constructed on rocky granite terrain in Zimbabwe. Cranes silhouetted against a deep indigo-navy sky. Cool electric-blue and sky-blue construction lights reflecting off dark granite rock formations in the foreground. Wide cinematic composition. Deep navy shadows, sky-blue silver highlights.`,
    size:     "1664*928",
  },

  // ── About ──
  {
    key:      "about-image",
    filename: "about-image.png",
    prompt:   `${BRAND} ABOUT IMAGE: Two Black African construction professionals in smart safety attire reviewing large architectural blueprints on a sturdy stone table outdoors. Background: dramatic Zimbabwean granite boulders similar to Epworth. Cool azure afternoon light with sky-blue reflections. Confident, expert body language. Square composition.`,
    size:     "928*928",
  },

  // ── Services ──
  {
    key:      "service-construction",
    filename: "service-construction.png",
    prompt:   `${BRAND} SERVICE: Dramatic wide shot of an active premium residential construction site in Zimbabwe. Steel reinforcement, concrete forms, wooden formwork, workers in hard hats. Rocky terrain visible. Cool electric-blue dusk lighting. Strong deep-navy shadows.`,
    size:     "928*928",
  },
  {
    key:      "service-property",
    filename: "service-property.png",
    prompt:   `${BRAND} SERVICE: Completed modern African luxury residential property — two-storey home with stone-cladded walls, blue-tinted glass, lush garden. Epworth-style granite feature wall. Deep blue-hour dusk lighting with sky-blue reflections.`,
    size:     "928*928",
  },
  {
    key:      "service-renovation",
    filename: "service-renovation.png",
    prompt:   `${BRAND} SERVICE: Interior renovation in progress — exposed granite stone feature wall being polished, premium tiles being laid, African hardwood ceiling installation. Cool sky-blue and silver pendant lights. Sleek modern Zimbabwean interior with deep navy accent walls.`,
    size:     "928*928",
  },
  {
    key:      "service-consultancy",
    filename: "service-consultancy.png",
    prompt:   `${BRAND} SERVICE: Black African architect and client reviewing 3D building model at a sleek navy desk. Digital screens glowing electric-blue with architectural plans. Cool sky-blue office lighting. Professional, futuristic office environment with deep indigo accents.`,
    size:     "928*928",
  },
  {
    key:      "service-investments",
    filename: "service-investments.png",
    prompt:   `${BRAND} SERVICE: Premium property investment concept — scale architectural model of a residential development surrounded by financial documents, property title deeds, and a tablet showing value metrics. Sky-blue accent lighting on a deep navy desk.`,
    size:     "928*928",
  },
  {
    key:      "service-equipment",
    filename: "service-equipment.png",
    prompt:   `${BRAND} SERVICE: Premium construction equipment and materials — cement bags, steel rebar bundles, granite aggregate, power tools, surveying instruments arranged on site. Dramatic side lighting casting long deep-navy shadows with sky-blue edge lighting.`,
    size:     "928*928",
  },

  // ── Projects ──
  {
    key:      "project-1",
    filename: "project-1.png",
    prompt:   `${BRAND} COMPLETED PROJECT: Handsome modern African residential estate — six homes with stone-cladded walls, deep navy-blue roofing, mature landscaping. Zimbabwe hills in background. Clear blue-sky photography with crisp electric-blue shadows.`,
    size:     "1024*768",
  },
  {
    key:      "project-2",
    filename: "project-2.png",
    prompt:   `${BRAND} COMPLETED PROJECT: Three-storey commercial office building in Harare — dark granite exterior cladding, floor-to-ceiling glass, sky-blue-finished entrance canopy. Dramatic deep-blue dusk photography with interior lights glowing electric-blue.`,
    size:     "1024*768",
  },
  {
    key:      "project-3",
    filename: "project-3.png",
    prompt:   `${BRAND} COMPLETED RENOVATION: Magazine-worthy interior of a renovated Harare home — exposed granite stone accent wall, African hardwood floors, sky-blue and chrome pendant lights over an island kitchen. Deep navy accent wall. Open plan, airy, premium materials.`,
    size:     "1024*768",
  },
  {
    key:      "project-4",
    filename: "project-4.png",
    prompt:   `${BRAND} ACTIVE PROJECT SITE: Drone aerial shot of a large active construction site — concrete slab poured, walls going up, formwork visible, workers and vehicles. Set among Zimbabwean granite landscape. Deep blue twilight with electric-blue site lighting.`,
    size:     "1024*768",
  },
];

/* ─── API helpers ─────────────────────────────────────── */

function request(method: string, urlPath: string, body?: unknown): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const options: https.RequestOptions = {
      hostname: BASE_URL.replace("https://", ""),
      path:     urlPath,
      method,
      headers: {
        Authorization:  `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString();
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error(`Non-JSON (HTTP ${res.statusCode}): ${raw.slice(0, 500)}`)); }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

const MAX_RETRIES = 5;
const BACKOFF_MS  = 15_000;

async function generateImage(prompt: string, size: string): Promise<string> {
  const body = {
    model: MODEL,
    input: {
      messages: [{ role: "user", content: [{ text: prompt }] }],
    },
    parameters: {
      size,
      negative_prompt: NEGATIVE_PROMPT,
      prompt_extend:   true,
      watermark:       false,
    },
  };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await request(
      "POST",
      "/api/v1/services/aigc/multimodal-generation/generation",
      body
    );

    if (res.code === "Throttling.RateQuota") {
      if (attempt === MAX_RETRIES) throw new Error(`Rate limited after ${MAX_RETRIES} retries`);
      const waitMs = BACKOFF_MS * Math.pow(2, attempt);
      process.stdout.write(` ⏳ rate-limited, waiting ${Math.round(waitMs / 1000)}s…`);
      await sleep(waitMs);
      continue;
    }

    if (res.output?.choices) {
      const content = res.output.choices[0]?.message?.content;
      if (Array.isArray(content)) {
        const imgItem = content.find((c: any) => c.image);
        if (imgItem?.image) return imgItem.image;
      }
    }

    throw new Error(`Unexpected response: ${JSON.stringify(res).slice(0, 500)}`);
  }

  throw new Error("Max retries exceeded");
}

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get  = (u: string) => {
      https.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location!);
          return;
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      }).on("error", (err) => { fs.unlink(dest, () => {}); reject(err); });
    };
    get(url);
  });
}

async function main() {
  const args     = process.argv.slice(2);
  const onlyIdx  = args.indexOf("--only");
  const onlyKey  = onlyIdx !== -1 ? args[onlyIdx + 1] : undefined;
  const forceGen = args.includes("--force");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const targets = onlyKey
    ? images.filter(img => img.key === onlyKey)
    : images;

  if (onlyKey && targets.length === 0) {
    console.error(`❌  No image with key "${onlyKey}"`);
    console.log("Available keys:", images.map(i => i.key).join(", "));
    process.exit(1);
  }

  console.log(`\n🏗️   Generating ${targets.length} Highrise image(s)…\n`);

  for (const img of targets) {
    const dest = path.join(OUTPUT_DIR, img.filename);

    if (fs.existsSync(dest) && !onlyKey && !forceGen) {
      console.log(`⏭  ${img.key} — exists, skipping`);
      continue;
    }

    process.stdout.write(`📸  ${img.key} (${img.size}) — generating`);

    try {
      const imageUrl = await generateImage(img.prompt, img.size);
      process.stdout.write(" … downloading");
      await downloadFile(imageUrl, dest);
      console.log(` ✅  saved → images/${img.filename}`);
    } catch (err: any) {
      console.log(` ❌  ${err.message}`);
    }

    // Polite delay between requests
    if (targets.indexOf(img) < targets.length - 1) {
      await sleep(8_000);
    }
  }

  console.log("\n✨  Done!\n");
}

main().catch(err => { console.error("Fatal:", err.message); process.exit(1); });
