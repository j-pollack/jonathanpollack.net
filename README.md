# Jonathan Pollack

A small static Astro site, with Markdown writing and plain CSS.

## Run locally

Use Node.js 22.12+ (an even-numbered release).

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:4321).
Edits appear automatically while the development server is running.

## Make it yours

- Edit `src/pages/index.astro` for the introduction and project links.
- Edit `src/styles/global.css` for the appearance.
- Add `.md` files under `src/pages/writing/`, following the sample’s frontmatter.
  They become pages and appear on the homepage automatically, newest first.
- The sample essay is placeholder content; replace or delete it before publishing.

## Check and build

```sh
npm test
npm run preview
```

`npm test` builds the site and checks the sample pages. Update the smoke check
when replacing the sample essay. Build output goes to `dist/`.

Vercel can deploy this repository using its Astro preset; no adapter is needed
for static output.
