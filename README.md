# PERSONA — AI Character Generator

Three things about you. One character who carries them all.

PERSONA turns your biggest fear, secret dream, and strangest habit into a complete fictional character — with name, backstory, superpower, flaw, quirk, and a cinematic opening story. Powered by Google Gemini AI.

## Setup

1. Clone repo
2. `npm install`
3. `cp .env.example .env`
4. Add `GEMINI_API_KEY` from https://aistudio.google.com/
5. `npm run dev`

## Deploy

1. Push to GitHub
2. Import in Vercel
3. Add `GEMINI_API_KEY` in Environment Variables
4. Deploy

## Tech Stack

- **Frontend:** React + Vite + TypeScript
- **AI:** Google Gemini (`@google/generative-ai`)
- **Animations:** GSAP + Framer Motion
- **Charts:** D3.js
- **Canvas:** Custom generative portraits + grain overlay
- **Export:** html2canvas
- **Deploy:** Vercel serverless functions
