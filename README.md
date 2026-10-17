# Pantry Board — setup

## 1. Install tools (one time)
1. **Git**: https://git-scm.com/downloads
2. **VS Code**: https://code.visualstudio.com (add the "Live Server" extension)
3. **Node.js LTS**: https://nodejs.org (needed for the Claude CLI)
4. **GitHub CLI**: https://cli.github.com, then run `gh auth login`
5. **Claude Code CLI**: `npm install -g @anthropic-ai/claude-code`, then run `claude` once to sign in

## 2. Put this project on GitHub
```
cd pantry-board
git init -b main
git add .
git commit -m "Initial Pantry Board"
gh repo create pantry-board --public --source=. --push
```
Then on GitHub: repo **Settings → Pages → Source: GitHub Actions**. After the first push finishes (Actions tab), the app is live at `https://<your-username>.github.io/pantry-board/`.

## 3. Try it on your phone
Open that URL in Chrome on Android → ⋮ menu → **Install app** / **Add to Home screen**.

## 4. Daily workflow
```
cd pantry-board
code .          # open VS Code
claude          # start Claude Code in this folder; it reads CLAUDE.md
```
Ask Claude for changes ("add quantities to pantry items"), preview with Live Server or `python3 -m http.server`, then:
```
git add . && git commit -m "describe change" && git push
```
GitHub Actions redeploys automatically in about a minute.

## Notes
- Data is stored in your phone's browser (localStorage). Clearing site data erases it; a JSON export/import is on the roadmap in `CLAUDE.md`.
- A public repo is required for free GitHub Pages on most plans. Don't commit anything private.
