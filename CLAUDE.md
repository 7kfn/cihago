# CIHAGO — guide for Claude Code

> [`CRIB.md`](CRIB.md) is the user's own cheat sheet — assume they
> already know what's in it.

## What this is
CIHAGO ("Can I Have A Go") is a personal blog about making the future a better
place to live in. Static Astro site, system fonts only, minimalist by design.
Hosted target: Vercel. Authoring is plain `.mdx` in `src/content/blog/`.

## The five modes

Whoever opened this session almost certainly wants one of five things.
Identify which before you start typing — the worst version of you assumes
wrong and ploughs ahead.

### 1. Editing or co-writing a draft
The user has a post in flight (likely `draft: true` in
`src/content/blog/`) and wants you on the page with them.

- **Read the existing draft first.** Then read 1–2 published posts to
  match voice before writing.
- Edit the `.mdx` file directly; don't paste the new version into chat.
- Common asks: tighten prose, expand a section, suggest a meta
  description (140–160 chars), pick tags, fact-check a claim.
- Don't change frontmatter unless asked. Don't flip `draft: false`
  unless asked — that's a publish.

### 2. Creating a new post from scratch
The user has an idea and no file yet.

- Use the helper: `npm run new -- "Post title"` (creates the file with
  today's date, `draft: true`, empty body).
- Read the last 2–3 published posts before drafting — voice-matching is
  the whole job here.
- Default to outline-then-draft. Get alignment on the outline before
  writing the prose.

### 3. Conversation about a blog or the blog's direction
The user wants to think out loud — *what should I write about, what's
the through-line, how do I structure this argument, is this idea worth
a post.* No file yet, possibly no decisions yet.

- This is a discussion, not a coding task. **Don't create files.**
- Be a sparring partner: probe assumptions, suggest cuts, name the
  audience, propose an angle. Short responses, real engagement.
- If a clear post idea lands, *then* offer to start a draft.

### 4. Posting or managing posts
Operational work: publishing, editing dates, fixing typos in something
already live, dealing with drafts, renaming, redirects.

- Run `npm run check` before any push — it catches frontmatter gaps,
  broken links, and spelling.
- Publishing = flip `draft: false` then `git push`. Vercel deploys on
  push to `main`.
- Renaming a file changes the URL — flag the breakage cost; suggest
  keeping the slug.
- Use `updatedDate:` for substantive edits to a published post.

### 5. Technical changes to the site itself
Layout, styling, components, theming, build, dependencies — anything
that isn't post content.

- Keep changes small and reversible. Run `npm run build` after
  meaningful edits to confirm nothing broke.
- The site is mobile-first; verify changes at <760px and >=760px before
  declaring done.
- Don't modify `astro.config.mjs` `site:` URL on a whim — RSS, sitemap,
  and canonical URLs all derive from it.

## How to figure out which mode you're in

Listen to the first message:

- "Help me write/edit/tighten/finish ..." → mode 1
- "I want to write about ..." with no file → mode 2
- "What should I write about ..." / "I'm thinking about ..." / "Does
  this idea work ..." → mode 3
- "Publish ...", "Why isn't ... showing up", "How do I ..." → mode 4
- "The header ...", "Add a page", "The dark mode ...", "Can we
  ..." (about the site) → mode 5

When ambiguous, ask one short clarifying question rather than guess.

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

## Workflows

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

## Don't be too kind to sources

When the user floats an interpretation of something they're reading ("is
this what they mean by X?"), read the source for what it says and answer
at that level. Don't steelman the interpretation into something more
sophisticated than the text supports just because the upgraded version
is more interesting to discuss. Over-charitable readings waste the
user's time, mislead the analysis, and make it harder to land an honest
critique later. If the source is vague, say "it's vague" rather than
filling the vagueness with the most flattering possible reading.

## Things you should never do without explicit permission

- Flip `draft: false` (that's a publish)
- `git push` or `git commit`
- Change the `site:` URL in `astro.config.mjs`
- Add Google Fonts, Tailwind, analytics, or Giscus
- Delete posts or rename their slugs

## Where to find things

- User's operational cheat sheet: `CRIB.md`
- Posts: `src/content/blog/*.mdx`
- Pages: `src/pages/*.astro`
- Styles: `src/styles/global.css`
- Pre-publish checks: `scripts/pre-publish.mjs`
