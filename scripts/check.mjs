import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { projects } from '../src/data/site.ts';

const home = await readFile('dist/index.html', 'utf8');
const writing = await readFile('dist/writing/index.html', 'utf8');
const projectPage = await readFile('dist/projects/index.html', 'utf8');
const essays = (await readdir('src/pages/writing')).filter(file => file.endsWith('.md'));
const archiveLinks = [...writing.matchAll(/<h3><a href="([^"]+)"/g)].map(([, href]) => href);
const dates = [...writing.matchAll(/<time datetime="([^"]+)"/g)].map(([, date]) => date);

assert.equal(archiveLinks.length, essays.length, 'Every essay appears in the archive');
assert.equal(dates.length, essays.length, 'Every essay has an archive date');
assert.deepEqual(dates, [...dates].sort().reverse(), 'Newest essays appear first');
if (archiveLinks.length) assert(home.includes(`href="${archiveLinks[0]}"`), 'Home features the latest essay');
for (const file of essays) {
  assert(archiveLinks.some(href => decodeURI(href).replace(/\/$/, '') === `/writing/${file.slice(0, -3)}`), `${file}: missing from archive`);
}

assert.equal(new Set(projects.map(project => project.id)).size, projects.length, 'Project IDs are unique');
for (const project of projects) {
  const section = projectPage.split(`id="${project.id}"`)[1]?.split('</section>')[0];
  assert(section, `${project.id}: missing project window`);
  for (const url of [project.demo, project.source].filter(Boolean)) {
    assert(['https:', 'http:'].includes(new URL(url).protocol), `${project.id}: invalid project URL`);
    assert(section.includes(`href="${url.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`));
  }
  if (!project.demo) assert(section.includes('Coming soon'), `${project.id}: planned status is visible`);
}

const htmlFiles = (await readdir('dist', { recursive: true })).filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(join('dist', file), 'utf8');
  assert.doesNotMatch(html, /<script\b/);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /class="skip-link" href="#main"/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${file}: one page heading`);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1, `${file}: active navigation`);
  for (const [, href] of html.matchAll(/href="([^"\s]+)"/g)) {
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(href, `https://site.test/${file.replace(/index\.html$/, '')}`);
    const path = extname(url.pathname) ? url.pathname : `${url.pathname.replace(/\/$/, '')}/index.html`;
    const target = await readFile(join('dist', decodeURI(path)), 'utf8');
    if (url.hash) assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: missing anchor ${href}`);
  }
}
console.log(`${htmlFiles.length} static pages checked: navigation, internal links, archive order, and projects.`);
