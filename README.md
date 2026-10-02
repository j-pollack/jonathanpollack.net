# Jonathan Pollack

A small static Astro site with the Workbench design: a home page, writing
archive, Markdown essays, and project windows. Plain CSS, no client JavaScript.

## Run locally

Use Node.js 24+ (Node 24 LTS recommended, matching Vercel).

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:4321).
Edits appear automatically while the development server is running.

## Make it yours

- Edit `src/pages/index.astro` for the introduction and current work.
- Edit `src/data/site.ts` for your GitHub profile and project list. Add `demo`
  and `source` URLs to a project when they are ready; without a demo URL,
  it displays “Coming soon.”
- Edit `src/styles/global.css` for the appearance.
- Add `.md` files under `src/pages/writing/`, following the existing essay’s frontmatter.
  They become pages and appear in `/writing/` automatically, newest first.
  The homepage features the latest essay. ISO dates use `YYYY-MM-DD`.
- Add `project: plant-the-flag` to a post’s frontmatter to connect it to that
  project. The archive, essay, and project page link to each other automatically.
- Plant the flag is linked at `https://ptf.jonathanpollack.net`.
  Tests discover posts automatically.
- Colors follow the reader’s light/dark preference. Fonts load from Google
  Fonts, with local fallbacks when unavailable.

## SEO and sharing

The production URL is configured in `astro.config.mjs`. Every page has a
canonical URL, description, Open Graph tags, and a large Twitter sharing card.
The sitemap is generated at build time and listed in `public/robots.txt`.

Each page gets a 1200×630 PNG built from its title and description, with the
JP monogram from `public/favicon.svg`. Static page metadata lives in
`src/data/site.ts`; essay cards use Markdown frontmatter. Adding or editing an
essay updates its card on the next build. The bundled Space Grotesk font is
from Google Fonts, under the included SIL Open Font License.

To give an essay a custom preview instead, put a PNG or JPEG in
`public/` and add these optional frontmatter fields:

```yaml
image: /my-essay-card.png
imageAlt: A short description of the preview image.
```

Other Astro pages can pass `image` and `imageAlt` directly to `Layout`.
The manually designed `public/sharing-card.png` remains available as an override.

## Check and build

```sh
npm run check
npm run preview
```

`npm run check` runs Astro/TypeScript diagnostics, builds the site, and tests
all pages, internal links, the archive, and companion-project connections.
Run `npm run lint` or `npm test` separately when useful. Build output goes to
`dist/`.

`npm install` installs the native pre-commit hook automatically. Existing
checkouts can run `npm run prepare` to enable it. Every commit runs the same
checks. GitHub Actions also runs them on pushes and pull requests, using
Node 24 and the committed lockfile.

Vercel can deploy this repository using its Astro preset; no adapter is needed
for static output. `vercel.json` sets `npm run check` as its build command,
so failed diagnostics, builds, or tests stop the deployment.

The connected Vercel project also requires the GitHub check named
`Lint, build, and test` before assigning a production deployment from `main`
to its live domains. This production-only Deployment Check is configured in
Vercel's project settings. Keep the job name stable, or update that setting
when renaming it. Preview deployments are not blocked by this check.
