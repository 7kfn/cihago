# CIHAGO crib sheet

A practical reference for the common things you'll do here.
Commands assume you're in `~/Code/Cihago`.

---

## Daily writing loop

```bash
npm run dev          # live preview at http://localhost:4321 (leave running)
npm run new -- "Post title"   # creates a new draft .mdx
# … write in src/content/blog/<slug>.mdx
npm run check        # frontmatter, links, spelling, prose — see below
git add -A && git commit -m "post: short title"
git push             # Vercel deploys automatically
```

That's it. The rest of this file is detail you'll want occasionally.

---

## Writing a new post

1. `npm run new -- "Why I'm trying X"`
   → creates `src/content/blog/why-im-trying-x.mdx` with today's date
   and `draft: true`.
2. Open the file in VS Code. Frontmatter looks like this — fill in the
   description and tags as you write:
   ```yaml
   ---
   title: "Why I'm trying X"
   description: ""        # 120–160 chars; shows on home + RSS + meta
   pubDate: 2026-04-15
   draft: true            # flip to false to publish
   tags: []
   ---
   ```
3. Write. Save. The `npm run dev` tab hot-reloads.
4. When ready: `draft: true` → `draft: false`, then commit + push.

**Drafts are hidden from the home page and RSS but reachable at their
URL.** So you can push a draft to share for feedback before publishing.

---

## Editing an existing post

- Open `src/content/blog/<slug>.mdx`. Edit. Save. Commit. Push.
- If it's a substantive change to a published post, add
  `updatedDate: 2026-04-20` to the frontmatter so readers see "updated".
- **Don't rename the file** unless you want the URL to change — old
  links will break.

---

## Adding an image

1. Drop the file in `public/images/`:
   ```bash
   cp ~/Desktop/whatever.jpg public/images/whatever.jpg
   ```
2. Reference it in the `.mdx`:
   ```markdown
   ![Description for screen readers](/images/whatever.jpg)
   ```
3. Always write meaningful alt text — important for SEO and essential
   for blind readers.
4. Pre-resize phone photos before committing. ~1600px wide is plenty;
   anything bigger bloats the git history.

---

## VS Code markdown preview

- `Cmd+Shift+V` — preview in a new tab
- `Cmd+K V`     — preview side-by-side (best for writing)

That's the basic markdown render. For real-fidelity preview, use the
`npm run dev` browser tab — that's what readers actually see.

Useful extensions (optional):
- **Markdown All in One** (yzhang) — keyboard shortcuts, TOC helpers
- **MDX** (unifiedjs) — proper syntax highlighting for `.mdx`

---

## Pre-publish check (`npm run check`)

Runs four things, in order:

| Check | Blocks push? |
|---|---|
| Frontmatter (title, description, pubDate present) | yes |
| Internal link resolution | yes |
| Drafts left as `draft: true` | warning only |
| Spelling (cspell, en-GB) | warning only |
| Prose suggestions (write-good) | warning only |

When cspell flags a real word it doesn't know (a name, a technical
term), add it on its own line in `.cspell-words.txt`.

---

## Theme / appearance

- The site auto-follows the visitor's OS light/dark setting.
- Visitors can override on the **About** page (the tri-state Auto / Light
  / Dark toggle); their choice persists in `localStorage`.

---

## Where everything lives

```
src/content/blog/        ← posts (.mdx)
src/pages/               ← static pages (about, why-rss, search, 404)
src/components/          ← Header, Footer, Sidebar, ThemeToggle …
src/layouts/             ← BaseLayout, PostLayout
src/styles/global.css    ← all the styling
public/                  ← favicon, fonts, images, robots.txt
scripts/                 ← new-post.mjs, pre-publish.mjs
astro.config.mjs         ← site URL, integrations, prefetch
.cspell-words.txt        ← project dictionary
CLAUDE.md                ← voice + tech conventions for Claude Code
soul.md                  ← Claude's orientation (modes of work)
```

---

## Common one-liners

```bash
npm run dev              # local preview
npm run new -- "Title"   # new draft post
npm run check            # pre-publish audit
npm run build            # production build (writes to dist/)
npm run preview          # serve the production build (search works here)
```

---

## Live on the internet

- **Production**: https://cihago.com
- **GitHub repo**: https://github.com/7kfn/cihago (public, branch `main`)
- **Hosting**: Vercel (Hobby tier)
- **DNS**: registered at Hover, pointing at Vercel
- **SSL**: auto-provisioned by Let's Encrypt via Vercel; auto-renews
- **Vercel default URL** (still active): https://cihago.vercel.app

## The publish loop

```bash
# In ~/Code/Cihago
npm run dev                       # preview locally
# … edit src/content/blog/<slug>.mdx in VS Code
npm run check                     # pre-publish audit
git add -A && git commit -m "post: short title"
git push                          # Vercel deploys to cihago.com in ~30–45s
```

Every push to `main` triggers a production deploy. Every pull request
triggers a **preview deployment** at its own URL — useful for sharing a
draft with someone before it goes live.

## Useful Vercel things

- **Deployments tab** (in the Vercel project): full log of every
  deploy, rollback button on each.
- **Rollback**: hit the `…` next to any prior deployment →
  *Promote to Production*. Instant, zero-downtime.
- **Preview URLs for drafts**: push the draft (still
  `draft: true`) to a branch → open a PR → Vercel comments with a
  preview URL. Drafts don't show on the home page or RSS but are
  reachable at their direct URL.
- **Deploy logs / build failures**: each deployment's log lives in
  the Deployments tab — that's where any Astro build errors show up.

## If DNS ever needs changing

Hover → *Domain Details for cihago.com* → DNS tab. The records Vercel
needs are documented in your Vercel project's *Settings → Domains*
section. If anything breaks, Vercel's Domains panel will flag it and
tell you exactly what record to set.

---

## Things worth doing sometime soon

- Replace the empty home page with a real first post — right now the
  list is blank.
- Flesh out the About page if the current short copy needs more.
- Consider adding an `og:image` (a simple 1200×630 PNG at
  `public/og-default.png` plus one line in `BaseHead.astro`) — social
  link previews look bare without one.
