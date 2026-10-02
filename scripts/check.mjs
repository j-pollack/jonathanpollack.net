import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { projects, shareImagePath } from '../src/data/site.ts';
import sharp from 'sharp';
import { createHash } from 'node:crypto';

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
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
const sitemapURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
assert.equal(sitemapURLs.length, htmlFiles.length, 'Sitemap lists every page once');
assert.equal(new Set(sitemapURLs).size, htmlFiles.length, 'Sitemap has no duplicate URLs');
assert.match(await readFile('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/www\.jonathanpollack\.net\/sitemap-index\.xml/);
const generatedCardHashes = new Set();
for (const file of htmlFiles) {
  const html = await readFile(join('dist', file), 'utf8');
  const meta = name => html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = meta('description');
  const canonical = new URL(file.replace(/index\.html$/, ''), 'https://www.jonathanpollack.net/').href;
  assert(title && description, `${file}: title and description are present`);
  assert(html.includes(`<link rel="canonical" href="${canonical}"`), `${file}: canonical uses the production URL`);
  assert(sitemapURLs.includes(canonical), `${file}: canonical is in the sitemap`);
  assert.equal(meta('og:url'), canonical);
  assert.equal(meta('og:title'), title);
  assert.equal(meta('og:description'), description);
  assert.equal(meta('twitter:card'), 'summary_large_image');
  assert.equal(meta('twitter:title'), title);
  assert.equal(meta('twitter:description'), description);
  assert.equal(meta('twitter:image'), meta('og:image'));
  assert(meta('og:image:alt') && meta('twitter:image:alt'), `${file}: image descriptions are present`);
  const image = new URL(meta('og:image'));
  assert.equal(image.protocol, 'https:', `${file}: sharing image uses HTTPS`);
  if (image.origin === 'https://www.jonathanpollack.net') {
    assert((await readFile(join('dist', decodeURI(image.pathname)))).length > 0, `${file}: sharing image exists`);
    if (image.pathname === shareImagePath(new URL(canonical).pathname)) {
      const metadata = await sharp(join('dist', decodeURI(image.pathname))).metadata();
      assert.equal(metadata.format, 'png');
      assert.equal(metadata.width, 1200);
      assert.equal(metadata.height, 630);
      const hash = createHash('sha256').update(await readFile(join('dist', decodeURI(image.pathname)))).digest('hex');
      assert(!generatedCardHashes.has(hash), `${file}: generated card should contain page-specific content`);
      generatedCardHashes.add(hash);
    }
  }
  if (file.startsWith('writing/') && file !== 'writing/index.html') {
    assert.equal(meta('og:type'), 'article');
    assert(meta('article:published_time'), `${file}: article publication date is present`);
  } else assert.equal(meta('og:type'), 'website');
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
console.log(`${htmlFiles.length} static pages checked: navigation, internal links, archive order, projects, SEO, and sharing images.`);
