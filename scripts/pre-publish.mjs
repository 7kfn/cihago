#!/usr/bin/env node
// Pre-publish checks for CIHAGO. Run with: npm run check
//
// What it checks:
//   1. Frontmatter completeness (title, description, pubDate)
//   2. Drafts (warns if any post is still draft: true)
//   3. Internal links resolve to a real page or asset
//   4. Spelling (cspell, en-GB)
//   5. Prose suggestions (write-good)
//
// Exits non-zero if anything in 1–3 fails (so it can gate a pre-commit hook).
// Spelling and prose are warnings only — they print, but don't block.

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
const BLOG = join(ROOT, 'src/content/blog');
const PAGES = join(ROOT, 'src/pages');
const PUBLIC = join(ROOT, 'public');

const STATIC_ROUTES = new Set(['/', '/about/', '/why-rss/', '/search/', '/tags/', '/404/', '/rss.xml', '/sitemap-index.xml']);

const c = {
  red:   (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yel:   (s) => `\x1b[33m${s}\x1b[0m`,
  dim:   (s) => `\x1b[2m${s}\x1b[0m`,
  bold:  (s) => `\x1b[1m${s}\x1b[0m`,
};

let errors = 0;
let warns = 0;

function header(label) {
  console.log('\n' + c.bold(label));
  console.log(c.dim('─'.repeat(label.length)));
}

function fail(msg) { errors++; console.log(c.red('  ✖ ') + msg); }
function warn(msg) { warns++; console.log(c.yel('  ⚠ ') + msg); }
function ok(msg)   { console.log(c.green('  ✓ ') + msg); }

// ─── 1. Frontmatter & drafts ────────────────────────────────────────────────
async function checkPosts() {
  header('Posts (frontmatter, drafts)');
  const files = (await readdir(BLOG)).filter((f) => /\.(md|mdx)$/.test(f));
  if (!files.length) return warn('No posts found.');

  const slugs = new Set();
  const tags = new Set();

  for (const f of files) {
    const path = join(BLOG, f);
    const src = await readFile(path, 'utf8');
    const fm = parseFrontmatter(src);
    const slug = f.replace(/\.(md|mdx)$/, '');
    slugs.add(`/blog/${slug}/`);

    const where = `${f}`;
    if (!fm) { fail(`${where}: missing frontmatter block`); continue; }
    if (!fm.title)       fail(`${where}: missing title`);
    if (!fm.description) fail(`${where}: missing description`);
    else if (fm.description.length < 60)  warn(`${where}: description is short (${fm.description.length} chars; aim for 120–160)`);
    else if (fm.description.length > 180) warn(`${where}: description is long (${fm.description.length} chars)`);
    if (!fm.pubDate)     fail(`${where}: missing pubDate`);
    if (fm.draft === 'true' || fm.draft === true) {
      warn(`${where}: still draft: true (won't appear on home page or RSS)`);
    }

    // Collect tags for link checking (parse YAML array from raw source)
    const tagMatch = src.match(/^tags:\s*\[([^\]]*)\]/m);
    if (tagMatch) {
      for (const t of tagMatch[1].split(',')) {
        const tag = t.trim().replace(/^["']|["']$/g, '');
        if (tag) tags.add(`/tags/${tag}/`);
      }
    }
  }
  if (errors === 0) ok(`${files.length} post(s) checked`);
  return { slugs, tags };
}

// Tiny YAML-ish frontmatter parser. Handles only the keys we use.
function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    out[kv[1]] = v;
  }
  return out;
}

// ─── 2. Internal links ──────────────────────────────────────────────────────
async function checkInternalLinks(blogSlugs, tagSlugs) {
  header('Internal links');
  const targets = await collectAllFiles([BLOG, PAGES]);
  const linkRe = /\]\((\/[^)\s#?]*)/g;     // markdown:  ](/path
  const hrefRe = /href=["'](\/[^"'#?]*)/g; // html:     href="/path

  let count = 0;
  for (const f of targets) {
    const src = await readFile(f, 'utf8');
    const matches = [...src.matchAll(linkRe), ...src.matchAll(hrefRe)];
    for (const [, link] of matches) {
      count++;
      if (link.startsWith('//')) continue; // protocol-relative external
      if (!await linkResolves(link, blogSlugs, tagSlugs)) {
        fail(`${rel(f)}: broken internal link → ${link}`);
      }
    }
  }
  if (count) ok(`${count} internal link(s) checked`);
}

// Paths generated at build time (not present in source). Treat as valid.
const BUILD_GENERATED_PREFIXES = ['/pagefind/', '/_astro/'];

async function linkResolves(link, blogSlugs, tagSlugs) {
  const norm = link.endsWith('/') || link.includes('.') ? link : `${link}/`;
  if (STATIC_ROUTES.has(norm)) return true;
  if (blogSlugs.has(norm)) return true;
  if (tagSlugs.has(norm)) return true;
  if (BUILD_GENERATED_PREFIXES.some((p) => link.startsWith(p))) return true;
  // public/ assets (images, fonts, robots, favicon, rss.xml, etc.)
  const publicPath = join(PUBLIC, link.replace(/^\//, ''));
  if (existsSync(publicPath)) return true;
  // RSS / sitemap exist only after build, but they're known routes
  if (link === '/rss.xml' || link === '/sitemap-index.xml') return true;
  return false;
}

async function collectAllFiles(dirs) {
  const out = [];
  for (const d of dirs) await walk(d, out);
  return out.filter((f) => /\.(md|mdx|astro)$/.test(f));
}
async function walk(dir, out) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else out.push(p);
  }
}
function rel(p) { return p.replace(ROOT + '/', ''); }

// ─── 3. Spelling (cspell) ───────────────────────────────────────────────────
function checkSpelling() {
  header('Spelling (cspell, en-GB)');
  const r = spawnSync('npx', ['--no-install', 'cspell', '--no-progress', '--no-summary',
    'src/content/blog/**/*.{md,mdx}', 'src/pages/**/*.astro', 'src/components/**/*.astro'],
    { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  const lines = out.split('\n').filter((l) => l.includes('Unknown word'));
  if (!lines.length) return ok('No misspellings.');
  for (const l of lines) warn(l.trim());
  console.log(c.dim('  (Add legitimate words to .cspell-words.txt to silence these.)'));
}

// ─── 4. Prose suggestions (write-good) ──────────────────────────────────────
async function checkProse() {
  header('Prose (write-good)');
  // Lazy import so missing dep doesn't block the rest.
  let writeGood;
  try { writeGood = (await import('write-good')).default; }
  catch { return warn('write-good not installed; skipping.'); }

  const files = (await readdir(BLOG)).filter((f) => /\.(md|mdx)$/.test(f));
  let total = 0;
  for (const f of files) {
    const src = await readFile(join(BLOG, f), 'utf8');
    const body = src.replace(/^---[\s\S]*?---\n/, '');
    const suggestions = writeGood(body);
    if (!suggestions.length) continue;
    total += suggestions.length;
    console.log(c.dim(`  ${f}`));
    for (const s of suggestions.slice(0, 8)) {
      console.log(`    ${c.yel(s.reason)} (offset ${s.index})`);
    }
    if (suggestions.length > 8) console.log(c.dim(`    …and ${suggestions.length - 8} more`));
  }
  if (!total) ok('No prose flags.');
  else console.log(c.dim(`  (write-good is opinionated — treat as suggestions, not rules.)`));
}

// ─── Run ────────────────────────────────────────────────────────────────────
const result = await checkPosts();
const slugs = result?.slugs || new Set();
const tags = result?.tags || new Set();
await checkInternalLinks(slugs, tags);
checkSpelling();
await checkProse();

console.log();
if (errors) {
  console.log(c.red(c.bold(`✖ ${errors} blocking issue(s), ${warns} warning(s).`)));
  process.exit(1);
} else {
  console.log(c.green(c.bold(`✓ All blocking checks passed.`)) + (warns ? c.yel(` (${warns} warning(s))`) : ''));
}
