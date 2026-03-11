import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

console.log("GEMINI KEY FOUND:", !!process.env.GEMINI_API_KEY);

app.post('/api/generate-plan', async (req, res) => {
    const { goal, experience, equipment, duration, limitations } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        console.error("Gemini API Key missing");
        return res.status(500).json({
            error: "Gemini API Key missing on server. Please add GEMINI_API_KEY to .env file."
        });
    }

    const prompt = `You are a professional fitness trainer. Create a personalized weekly workout plan based on the following details:

- Goal: ${goal}
- Experience Level: ${experience}
- Equipment Available: ${equipment}
- Workout Duration: ${duration} minutes
- Limitations/Injuries: ${limitations}

You MUST respond with ONLY valid JSON, no markdown, no backticks, no explanation. Use this exact structure:

{
  "title": "Plan title based on the user's goal",
  "summary": "A 1-2 sentence overview of the plan approach",
  "days": [
    {
      "day": "Day 1",
      "label": "Monday",
      "focus": "e.g. Upper Body, Legs, Full Body, Rest",
      "isRest": false,
      "warmup": [
        "Exercise name - duration or reps"
      ],
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": "10-12",
          "notes": "Optional short tip or note"
        }
      ],
      "cooldown": [
        "Stretch name - duration"
      ]
    }
  ],
  "motivation": "A short motivational message to encourage the user"
}

Requirements:
1. Provide a 7-day plan (or appropriate frequency based on experience). Include rest days with "isRest": true and empty arrays for warmup/exercises/cooldown.
2. Keep exercises realistic and safe considering the user's limitations.
3. Each exercise should have practical sets and reps.
4. Respond with ONLY the JSON object. No other text.`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                    responseMimeType: "application/json"
                }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            console.error("No text in Gemini response:", JSON.stringify(response.data));
            return res.status(500).json({
                error: "No response generated. Please try again."
            });
        }

        // Parse the JSON response from Gemini
        let planData;
        try {
            // Clean potential markdown code fences
            const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            planData = JSON.parse(cleanText);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", parseError.message);
            console.error("Raw response:", generatedText.substring(0, 500));
            return res.status(500).json({
                error: "Failed to parse workout plan. Please try again."
            });
        }

        res.json({ plan: planData });

    } catch (error) {
        console.error("GEMINI ERROR:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to generate plan",
            details: error.response?.data?.error?.message || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
