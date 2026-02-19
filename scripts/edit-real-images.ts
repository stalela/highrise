/**
 * edit-real-images.ts
 * ───────────────────────────────────────────────────────
 * Takes the 4 real Highrise Build photos from images/raw/
 * and stylises them with a Wakanda cinematic treatment
 * using DashScope wanx-style-repaint (image-to-image AI).
 *
 * Flow:
 *  1. Upload each raw photo to Supabase storage → get public URL
 *  2. Submit async style-repaint task to DashScope
 *  3. Poll until SUCCEEDED
 *  4. Download result → public/images/real/
 *  5. Clean up Supabase uploads
 *
 * Usage:
 *   npx ts-node --esm scripts/edit-real-images.ts
 *   npx ts-node --esm scripts/edit-real-images.ts --only fleet-1
 *   npx ts-node --esm scripts/edit-real-images.ts --force
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DASHSCOPE_KEY     = process.env.DASHSCOPE_API_KEY!;
const SUPABASE_URL      = process.env.SUPABASE_URL!;
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET            = "highrise-temp";

if (!DASHSCOPE_KEY)  { console.error("❌  DASHSCOPE_API_KEY not set"); process.exit(1); }
if (!SUPABASE_URL)   { console.error("❌  SUPABASE_URL not set"); process.exit(1); }
if (!SUPABASE_KEY)   { console.error("❌  SUPABASE_SERVICE_ROLE_KEY not set"); process.exit(1); }

const RAW_DIR    = path.resolve(__dirname, "../images/raw");
const OUTPUT_DIR = path.resolve(__dirname, "../public/images/real");

/* ─── Wakanda style prompt ──────────────────────────── */
const WAKANDA_STYLE =
  "Cinematic, hyperrealistic photographic style. Dramatic Wakanda-inspired retouching: deep charcoal and obsidian shadows, warm copper-bronze and amber light raking across surfaces, rich contrast, vibrant saturated sky. African modernism aesthetic — bold, premium, futuristic yet grounded. Sharp detail, HDR drama. Retain original composition and subjects exactly.";

/* ─── Image definitions ─────────────────────────────── */
interface EditDef {
  key:            string;
  rawFilename:    string;
  outputFilename: string;
  prompt:         string;
  size:           string;
}

const edits: EditDef[] = [
  {
    key:            "fleet-1",
    rawFilename:    "truck1.jpeg",
    outputFilename: "fleet-1.png",
    size:           "1024*768",
    prompt: `${WAKANDA_STYLE} SUBJECT: Professional construction site — a branded Highrise Build Investments Scania tipper truck being loaded by a Komatsu excavator. Dusty red-soil Zimbabwe terrain. Cinematic copper-gold afternoon light. Premium branded fleet.`,
  },
  {
    key:            "fleet-2",
    rawFilename:    "truck2.jpeg",
    outputFilename: "fleet-2.png",
    size:           "1024*768",
    prompt: `${WAKANDA_STYLE} SUBJECT: Highrise Build Investments branded DAF tipper truck parked on site. Rich charcoal shadows, copper rim light on the body panels, deep blue sky with dramatic clouds. Fleet photography.`,
  },
  {
    key:            "fleet-3",
    rawFilename:    "turck3.jpeg",
    outputFilename: "fleet-3.png",
    size:           "1024*768",
    prompt: `${WAKANDA_STYLE} SUBJECT: Active Zimbabwe construction site — Komatsu excavator and Highrise Build Investments Scania truck working together, loading soil. Dramatic amber-copper sky, rock formations visible. Premium site operations.`,
  },
  {
    key:            "fleet-4",
    rawFilename:    "truck4.jpeg",
    outputFilename: "fleet-4.png",
    size:           "1024*768",
    prompt: `${WAKANDA_STYLE} SUBJECT: Highrise Build Investments Scania truck fully loaded with red Zimbabwe soil on a dirt road. Blue-green grass verge, afternoon clouds. Wakanda-toned colour grade — copper highlights, deep shadow roll-off.`,
  },
];

/* ─── HTTP helpers ──────────────────────────────────── */

function httpRequest(options: https.RequestOptions, body?: Buffer | string): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const mod = options.protocol === "http:" ? http : https;
    const req = (mod as typeof https).request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, data: Buffer.concat(chunks).toString() }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

/* ─── Supabase storage helpers ──────────────────────── */

const supabaseHost = SUPABASE_URL.replace("https://", "");

async function ensureBucket(): Promise<void> {
  // Try GET first
  const check = await httpRequest({
    hostname: supabaseHost,
    path: `/storage/v1/bucket/${BUCKET}`,
    method: "GET",
    headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (check.status === 200) return; // already exists

  // Create public bucket
  const body = JSON.stringify({ id: BUCKET, name: BUCKET, public: true });
  const res = await httpRequest({
    hostname: supabaseHost,
    path: "/storage/v1/bucket",
    method: "POST",
    headers: {
      Authorization:  `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  }, body);
  if (res.status !== 200 && res.status !== 201) {
    const parsed = JSON.parse(res.data);
    // "already exists" is fine
    if (!parsed?.message?.includes("already exists")) {
      throw new Error(`Failed to create bucket: ${res.data}`);
    }
  }
  console.log(`  📦 Supabase bucket "${BUCKET}" ready`);
}

async function uploadToSupabase(localPath: string, remoteName: string): Promise<string> {
  const fileData = fs.readFileSync(localPath);
  const ext      = path.extname(localPath).slice(1).toLowerCase();
  const mime     = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;

  const res = await httpRequest({
    hostname: supabaseHost,
    path: `/storage/v1/object/${BUCKET}/${remoteName}`,
    method: "POST",
    headers: {
      Authorization:   `Bearer ${SUPABASE_KEY}`,
      "Content-Type":  mime,
      "Content-Length": fileData.length,
      "x-upsert":      "true",
    },
  }, fileData);

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Upload failed (HTTP ${res.status}): ${res.data.slice(0, 200)}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${remoteName}`;
}

async function deleteFromSupabase(remoteName: string): Promise<void> {
  const body = JSON.stringify({ prefixes: [`${remoteName}`] });
  await httpRequest({
    hostname: supabaseHost,
    path: `/storage/v1/object/${BUCKET}`,
    method: "DELETE",
    headers: {
      Authorization:   `Bearer ${SUPABASE_KEY}`,
      "Content-Type":  "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  }, body);
}

/* ─── DashScope helpers ──────────────────────────────── */

const DS_HOST = "dashscope-intl.aliyuncs.com";

/**
 * Step 1: Use qwen-vl-max (vision model) to describe the source photo in
 * detail — composition, subjects, vehicles, terrain, sky, lighting etc.
 */
async function describeImage(imageUrl: string): Promise<string> {
  const body = JSON.stringify({
    model: "qwen-vl-max",
    input: {
      messages: [{
        role: "user",
        content: [
          { image: imageUrl },
          { text: "Describe this construction site photo in precise photographic detail: the vehicles present (make, model, colour, branding), their positions and actions, the terrain, sky, lighting conditions, background elements, and overall composition. Be specific and detailed — this description will be used to recreate the scene." },
        ],
      }],
    },
  });

  const res = await httpRequest({
    hostname: DS_HOST,
    path:     "/api/v1/services/aigc/multimodal-generation/generation",
    method:   "POST",
    headers: {
      Authorization:    `Bearer ${DASHSCOPE_KEY}`,
      "Content-Type":   "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  }, body);

  const json = JSON.parse(res.data);
  const content = json?.output?.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    const textItem = content.find((c: any) => c.text);
    if (textItem?.text) return textItem.text as string;
  }
  if (typeof content === "string") return content;

  throw new Error(`VLM description failed: ${JSON.stringify(json).slice(0, 400)}`);
}

/**
 * Step 2: Generate a Wakanda-styled version using qwen-image-max
 * with the photo description + style prompt.
 */
async function generateStyledImage(description: string, stylePrompt: string, size: string): Promise<string> {
  const combinedPrompt = `${stylePrompt}\n\nSCENE TO RECREATE (from original photo): ${description}`;

  const body = JSON.stringify({
    model: "qwen-image-max",
    input: {
      messages: [{
        role: "user",
        content: [{ text: combinedPrompt }],
      }],
    },
    parameters: {
      size,
      prompt_extend: true,
      watermark:     false,
    },
  });

  const res = await httpRequest({
    hostname: DS_HOST,
    path:     "/api/v1/services/aigc/multimodal-generation/generation",
    method:   "POST",
    headers: {
      Authorization:    `Bearer ${DASHSCOPE_KEY}`,
      "Content-Type":   "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  }, body);

  const json = JSON.parse(res.data);

  if (json?.output?.choices) {
    const content = json.output.choices[0]?.message?.content;
    if (Array.isArray(content)) {
      const imgItem = content.find((c: any) => c.image);
      if (imgItem?.image) return imgItem.image as string;
    }
  }

  throw new Error(`Generation failed: ${JSON.stringify(json).slice(0, 400)}`);
}

/* ─── Download helper ───────────────────────────────── */

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

/* ─── Main ──────────────────────────────────────────── */

async function main() {
  const args     = process.argv.slice(2);
  const onlyIdx  = args.indexOf("--only");
  const onlyKey  = onlyIdx !== -1 ? args[onlyIdx + 1] : undefined;
  const forceGen = args.includes("--force");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const targets = onlyKey
    ? edits.filter(e => e.key === onlyKey)
    : edits;

  if (onlyKey && targets.length === 0) {
    console.error(`❌  No edit with key "${onlyKey}"`);
    console.log("Available keys:", edits.map(e => e.key).join(", "));
    process.exit(1);
  }

  // Check all raw files exist
  const missing = targets.filter(e => !fs.existsSync(path.join(RAW_DIR, e.rawFilename)));
  if (missing.length) {
    console.error(`\n❌  Missing raw photos in images/raw/:\n`);
    missing.forEach(e => console.error(`   • ${e.rawFilename}`));
    console.error(`\nSave your 4 photos there first — see images/raw/README.md\n`);
    process.exit(1);
  }

  await ensureBucket();

  console.log(`\n🎨  Editing ${targets.length} real Highrise photo(s) with Wakanda treatment…\n`);

  for (const edit of targets) {
    const dest = path.join(OUTPUT_DIR, edit.outputFilename);

    if (fs.existsSync(dest) && !onlyKey && !forceGen) {
      console.log(`⏭   ${edit.key} — already edited, skipping  (use --force to redo)`);
      continue;
    }

    const rawPath    = path.join(RAW_DIR, edit.rawFilename);
    const remoteName = `hb-edit-${Date.now()}-${edit.key}${path.extname(edit.rawFilename)}`;

    process.stdout.write(`🖼   ${edit.key} — uploading to Supabase`);
    const publicUrl = await uploadToSupabase(rawPath, remoteName);
    process.stdout.write(" ✓  describing with VLM");

    let resultUrl: string;
    try {
      const description = await describeImage(publicUrl);
      process.stdout.write(` ✓  generating Wakanda style`);
      resultUrl = await generateStyledImage(description, edit.prompt, edit.size);
    } finally {
      await deleteFromSupabase(remoteName).catch(() => {});
    }

    process.stdout.write(" ✓  downloading");
    await downloadFile(resultUrl, dest);
    console.log(` ✅  saved → public/images/real/${edit.outputFilename}`);
  }

  console.log("\n✨  Done! Run `npm run dev` to preview.\n");
}

main().catch(err => { console.error("\nFatal:", err.message); process.exit(1); });
