import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { greeting, pages, shareImagePath } from '../../data/site';
import { posts } from '../../data/writing';

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const fontCache = resolve('.astro/share-font-cache');
const fontConfig = resolve('.astro/share-fonts.conf');
mkdirSync(fontCache, { recursive: true });
writeFileSync(fontConfig, `<fontconfig><dir>${escape(resolve('src/assets/fonts'))}</dir><cachedir>${escape(fontCache)}</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE = fontConfig;

export const getStaticPaths: GetStaticPaths = () => [
  // Page cards show only a heading: the preview prints the page blurb beside the image as its title.
  // The home card greets instead of repeating the name.
  ...Object.entries(pages).map(([pathname, data]) => ({ pathname, title: pathname === '/' ? greeting : data.title, description: '' })),
  ...posts.filter(post => !post.frontmatter.image).map(post => ({
    pathname: post.url!, title: post.frontmatter.title, description: post.frontmatter.description,
  })),
].map(({ pathname, ...data }) => ({
  params: { slug: shareImagePath(pathname).slice('/share/'.length, -4) },
  props: data,
}));

// Blue pencil palette, matching the light theme in global.css.
const color = { paper: '#f3f5f6', ink: '#17212b', graphite: '#4f5a65', pencil: '#a6dcef', pencilInk: '#1c5e78' };
const portraitSize = 240;
const headingGap = 30;

// Pango wraps text with the bundled font; no browser or network is needed at build time.
const textImage = async (text: string, font: string, foreground: string, width: number, height: number) => {
  const options = {
    text: `<span foreground="${foreground}">${escape(text)}</span>`,
    font,
    fontfile: resolve('src/assets/fonts/SourceSerif4.ttf'),
    width, rgba: true, wrap: 'word-char' as const,
  };
  const rendered = await sharp({ text: options }).png().toBuffer({ resolveWithObject: true });
  if (rendered.info.height <= height) return rendered;
  return sharp({ text: { ...options, height } }).png().toBuffer({ resolveWithObject: true });
};

const portrait = await sharp('src/assets/portrait.jpg').resize(portraitSize, portraitSize).composite([{
  input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${portraitSize}" height="${portraitSize}"><circle cx="${portraitSize / 2}" cy="${portraitSize / 2}" r="${portraitSize / 2}"/></svg>`),
  blend: 'dest-in',
}]).png().toBuffer();

// The card mirrors the site: portrait in the margin, a blue rule, then the text column.
const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${color.paper}"/>
  <rect width="1200" height="10" fill="${color.pencilInk}"/>
  <rect x="358" y="70" width="4" height="490" fill="${color.pencil}"/>
</svg>`);

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description: string };
  const heading = await textImage(title.replace(/ — Jonathan Pollack$/, ''), 'Source Serif 4, SemiBold 58', color.ink, 720, 230);
  const summary = description ? await textImage(description, 'Source Serif 4, 30', color.graphite, 720, 150) : undefined;
  // Link previews already print the domain, so the card holds only the heading and summary, centred vertically.
  const textHeight = heading.info.height + (summary ? headingGap + summary.info.height : 0);
  const textTop = Math.round((630 - textHeight) / 2);
  const png = await sharp(background).composite([
    { input: portrait, left: 60, top: 195 },
    { input: heading.data, left: 410, top: textTop },
    ...(summary ? [{ input: summary.data, left: 410, top: textTop + heading.info.height + headingGap }] : []),
  ]).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
