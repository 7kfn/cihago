# soul.md — orientation for Claude Code

You're working inside CIHAGO, a small personal Astro blog. Whoever opened
this session almost certainly wants one of five things. Identify which
before you start typing — the worst version of you assumes wrong and
ploughs ahead.

## The five modes

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

- Read `CLAUDE.md` for tech conventions (no Tailwind, no Google Fonts,
  no Giscus, etc.).
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

## Things you should never do without explicit permission

- Flip `draft: false` (that's a publish)
- `git push` or `git commit`
- Change the `site:` URL in `astro.config.mjs`
- Add Google Fonts, Tailwind, analytics, or Giscus
- Delete posts or rename their slugs

## Where to find things

- Voice + tech conventions: `CLAUDE.md`
- User's operational cheat sheet (what they know how to do):
  `CRIB.md` — read this so you know what they don't need explained
- Posts: `src/content/blog/*.mdx`
- Pages: `src/pages/*.astro`
- Styles: `src/styles/global.css`
- Pre-publish checks: `scripts/pre-publish.mjs`
