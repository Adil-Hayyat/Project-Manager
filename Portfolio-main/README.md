# Adil Hayyat — Portfolio

Single-page portfolio for Adil Hayyat, AI Automation & Full Stack Engineer.
React + Vite, dark terminal theme.

## Run it

```bash
npm install     # first time only
npm run dev     # dev server at http://localhost:5173 (hot reload)
npm run build   # production build → dist/ (deploy that folder anywhere)
npm run preview # serve the production build locally
```

Deploying to Vercel/Netlify: import the repo, framework preset **Vite**,
build command `npm run build`, output directory `dist`.

## Structure

```
index.html            — entry, fonts, meta tags
src/data.js           — ALL site content (edit this, not the components)
src/index.css         — theme + layout (colors in :root custom properties)
src/App.jsx           — page assembly + scroll reveals
src/components/       — Nav, Hero, About, Assets, Operations, Log, Contact, Footer
public/favicon.png
```

## Placeholders to replace

Search `src/data.js` for `DUMMY` comments:

- **Contact cards** — email, GitHub, LinkedIn, website are all placeholders
- **Education / base location** — verify
- **Project metrics** — results on the voice agent, email, and KPI projects
- **Resume button** — points to `#` in `src/components/Hero.jsx`

## Theme

All colors are CSS custom properties at the top of `src/index.css` (`:root`):
near-black background, blueprint grid, emerald accent, cyan secondary status.
Change them in one place and the whole site follows.
