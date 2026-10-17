# Pantry Board

Personal weekly meal-planning, pantry, and grocery-list web app. Installable PWA, used on an Android phone (Chrome).

## Rules
- Vanilla HTML/CSS/JS only. No build step, no frameworks, no npm unless asked.
- Static site hosted on GitHub Pages (deploys on push to `main`).
- All data stays on the user's device (localStorage). No backend, no accounts.
- Mobile-first. Test at ~390px width.
- When changing any cached file, bump `CACHE` in `sw.js`.
- Keep recipes in `RECIPES` in `app.js`; prefer real recipe links in `url`.

## Run locally
`python3 -m http.server 8000` then open http://localhost:8000

## Roadmap ideas
- Recipe add/edit UI; import by URL
- Pantry quantities and expiry dates
- Weekly plan editing (swap/lock a day)
- Export/import data as JSON backup
- Aldi-focused grocery grouping
