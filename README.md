# A Little Universe Where I Keep You ✨

An emotionally moving, interactive 3D birthday experience & mini-game built with **React + TypeScript + Vite**, **Three.js / React Three Fiber / Drei**, **Framer Motion**, and **Zustand**.

## 1. Quick Start (Local Development)

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 2. How to Personalize Every Memory, Joke & Letter

Open **`src/config/experienceData.ts`**. Every single name, memory, inside joke, garden discovery, mini-game collectible, unsent letter, future doorway, and line of the final birthday letter lives in this one file:

- `herName`: Change `"Elena"` to her name (this also dynamically forms her name in 3D stars in Scene 7!).
- `myName`: Change `"[MY NAME]"` to your name or nickname.
- `scene2.stars`: Edit the 6 clickable stars connecting your two floating islands.
- `scene3.items`: Edit the 5 hidden objects in the twilight Memory Garden.
- `scene4.collectibles`: Customize the 5 glowing keepsakes in the *"Collect the Little Things"* 3D mini-game.
- `scene5.letters`: Personalize the 4 floating letters and the main handwritten desk letter.
- `scene6.doorways`: Customize the 5 future-date doorways along the sunrise path.
- `scene7.finalLetterParagraphs`: Edit any line of the final full-screen letter.

## 3. Free Deployment Guide

### Option A: Deploy to Vercel (Recommended — Takes ~60 Seconds)
1. Push this project folder to a private or public GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project** → Import your repository.
4. Vercel automatically detects **Vite** (`npm run build`, output directory `dist`).
5. Click **Deploy** and share your custom `.vercel.app` link with her!

### Option B: Deploy to GitHub Pages
1. Since `vite.config.ts` already sets `base: './'`, relative asset paths work out of the box.
2. Run `npm run build` locally to generate the `dist/` folder.
3. Deploy the `dist/` folder using `npx gh-pages -d dist` or enable **GitHub Actions → Static HTML/Vite** in your repository's **Settings → Pages**.
