# LoopUp Website

Marketing and SEO site for **LoopUp** — the private group app for Plan, Play, and Share. Static HTML with Tailwind CSS (CDN).

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Home |
| `about.html`, `contact.html`, `updates.html` | Supporting pages |
| `privacy.html` | Privacy policy |
| `tailwind.config.js` | Design tokens reference |
| `robots.txt`, `sitemap.xml` | SEO |

## Local preview

Open `index.html` in a browser, or serve the folder with any static server (for example VS Code Live Server).

## Git (first-time setup)

If this folder is not yet a repository:

1. Install [Git for Windows](https://git-scm.com/download/win).
2. In this directory run:

```bash
git init
git add .
git commit -m "Initial commit: LoopUp Website"
```

Create a GitHub repository named e.g. `LoopUp-Website` (GitHub does not allow spaces in repo names), then:

```bash
git remote add origin https://github.com/<your-account>/LoopUp-Website.git
git branch -M main
git push -u origin main
```

## Production notes

- Replace placeholder store links and confirm `https://loopup.app` in canonical URLs and `sitemap.xml` if your domain differs.
