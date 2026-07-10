import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Curvy& Server running on http://localhost:${PORT}`);
  });
}

startServer();
