import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pages, shareImagePath } from '../../data/site';
import { posts } from '../../data/writing';

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const fontCache = resolve('.astro/share-font-cache');
const fontConfig = resolve('.astro/share-fonts.conf');
mkdirSync(fontCache, { recursive: true });
writeFileSync(fontConfig, `<fontconfig><dir>${escape(resolve('src/assets/fonts'))}</dir><cachedir>${escape(fontCache)}</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE = fontConfig;

export const getStaticPaths: GetStaticPaths = () => [
  ...Object.entries(pages).map(([pathname, data]) => ({ pathname, ...data })),
  ...posts.filter(post => !post.frontmatter.image).map(post => ({
    pathname: post.url!, title: post.frontmatter.title, description: post.frontmatter.description,
  })),
].map(({ pathname, ...data }) => ({
  params: { slug: shareImagePath(pathname).slice('/share/'.length, -4) },
  props: data,
}));

// Pango wraps text with the bundled font; no browser or network is needed at build time.
const textImage = async (text: string, size: number, width: number, height: number) => {
  const options = {
    text: `<span foreground="#26313b">${escape(text)}</span>`,
    font: `Space Grotesk ${size}`,
    fontfile: resolve('src/assets/fonts/SpaceGrotesk.ttf'),
    width, rgba: true, wrap: 'word-char' as const,
  };
  const rendered = await sharp({ text: options }).png().toBuffer({ resolveWithObject: true });
  if (rendered.info.height <= height) return rendered;
  return sharp({ text: { ...options, height } }).png().toBuffer({ resolveWithObject: true });
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description: string };
  const heading = await textImage(title.replace(/ — Jonathan Pollack$/, ''), 60, 738, 185);
  const summary = await textImage(description, 30, 738, 140);
  const label = await textImage('jonathanpollack.net', 22, 980, 38);
  const footer = await textImage('Jonathan Pollack · writing + experiments', 20, 900, 32);
  const logo = await sharp('public/favicon.svg').resize(240, 240).png().toBuffer();
  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#faf2da"/>
    <rect x="28" y="28" width="1144" height="574" fill="#faf2da" stroke="#26313b" stroke-width="8"/>
    <path d="M32 32H1168V108H32Z" fill="#f2bba9"/>
    <path d="M32 112H1168M32 552H1168" stroke="#26313b" stroke-width="4"/>
    <rect x="1116" y="52" width="32" height="32" fill="#9cbdca" stroke="#26313b" stroke-width="4"/>
  </svg>`);
  const png = await sharp(background).composite([
    { input: label.data, left: 60, top: 58 },
    { input: logo, left: 72, top: 210 },
    { input: heading.data, left: 370, top: 170 },
    { input: summary.data, left: 370, top: 200 + heading.info.height },
    { input: footer.data, left: 60, top: 570 },
  ]).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
