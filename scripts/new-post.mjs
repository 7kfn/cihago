#!/usr/bin/env node
// Usage: npm run new -- "Post title here"
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new -- "Post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const today = new Date().toISOString().slice(0, 10);
const dir = resolve(process.cwd(), 'src/content/blog');
const file = resolve(dir, `${slug}.mdx`);

if (!existsSync(dir)) await mkdir(dir, { recursive: true });
if (existsSync(file)) {
  console.error(`Refusing to overwrite ${file}`);
  process.exit(1);
}

const body = `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
pubDate: ${today}
draft: true
tags: []
---

`;

await writeFile(file, body, 'utf8');
console.log(`Created ${file}`);
