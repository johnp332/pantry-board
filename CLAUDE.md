# Pantry Board

Personal weekly meal-planning, pantry, and grocery-list web app. Installable PWA, used on an Android phone (Chrome).

## Rules
- Vanilla HTML/CSS/JS only. No build step, no frameworks, no npm unless asked.
- Static site hosted on GitHub Pages (deploys on push to `main`) for now. Hosting is temporary, so don't depend on GitHub-specific URLs or features inside the app.
- Data stays on the user's device (localStorage) for now. No backend or accounts yet.
- Mobile-first. Test at ~390px width.
- When changing any cached file, bump `CACHE` in `sw.js`.
- Keep recipes in `RECIPES` in `app.js`; prefer real recipe links in `url`.
- Never push to `main`. Work on a branch, push it, and open a PR with `gh pr create` for the user to review and merge.

## Code style
- Make code readable through clear names and small functions, not comments. Don't add comments, section dividers, or banner headers.
- Only comment a non-obvious *why* (a browser quirk, a workaround), and keep it to one line.
- Remove existing comments that just restate the code when touching that code.

## Direction
The goal is a real product: user accounts, synced data, and installable from the Play Store and App Store. Design for that without building it early:
- All reads and writes of user data go through one storage module with an async interface (`load`, `save`). Nothing else touches `localStorage`, so a server-backed implementation can replace it later.
- Keep data as plain JSON-serializable objects with stable ids, so it can sync and be exported/imported.
- Keep UI, domain logic (ranking, grocery building), and storage in separate files or clearly separate sections.
- Keep it a standards-based PWA. Store apps will wrap the same web code (for example with Capacitor); don't use APIs that wouldn't work in a webview.
- Hosting, accounts, and the store wrapper are decisions for later. Raise them with the user before introducing a backend or build tooling.

## Run locally
`python3 -m http.server 8000` then open http://localhost:8000

## Roadmap ideas
- Recipe add/edit UI; import by URL
- Pantry quantities and expiry dates
- Weekly plan editing (swap/lock a day)
- Export/import data as JSON backup
- Aldi-focused grocery grouping
