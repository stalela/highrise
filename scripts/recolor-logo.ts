/**
 * recolor-logo.ts
 * ───────────────
 * Uses the two-step VLM pipeline to recolor the Highrise logo
 * from navy/blue to the copper/Wakanda brand palette.
 *
 * Usage:
 *   npx ts-node --esm scripts/recolor-logo.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const API_KEY   = process.env.DASHSCOPE_API_KEY!;
const SUPA_URL  = process.env.SUPABASE_URL!;
const SUPA_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET    = "highrise-temp";

const supabase  = createClient(SUPA_URL, SUPA_KEY);

const LOGO_SRC  = path.resolve(__dirname, "../public/logo-1.jpeg");
const LOGO_DEST = path.resolve(__dirname, "../public/logo-copper.png");

/* ── Supabase helpers ─────────────────────────────────── */
async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) await supabase.storage.createBucket(BUCKET, { public: true });
}

async function uploadToSupabase(localPath: string, remoteName: string): Promise<string> {
  const bytes = fs.readFileSync(localPath);
  const mime  = localPath.endsWith(".png") ? "image/png" : "image/jpeg";
  await supabase.storage.from(BUCKET).upload(remoteName, bytes, { contentType: mime, upsert: true });
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(remoteName);
  return data.publicUrl;
}

async function deleteFromSupabase(remoteName: string) {
  await supabase.storage.from(BUCKET).remove([remoteName]);
}

/* ── DashScope helpers ────────────────────────────────── */
function dashRequest(body: unknown): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req  = https.request({
      hostname: "dashscope-intl.aliyuncs.com",
      path:     "/api/v1/services/aigc/multimodal-generation/generation",
      method:   "POST",
      headers:  {
        Authorization:   `Bearer ${API_KEY}`,
        "Content-Type":  "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function describeImage(imageUrl: string): Promise<string> {
  const res = await dashRequest({
    model: "qwen-vl-max",
    input: {
      messages: [{
        role: "user",
        content: [
          { image: imageUrl },
          { text: "Describe this logo in precise detail: the exact shapes, symbols, text, layout, composition, and structure. Focus on what is present visually — do not interpret colors." },
        ],
      }],
    },
  });
  const content = res.output?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    const t = content.find((c: any) => c.text);
    if (t?.text) return t.text;
  }
  throw new Error(`VLM failed: ${JSON.stringify(res).slice(0, 300)}`);
}

async function generateCopperLogo(description: string): Promise<string> {
  const prompt =
    `Professional corporate logo design. Recreate this logo with exactly the same composition, shapes, symbols, text, and layout: "${description}". ` +
    `Apply a premium copper-bronze and deep charcoal color palette: primary color warm copper #c07840, lighter copper highlights #e0a060, deep charcoal/obsidian dark background #06060a, dark stone surfaces #181823. ` +
    `The result should feel premium, bold, and grounded — like a high-end African construction or property development brand. ` +
    `Clean vector-style logo on a dark background. No watermarks.`;

  const res = await dashRequest({
    model: "qwen-image-max",
    input: {
      messages: [{ role: "user", content: [{ text: prompt }] }],
    },
    parameters: { size: "1024*1024", watermark: false, prompt_extend: false },
  });
  const content = res.output?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    const img = content.find((c: any) => c.image);
    if (img?.image) return img.image;
  }
  throw new Error(`Generation failed: ${JSON.stringify(res).slice(0, 300)}`);
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get  = (u: string) => {
      https.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) { get(res.headers.location!); return; }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      }).on("error", err => { fs.unlink(dest, () => {}); reject(err); });
    };
    get(url);
  });
}

/* ── Main ─────────────────────────────────────────────── */
async function main() {
  console.log("\n🎨  Recoloring Highrise logo to copper/Wakanda palette…\n");

  await ensureBucket();

  const remoteName = `logo-src-${Date.now()}.jpeg`;
  process.stdout.write("📤  Uploading logo to temp storage… ");
  const publicUrl = await uploadToSupabase(LOGO_SRC, remoteName);
  console.log("✓");

  try {
    process.stdout.write("👁   Describing logo with VLM… ");
    const description = await describeImage(publicUrl);
    console.log("✓");
    console.log(`\n    "${description.slice(0, 120)}…"\n`);

    process.stdout.write("🔥  Generating copper version… ");
    const imageUrl = await generateCopperLogo(description);
    console.log("✓");

    process.stdout.write("💾  Downloading… ");
    await downloadFile(imageUrl, LOGO_DEST);
    console.log(`✅  saved → public/logo-copper.png`);
  } finally {
    await deleteFromSupabase(remoteName);
  }

  console.log("\n✨  Done! Update index.html to use /logo-copper.png\n");
}

main().catch(err => { console.error("Fatal:", err.message); process.exit(1); });
