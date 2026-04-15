# CIHAGO

**Can I Have A Go** — a blog about making the future a better place to live in.

Self-hosted Astro site. System fonts. RSS, sitemap, and Pagefind search built in.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

## Writing a post

```bash
npm run new -- "Your post title"
```

Creates `src/content/blog/<slug>.mdx` with today's date and `draft: true`.
Flip `draft: false` when ready to publish.

## Build & preview

```bash
npm run build      # astro build && pagefind --site dist
npm run preview    # serves dist/ — search and RSS both work here
```

## Pages
- `/` — home, with post list and sidebar
- `/about/` — about CIHAGO
- `/why-rss/` — case for RSS + how to subscribe
- `/search/` — Pagefind search (works after `npm run build`)
- `/rss.xml` — feed
- `/sitemap-index.xml` — sitemap

## Deploy (later)

Push to GitHub and connect to Vercel — no config needed for the static
build. Update the `site` URL in `astro.config.mjs` once a custom domain
is pointed at the deployment.

## Stack
Astro 5 · MDX · @astrojs/rss · @astrojs/sitemap · Pagefind · plain CSS, system fonts.
