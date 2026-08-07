import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Performance Coach Endpoint
  app.post('/api/ai/coach', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.json({
          advice: "Great progress this week! Volume load is up by 12% with optimal recovery metrics. Keep your rest periods at 90s for compound lifts to maintain high output.",
          readinessScore: 88,
          recommendation: "Push Day: Heavy Upper Body focus today with 85% 1RM on Bench Press."
        });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const { userMetrics, question } = req.body;

      const prompt = `You are Aura Fit's Elite Pro AI Strength & Conditioning Coach.
User Metrics:
- Volume Load: ${userMetrics?.volume || '24,500'} kg
- Recent PR: ${userMetrics?.pr || 'Deadlift 185 kg'}
- Avg Heart Rate: ${userMetrics?.avgHr || '142'} bpm
- Active Time: ${userMetrics?.activeTime || '6h 42m'}
- Energy Burned: ${userMetrics?.energy || '3,200'} kcal
- Daily Streak: ${userMetrics?.streak || 12} days

User Question / Context: ${question || 'Analyze my performance this week and recommend today\'s target focus.'}

Provide a concise, highly energetic, science-based performance analysis and recommendations. Return JSON in this exact format:
{
  "advice": "1-2 punchy sentences summarizing volume, fatigue, and recovery",
  "readinessScore": 85,
  "recommendation": "Specific workout or focus area for today",
  "keyTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        res.json(parsed);
      } catch {
        res.json({
          advice: text || "Volume is trending upwards with consistent heart rate zones. Excellent recovery alignment.",
          readinessScore: 90,
          recommendation: "Focus on Explosive Power & Speed Sets today.",
          keyTips: ["Hydrate with electrolytes", "Maintain 2-minute rest between heavy sets"]
        });
      }
    } catch (err: any) {
      console.error('Error in AI coach endpoint:', err);
      res.json({
        advice: "Your recovery metrics are solid. Volume progression is right on target for a new PR cycle.",
        readinessScore: 86,
        recommendation: "Optimal readiness for Hypertrophy Lower Body session.",
        keyTips: ["Keep sets in 8-10 rep range", "Focus on controlled eccentric motion"]
      });
    }
  });

  // AI Custom Workout Plan Generator Endpoint
  app.post('/api/ai/generate-workout', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { goal, equipment, targetMuscles, durationMinutes } = req.body;

      if (!apiKey) {
        res.json({
          title: `${goal || 'Hypertrophy'} Custom Session`,
          duration: `${durationMinutes || 45} mins`,
          focus: targetMuscles || "Chest, Shoulders & Triceps",
          exercises: [
            { name: "Barbell Bench Press", sets: 4, reps: "8-10", rpe: 8, rest: "90s", targetKg: 100 },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rpe: 8, rest: "60s", targetKg: 32 },
            { name: "Weighted Dips", sets: 3, reps: "10-12", rpe: 9, rest: "60s", targetKg: 20 },
            { name: "Cable Lateral Raises", sets: 4, reps: "12-15", rpe: 8, rest: "45s", targetKg: 14 },
            { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", rpe: 8, rest: "45s", targetKg: 35 }
          ]
        });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Generate a high-intensity customized workout routine for Aura Fit.
Parameters:
- Primary Goal: ${goal || 'Strength & Muscle Building'}
- Equipment Available: ${equipment || 'Full Commercial Gym'}
- Target Muscle Groups: ${targetMuscles || 'Chest & Triceps'}
- Target Duration: ${durationMinutes || 45} minutes

Return pure JSON with format:
{
  "title": "Aura Hypertrophy Alpha",
  "duration": "45 mins",
  "focus": "Chest & Triceps",
  "exercises": [
    { "name": "Exercise name", "sets": 4, "reps": "8-10", "rpe": 8, "rest": "90s", "targetKg": 80 }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err) {
      console.error('Error generating workout:', err);
      res.json({
        title: "Aura Power Session",
        duration: "50 mins",
        focus: "Full Body Compound",
        exercises: [
          { name: "Barbell Deadlift", sets: 4, reps: "5", rpe: 9, rest: "120s", targetKg: 185 },
          { name: "Overhead Press", sets: 4, reps: "6-8", rpe: 8, rest: "90s", targetKg: 65 },
          { name: "Pull-ups (Weighted)", sets: 3, reps: "8-10", rpe: 8, rest: "90s", targetKg: 15 },
          { name: "Goblet Squats", sets: 3, reps: "12", rpe: 8, rest: "60s", targetKg: 40 }
        ]
      });
    }
  });

  // Serve Vite in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Fit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
