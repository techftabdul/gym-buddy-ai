const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function buildPrompt(formData) {
  const { goal, experience, equipment, duration, limitations } = formData;

  return `You are a professional fitness trainer. Create a personalized weekly workout plan.

User Profile:
- Goal: ${goal}
- Experience: ${experience}
- Equipment: ${equipment}
- Duration: ${duration} minutes per session
- Limitations: ${limitations || 'None'}

Return ONLY valid JSON with this exact structure:
{
  "title": "Plan title based on goal",
  "summary": "1-2 sentence plan overview",
  "days": [
    {
      "day": "Day 1",
      "label": "Monday",
      "focus": "e.g. Upper Body, Legs, Full Body",
      "isRest": false,
      "warmup": ["Exercise - duration"],
      "exercises": [
        { "name": "Exercise name", "sets": 3, "reps": "10-12", "notes": "Short tip" }
      ],
      "cooldown": ["Stretch - duration"]
    }
  ],
  "motivation": "Short motivational message"
}

Rules:
1. Provide exactly 7 days. Rest days use "isRest": true with empty arrays.
2. Keep exercises safe for the user's limitations.
3. Each exercise needs practical sets and reps.
4. Return ONLY the JSON object.`;
}

export async function generateWorkoutPlan(formData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  const prompt = buildPrompt(formData);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.error?.message || `API error (${response.status})`;

    if (response.status === 429) {
      throw new Error('Rate limit reached. Please wait a minute and try again.');
    }
    if (response.status === 403) {
      throw new Error('API key invalid or quota exhausted. Check your Gemini API key.');
    }

    throw new Error(message);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new Error('No response generated. Please try again.');
  }

  // Parse JSON — clean potential markdown fences just in case
  const cleanText = generatedText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    console.error('Failed to parse Gemini response:', cleanText.substring(0, 300));
    throw new Error('Failed to parse workout plan. Please try again.');
  }
}
