import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const home = await readFile('dist/index.html', 'utf8');
const essay = await readFile('dist/writing/a-small-place/index.html', 'utf8');
assert.match(home, /href="\/writing\/a-small-place\/?"/);
assert.match(home, /id="projects"/);
assert.match(essay, /<h1>A small place on the internet<\/h1>/);
assert.match(essay, /<h2[^>]*>Room to write<\/h2>/);
assert.match(essay, /<time datetime="2026-10-01">/);
assert.match(essay, /href="\/#writing"/);
assert.doesNotMatch(home + essay, /<script\b/);
console.log('Homepage, Markdown essay, navigation, and static output checked.');
