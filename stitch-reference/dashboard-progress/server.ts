import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // Initialize Gemini AI Client on server
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiConfigured: !!apiKey });
  });

  // AI Fitness & Workout Coach endpoint
  app.post("/api/ai-coach", async (req, res) => {
    try {
      const { prompt, userContext } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not set yet
        return res.json({
          reply: `Aura Coach (Demo Mode): You asked about "${prompt}". As a Aura Fit athlete (Weight: ${userContext?.weight || '74.2'}kg, Recovery: ${userContext?.recovery || '85'}%), remember to stay hydrated, maintain strict form on Pull exercises, and hit your 8+ hours of sleep for optimum neural recovery!`
        });
      }

      const systemInstruction = `You are "Aura AI", a world-class elite strength coach and sports scientist for the Aura Fit app (theme: Luminous Dusk).
Your athlete's current stats:
- Current Weight: ${userContext?.weight || 74.2} kg
- Body Fat: ${userContext?.bodyFat || 14.5}%
- Recovery Score: ${userContext?.recovery || 85}%
- Today's Focus: ${userContext?.todayFocus || "Pull Day (Back, Biceps, Core)"}
- Streak: ${userContext?.streak || 12} days

Be concise, motivating, authoritative yet friendly, and give highly actionable fitness, programming, or nutrition guidance. Keep formatting clean with bullet points where applicable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text || "Keep crushing your workouts!" });
    } catch (error: any) {
      console.error("AI Coach Error:", error);
      res.status(500).json({
        error: "Failed to generate response from AI Coach.",
        details: error?.message || "Unknown error"
      });
    }
  });

  // Vite middleware in dev or static files in production
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
