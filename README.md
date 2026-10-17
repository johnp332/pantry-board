# Pantry Board

A personal weekly meal-planning, pantry and grocery-list app. It is an installable PWA built with plain HTML, CSS and JavaScript modules, with no build step. Data stays in the browser's localStorage.

## Run locally
```
npx serve
```
Then open the printed address.

## Test
```
node --test "tests/*.test.js"
```

## Deploy
Merging to `main` publishes the site to GitHub Pages through `.github/workflows/pages.yml`.

## Install on a phone
Open the live site in Chrome on Android, then use the ⋮ menu and choose **Install app**.

## Notes
- Clearing site data erases the saved pantry and plan.
- The repo is public, so don't commit anything private.
