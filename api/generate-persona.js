import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fear, dream, habit } = req.body || {};

  if (!fear?.trim() || !dream?.trim() || !habit?.trim()) {
    return res.status(400).json({ error: 'All three fields are required.' });
  }

  if (fear.length > 200 || dream.length > 200 || habit.length > 200) {
    return res.status(400).json({ error: 'Each field must be under 200 characters.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create a fictional character inspired by these three things about a real person:
- Their biggest fear: "${fear}"
- Their secret dream: "${dream}"
- Their strangest habit: "${habit}"

The character should feel like a mythic, amplified version of this person — their fear becomes the character's greatest weakness, their dream becomes their superpower, their habit becomes a legendary quirk.

Return ONLY raw JSON, no markdown, no explanation:

{
  "name": "a poetic, unusual full name (first + last)",
  "age": a number between 18 and 85,
  "world": "one sentence describing the era or universe they inhabit (can be historical, futuristic, or magical realist)",
  "origin": "two sentences: how the fear shaped who they became",
  "superpower": "one sentence: the extraordinary ability born from their dream",
  "flaw": "one sentence: how their fear manifests as their fatal flaw",
  "quirk": "one sentence: how their strange habit became legendary or mythic",
  "truth": "the single sentence they live by — their philosophy",
  "story": "a 180-200 word cinematic opening scene. The moment their story begins. Present tense. Literary quality. No dialogue tags, minimal dialogue. Show don't tell.",
  "accentColor": "a hex color that represents this character's energy (vibrant but not neon, not too dark, not pure white)",
  "stats": {
    "courage": a number 0-100,
    "wisdom": a number 0-100,
    "power": a number 0-100,
    "mystery": a number 0-100,
    "heart": a number 0-100
  },
  "archetype": "2-4 word archetype label (e.g. The Reluctant Oracle, The Burning Scholar)",
  "matchPercent": a number between 65 and 94
}`;

    const result = await model.generateContent(prompt);
    const text = result.response
      .text()
      .trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const persona = JSON.parse(text);

    const required = [
      'name', 'age', 'world', 'origin', 'superpower', 'flaw',
      'quirk', 'truth', 'story', 'accentColor', 'stats',
      'archetype', 'matchPercent',
    ];
    for (const f of required) {
      if (!(f in persona)) throw new Error(`Missing field: ${f}`);
    }

    return res.status(200).json({ success: true, persona });
  } catch (err) {
    console.error('Gemini error:', err);
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'Failed to parse AI response. Try again.' });
    }
    return res.status(500).json({ error: 'Character generation failed. Please try again.' });
  }
}
