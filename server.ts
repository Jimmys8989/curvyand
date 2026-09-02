import express from "express";
import path from "path";
import { existsSync, promises as fs } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const execFileAsync = promisify(execFile);
const editorialRoot = path.join(process.cwd(), ".editorial");
const editorialDraftsPath = path.join(editorialRoot, "drafts");
const editorialPostsPath = path.join(process.cwd(), "src", "editorialPosts.ts");

app.use(express.json());

type EditorialPost = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  author: string;
  publishedAt: string;
  publishedAtIso: string;
  readTime: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  researchNote?: string;
  researchLabel?: string;
  researchSources: Array<{ label: string; url: string }>;
};

function assertLocalEditorialAccess(req: express.Request, res: express.Response) {
  if (process.env.NODE_ENV === "production") {
    res.status(404).json({ error: "Not found" });
    return false;
  }
  const address = req.socket.remoteAddress || "";
  if (!address.includes("127.0.0.1") && address !== "::1") {
    res.status(403).json({ error: "The editorial dashboard is available only on this computer." });
    return false;
  }
  return true;
}

function validateEditorialPost(value: unknown): asserts value is EditorialPost {
  const post = value as Partial<EditorialPost>;
  if (!post || typeof post !== "object") throw new Error("Draft is not a valid article object.");
  if (!post.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) throw new Error("Draft has an invalid slug.");
  for (const key of ["title", "eyebrow", "summary", "author", "publishedAt", "publishedAtIso", "readTime"] as const) {
    if (typeof post[key] !== "string" || !post[key]) throw new Error(`Draft is missing ${key}.`);
  }
  if (!Array.isArray(post.sections) || post.sections.length < 3) throw new Error("Draft must contain at least three sections.");
  if (!Array.isArray(post.researchSources) || post.researchSources.length < 2) throw new Error("Draft must contain at least two research sources.");
  for (const source of post.researchSources) {
    if (!source.label || !/^https:\/\//.test(source.url)) throw new Error("Every research source needs a label and direct HTTPS URL.");
  }
}

async function getEditorialDrafts() {
  await fs.mkdir(editorialDraftsPath, { recursive: true });
  const files = (await fs.readdir(editorialDraftsPath)).filter((file) => file.endsWith(".json"));
  const drafts = await Promise.all(files.map(async (file) => {
    const draft = JSON.parse(await fs.readFile(path.join(editorialDraftsPath, file), "utf8"));
    validateEditorialPost(draft);
    return draft;
  }));
  return drafts.sort((a, b) => b.publishedAtIso.localeCompare(a.publishedAtIso));
}

async function readApprovedEditorialPosts(): Promise<EditorialPost[]> {
  const source = await fs.readFile(editorialPostsPath, "utf8");
  const match = source.match(/EDITORIAL_POSTS: BlogPost\[\] = ([\s\S]*);\s*$/);
  if (!match) throw new Error("Could not read the approved article store.");
  return JSON.parse(match[1]);
}

async function writeApprovedEditorialPosts(posts: EditorialPost[]) {
  const source = `import type { BlogPost } from "./blog";\n\n// Approved posts from the local Editorial Review dashboard are added here.\nexport const EDITORIAL_POSTS: BlogPost[] = ${JSON.stringify(posts, null, 2)};\n`;
  await fs.writeFile(editorialPostsPath, source, "utf8");
}

app.get("/editorial-review", async (req, res) => {
  if (!assertLocalEditorialAccess(req, res)) return;
  res.sendFile(path.join(process.cwd(), "editorial-dashboard.html"));
});

app.get("/api/editorial/drafts", async (req, res) => {
  if (!assertLocalEditorialAccess(req, res)) return;
  try {
    res.json({ drafts: await getEditorialDrafts() });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Unable to read editorial drafts." });
  }
});

app.post("/api/editorial/drafts/:slug/reject", async (req, res) => {
  if (!assertLocalEditorialAccess(req, res)) return;
  try {
    const slug = req.params.slug;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid draft name.");
    await fs.unlink(path.join(editorialDraftsPath, `${slug}.json`));
    res.json({ message: "Draft rejected and removed." });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Unable to reject draft." });
  }
});

let publishing = false;
app.post("/api/editorial/drafts/:slug/publish", async (req, res) => {
  if (!assertLocalEditorialAccess(req, res)) return;
  if (publishing) return res.status(409).json({ error: "Another article is currently being published." });
  publishing = true;
  try {
    const slug = req.params.slug;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid draft name.");
    const draftPath = path.join(editorialDraftsPath, `${slug}.json`);
    const post = JSON.parse(await fs.readFile(draftPath, "utf8"));
    validateEditorialPost(post);
    const approved = await readApprovedEditorialPosts();
    if (approved.some((item) => item.slug === post.slug)) throw new Error("An approved article already uses this slug.");

    await writeApprovedEditorialPosts([post, ...approved]);
    await fs.unlink(draftPath);
    await execFileAsync("npm", ["run", "lint"], { cwd: process.cwd() });
    await execFileAsync("npm", ["run", "build"], { cwd: process.cwd() });
    await execFileAsync("git", ["add", "-A", "--", "src/editorialPosts.ts", ".editorial/drafts"], { cwd: process.cwd() });
    await execFileAsync("git", ["commit", "-m", `Publish editorial: ${post.title}`], { cwd: process.cwd() });
    await execFileAsync("git", ["push", "origin", "main"], { cwd: process.cwd(), timeout: 120_000 });
    res.json({ message: `Published “${post.title}” and pushed it to GitHub.` });
  } catch (error: any) {
    res.status(500).json({ error: `${error.message || "Publishing failed"}. Your local files have been preserved for recovery.` });
  } finally {
    publishing = false;
  }
});

// Lazy-loaded Gemini AI client helper
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. AI Fit & Styling Advisor Endpoint
app.post("/api/stylist", async (req, res) => {
  try {
    const { bust, waist, hips, height, unit, aesthetic, targetBrand, targetSize, currentBrand, currentSize } = req.body;

    const ai = getAi();
    
    // Construct rich fashion system instructions for the model
    const prompt = `You are the chief personal stylist for "Curvy&", an editorial-grade, body-positive fashion agency for the plus-size community. Your goal is to provide supportive, body-celebrating, precise fitting and styling recommendations for a client with the following details:
    
    Measurements:
    - Bust: ${bust || "N/A"} ${unit || "inches"}
    - Waist: ${waist || "N/A"} ${unit || "inches"}
    - Hips: ${hips || "N/A"} ${unit || "inches"}
    - Height: ${height || "N/A"} cm/in
    
    Fitting Context:
    - Target Brand: ${targetBrand || "Torrid"}
    - Target Size context: ${targetSize || "Not specified"}
    ${currentBrand ? `- Current Reference Brand: ${currentBrand} (Size: ${currentSize})` : ""}
    - Preferred Aesthetic style vibe: "${aesthetic || "Chic Elegant"}"

    Please analyze their measurements, compare them to general plus-size brand profiles, and generate:
    1. A warm, body-positive assessment validating their proportions.
    2. A precise fitting advice for ${targetBrand} based on their measurements (explaining whether ${targetBrand} typically runs generous, has stretch, or has specific cut behaviors like high-rise waist or bust-roomy tops).
    3. Suggest an iconic look from the "${aesthetic}" aesthetic tailored for their curvy body shape. Specify cuts, fabric recommendations (e.g., heavy knits, ribbing, power-stretch denim, soft viscose draping), and styling secrets (like where a belt should sit, or necklines that balance proportions).
    4. Provide 3 direct, practical styling tips to guarantee a perfect fit when ordering online.

    Keep your tone luxurious, empowering, professional, and chic (like a premium fashion magazine editor, e.g. Vogue or Harper's Bazaar). Do NOT mention any technical constraints, JSON, or software engineering. Use elegant Markdown headers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text || "I was unable to generate styling recommendations. Please try again.";
    res.json({ advice: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to communicate with AI Stylist. Ensure GEMINI_API_KEY is configured." 
    });
  }
});

// Start server with Vite middleware support
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // Serve generated extensionless SEO pages before Express sees nested folders.
    app.get("*", (req, res, next) => {
      if (req.path === "/" || path.extname(req.path)) {
        next();
        return;
      }

      const candidate = path.resolve(distPath, `${req.path.replace(/^\/+/, "")}.html`);
      if (candidate.startsWith(`${distPath}${path.sep}`) && existsSync(candidate)) {
        res.sendFile(candidate);
        return;
      }
      next();
    });

    app.use(express.static(distPath, { extensions: ["html"] }));
    app.get("*", (req, res) => {
      if (/^\/size-converter\/[a-z0-9-]+to[a-z0-9-]+$/.test(req.path)) {
        res.sendFile(path.join(distPath, "_converter-fallback.html"));
        return;
      }
      res.status(404).sendFile(path.join(distPath, "404.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Curvy& Server running on http://localhost:${PORT}`);
  });
}

startServer();
