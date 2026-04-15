# CIHAGO — guide for Claude Code

> **Read first**: [`soul.md`](soul.md) — the five modes the user is
> likely operating in, and how to figure out which one you're in.
> [`CRIB.md`](CRIB.md) is the user's own cheat sheet — assume they
> already know what's in it.

## What this is
CIHAGO ("Can I Have A Go") is a personal blog about making the future a better
place to live in. Static Astro site, system fonts only, minimalist by design.
Hosted target: Vercel. Authoring is plain `.mdx` in `src/content/blog/`.

## Voice
- Plain, direct, slightly understated. British English spelling.
- Short paragraphs. Concrete over abstract. Specific examples beat manifestos.
- Optimistic but not naive — "could this work?" rather than "this will save us".
- First person singular. No emojis. No marketing tone.
- Read 2–3 recent posts before drafting in this voice.

## Post structure
Frontmatter (Zod-validated in `src/content.config.ts`):
```yaml
title: "..."
description: "..."   # 120–160 chars, becomes meta description + RSS dek
pubDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD   # optional
draft: true|false         # drafts hidden from list + RSS
tags: ["..."]
```

Body: Markdown / MDX. Use `##` for sections. Avoid `#` (the title is the H1).

## Workflows for Claude

**New post**
```
npm run new -- "Post title"
```
Creates `src/content/blog/<slug>.mdx` with `draft: true` and today's date.

**Co-writing**
- Outline → draft → tighten. Edit the `.mdx` file directly.
- When tightening, cut adverbs and hedges; preserve voice.
- For meta description: write 140–160 chars, complete sentence, no clickbait.

**Pre-publish checklist**
- Frontmatter complete (title, description, pubDate, tags).
- `draft: false`.
- Internal links use trailing slash (`/about/`, `/blog/<slug>/`).
- No broken `<Img>` src; no unresolved TODO comments.

**Local preview**
```
npm run dev       # http://localhost:4321
npm run build     # builds + indexes for Pagefind
npm run preview   # serves dist/, search works here
```

## Conventions worth keeping
- Don't add Tailwind, Google Fonts, or analytics.
- Don't add Giscus for comments — it requires GitHub login. Cusdis or a small
  Vercel function are the anonymous-friendly options.
- Keep `astro.config.mjs` `site` accurate; RSS + sitemap depend on it.
- Search index lives in `dist/pagefind/` after build — don't commit `dist/`.
