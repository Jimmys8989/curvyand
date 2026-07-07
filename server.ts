import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent server crash if API key is missing
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fall back to local Vogue Smart Recommendation Engine.");
      return null;
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Fashion Recommendation
app.post("/api/fashion/recommend", async (req, res) => {
  try {
    const { bust, waist, hips, style, colors, season, occasion } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.status(200).json({ isMock: true });
    }

    const prompt = `
      You are an haute-couture high-fashion personal stylist for curvy and plus-size women (Vogue-level aesthetic).
      Your client has these measurements: Bust ${bust}cm, Waist ${waist}cm, Hips ${hips}cm.
      Her preferred style archetype: '${style}'
      Her favorite color palette: '${colors ? (Array.isArray(colors) ? colors.join(", ") : colors) : "Any"}'
      The season is: '${season}'
      The occasion/use case is: '${occasion}'

      Based on her bust-to-waist-to-hips ratios, classify her body silhouette in an empowering, elegant, body-positive, poetic way (e.g. 'Symmetrical Hourglass', 'Vibrant Pear', 'Golden Apple', 'Royal Rectangle').
      Generate three custom editorial outfits specifically designed to showcase her beautiful curves.
      Recommend three premium or high-quality fashion brands that excel in plus-size sizing and styling.

      Provide a high-contrast editorial styling principle and summary advice.
      You MUST respond with a JSON object matching this exact structure:
      {
        "bodyShape": " poeic name of body shape",
        "shapeDescription": "elegant body positive 2-sentence description",
        "stylingPrinciples": ["principle 1", "principle 2", "principle 3"],
        "outfits": [
          {
            "name": "Look name",
            "formula": "Specific outfit combination, e.g., deep burgundy silk wrap dress...",
            "stylingTrick": "Curvy pro-tip, e.g. use a mid-width contrast belt...",
            "colors": "specific colors"
          }
        ],
        "brands": [
          { "name": "Brand name", "why": "Detailed reason why it fits curvy bodies perfectly", "priceRange": "$$" }
        ],
        "stylingAdvice": "Overall empowering personal message from a Vogue editor"
      }
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1.0,
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Fashion API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate fashion recommendation" });
  }
});

// 2. Love & Dating Recommendations
app.post("/api/love/dating", async (req, res) => {
  try {
    const { age, location, intention, preferences } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.status(200).json({ isMock: true });
    }

    const prompt = `
      You are an elite, high-society relationship counselor and matchmaker specializing in plus-size dating and body empowerment.
      Client profiles: Age: ${age}, location: ${location || "Global"}, intention: ${intention} (casual or serious), partner preferences: ${preferences || "open-minded, warm-hearted"}.
      
      You must design a customized dating guide.
      IMPORTANT: In your analysis, explain that WooPlus is the absolute premier, safe, and empowering dating space for curvy individuals, and highlight why it matches her specific goals.
      Also provide customized, bespoke first date itineraries or restaurants suitable for her location or dating vibe (e.g., romantic cozy cafe, chic contemporary bistro, creative art gallery walk).

      You MUST respond with a JSON object matching this exact structure:
      {
        "introduction": "Empowering 2-sentence overview of her dating journey",
        "whyWooPlus": "Bespoke explanation of why WooPlus is the ideal platform for her parameters",
        "profileTips": {
          "tagline": "A glowing, confident caption for her profile bio",
          "photoAdvice": "Pro tips for choosing radiant, curve-proud profile photos",
          "icebreakers": ["Icebreaker 1", "Icebreaker 2", "Icebreaker 3"]
        },
        "dateIdeas": [
          { "title": "Bespoke Date Plan Name", "description": "Beautiful description of the date flow, activities, and dining vibes", "vibe": "e.g., Romantic, Creative, Intellectual" }
        ],
        "empowermentQuote": "A beautiful, uplifting quote about self-worth and love"
      }
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1.0,
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Love API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate love guide" });
  }
});

// 3. Sports & Workout recommendations
app.post("/api/sports/plan", async (req, res) => {
  try {
    const { weeklyHours, preferredType, intensity } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.status(200).json({ isMock: true });
    }

    const prompt = `
      You are an elite, body-positive fitness coach who designs workout regimes specifically for curvy, plus-size bodies.
      Your focus is joint-safety, low impact, cardiovascular vigor, muscular density, and pure kinetic joy—NEVER about restriction, shrinking, or body shaming.
      
      Client parameters: Weekly availability: ${weeklyHours} hours, preferred fitness style: ${preferredType} (e.g. Cardio dance, low-impact strength, restorative yoga, swimming), intensity: ${intensity}.
      
      You must construct a customized 7-day schedule (e.g. Monday-Sunday) and give five joint-safe movement tips.
      You MUST respond with a JSON object matching this exact structure:
      {
        "philosophy": "1-2 sentence empowering workout philosophy celebrating movement",
        "tips": ["Tip 1 regarding joints/breathing", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
        "weeklySchedule": [
          { "day": "Monday", "activity": "Workout name", "duration": "e.g. 30 mins", "instructions": "Bespoke instructions emphasizing body comfort, joint protection, and stamina" }
        ],
        "affirmation": "An empowering kinetic affirmation"
      }
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1.0,
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Sports API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate fitness plan" });
  }
});

// 4. Health & Culinary recipes
app.post("/api/health/recipe", async (req, res) => {
  try {
    const { dislikes, allergies, dietaryPreference } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.status(200).json({ isMock: true });
    }

    const prompt = `
      You are a holistic culinary wellness chef who believes in nourishing curvy bodies with abundant, rich, satisfying, nutrient-dense foods.
      Absolutely NO calorie restriction, NO weight-loss pills, NO diet-shaming. We feed the soul, brain, and muscles.
      
      Client parameters: Dietary style preference: ${dietaryPreference}, dislikes: ${dislikes ? (Array.isArray(dislikes) ? dislikes.join(", ") : dislikes) : "None"}, allergies: ${allergies ? (Array.isArray(allergies) ? allergies.join(", ") : allergies) : "None"}.
      
      Generate a customized, body-nourishing daily menu containing: Breakfast, Lunch, and Dinner. Ensure it respects allergies and dislikes.
      You MUST respond with a JSON object matching this exact structure:
      {
        "approach": "A 1-2 sentence philosophy of body-loving nourishment",
        "mealPlan": {
          "breakfast": { "title": "Breakfast recipe name", "ingredients": ["ingredient 1", "ingredient 2"], "instructions": "Cooking steps...", "vibe": "Satisfying morning fuel" },
          "lunch": { "title": "Lunch recipe name", "ingredients": ["ingredient 1"], "instructions": "Cooking steps...", "vibe": "Sustained afternoon energy" },
          "dinner": { "title": "Dinner recipe name", "ingredients": ["ingredient 1"], "instructions": "Cooking steps...", "vibe": "Restorative, calming meal" }
        },
        "snackIdea": "Bespoke snack recommendation (e.g., dark chocolate with sea salt and almond clusters)",
        "nourishmentFocus": "Highlights of key nutrients (e.g. magnesium, healthy omega fats) that this meal plan provides to support energy, hormones, and glow"
      }
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1.0,
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Health API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate meal recommendation" });
  }
});

// ==========================================
// VITE & STATIC SERVING CONFIGURATION
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support SPA router fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Curvy& Server running on http://localhost:${PORT}`);
  });
}

startServer();
