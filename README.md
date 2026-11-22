# CURIOSITY — The Social Media Platform for the Mind

A TikTok-style vertical feed where every post is a short interactive learning experience: thought experiments, history decisions, philosophical challenges, Socratic dialogues, debates, close readings and more. Static HTML/CSS/JS. No backend, no API keys, no build step. Installable as a PWA.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
node scripts/validate-content.js   # validate all content
pip install playwright && playwright install chromium
python3 tests/e2e.py --shots ./shots   # full UI play-through of all 51 experiences
```
It also works by opening `index.html` directly (classic scripts, no modules).

## Deploy to GitHub Pages
1. Create a repo and push this folder to `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `.github/workflows/deploy.yml` validates content, then publishes. Your URL: `https://<user>.github.io/<repo>/`.
Paths are relative, so project sites work without configuration.

## Features
- **Discover**: endless personalised feed (For You / Following) built on scroll-snap.
- **13 interactive formats**: thought experiment, interactive history, philosophical challenge, Socratic dialogue, perspective shift, debate, interactive exploration (timeline, scales, map projections, musical intervals, Wason task), literature close reading, knowledge connection, real-life application, prediction (incl. Monty Hall simulator), spot-the-flaw, layered explanation, plus spaced-recall cards.
- **12 subjects**, 51 experiences, 6 journeys, 6 collections, 3 fictional curators.
- **Rabbit Holes** (`#/holes`): every idea is a doorway into its own exploration. 12 hand-written holes (60 paths) such as Plato's Cave (original text, an interactive cave, Plato vs. modern psychology, five objections, social media), plus a hole derived from every experience, so nothing is a dead end. Paths are stepped through node by node (read, choice, compare, objection ladder, sort, scale, simulation) and track depth, not score.
- **The Atlas** (`#/atlas`): 51 fact tables behind a generative question engine, 1,226 to 1,816 questions per subject (see `node scripts/validate-content.js` for exact counts). Study mode, play mode, spaced misses, and Quickfire cards that appear in the feed. Questions are generated from the tables, so breadth is large; the depth lives in Rabbit Holes and experiences.
- **The Intellectual Mirror** (`#/mirror`, plus My Mind): after paths and experiences it asks how you reached a view (assumptions, evidence that would change your mind, the opposite case, connections to experience, confidence, origin). It never marks beliefs right or wrong. It builds a private, deletable profile of your reasoning habits and recurring themes. Stored only in your browser.
- **Discovery engine** (client-side): topic affinity, novelty, connections, difficulty fit, follows, repetition/seen penalties, and a ~30% deliberate exploration slot from least-seen subjects. Leitner spaced repetition for recall.
- **Progression**: XP, 7 levels, subject mastery tiers, 26 achievements, streaks, weekly goals, daily challenge and 5–10 minute daily journey, knowledge map, growth dashboard.
- **Saved**: bookmarks, collections, notes. **Search** across ideas, thinkers, subjects.
- **Honest social layer**: local-only. Community distributions are labelled illustrative samples. Share via Web Share, link copy or a generated PNG card.
- Dark/light themes, reduced-motion support, keyboard/ARIA support, offline PWA, JSON export/import/reset of all data.

## Adding content
Add an object to a file in `js/content/` (see `docs/ARCHITECTURE.md` for the schema), run `node scripts/validate-content.js`, and bump `VERSION` in `sw.js`.

## Known limitations
- Web Audio (intervals) and Web Share were tested only in headless Chrome, not on real devices.
- All data lives in localStorage on one device.

## Roadmap
1. Real backend behind `C.social.adapter` (accounts, real community answers, follows).
2. Sync of progress across devices.
3. Community-authored experiences with moderation.
4. More content and formats, multi-language support.
5. Teacher/classroom mode and shared journeys.
6. Optional AI Socratic partner (bring your own key).
