# Sports Design Japan

A cinematic, awwwards-style marketing site for Sports Design Japan — a sports media and athlete branding studio founded by a professional rugby player.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Lenis smooth scroll.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
app/                  Routes, layout, global styles, metadata, OG image
components/           UI sections (hero, navbar, marquee, work, services, about, footer, etc.)
data/content.ts       All site copy, project data, nav links, stats — edit here first
lib/                   Shared animation easings/variants and the useMediaQuery hook
public/                Static assets (videos, photos, etc.) — currently empty
```

## Editing copy

Almost all text on the site — headings, taglines, nav labels, project list, services,
about copy, stats, and contact details — lives in `data/content.ts`. Update values
there and the whole site updates; you shouldn't need to touch component files for
copy changes.

## Swapping in real videos

- **Hero background video**: `components/hero.tsx` has a commented-out `<video>`
  block inside the "Background video placeholder" section. Drop your file at
  `public/video/hero-loop.mp4` (muted, looping, ~10s, compressed for web), then
  uncomment the `<video>` element and remove the gradient placeholder div above it.
- **Work cards**: `components/work-card.tsx` currently renders a colored gradient
  + grain texture per project. To use real footage/stills, replace the
  `motion.div` gradient background with an `<img>`/`<video>` (or
  `next/image`/`next/video`) sized to fill the `aspect-[4/3] sm:aspect-[21/9]`
  container, keeping the `grain-bg` overlay and parallax `style={{ y }}` for the
  same effect. Add a `media` field per project in `data/content.ts` to point at
  your asset paths.

## Swapping in real photos

Place images in `public/` (e.g. `public/images/...`) and reference them with
`next/image` for automatic optimization. Good candidates: work card thumbnails
(see above) and any future imagery in the About section.

## Updating contact details

Email, Instagram handle, and CTA copy are all in the `cta` export of
`data/content.ts`:

```ts
export const cta = {
  heading: "LET'S CREATE",
  ...
  email: "hello@sportsdesignjapan.com",
  instagram: "@sportsdesignjapan",
  ...
};
```

## Favicon & social preview

- `app/favicon.ico` is the browser tab icon — replace with your own `.ico`.
- `app/opengraph-image.tsx` generates the social share image (1200×630) at build
  time using `next/og`. Edit the JSX/styles there to match real branding, or
  replace the file with a static `opengraph-image.png` in `app/`.

## Accessibility & motion

The site respects `prefers-reduced-motion`: the preloader, smooth scroll, custom
cursor, scroll reveals, and counters all fall back to instant/no-animation states.
Focus styles, semantic landmarks, and alt text should be preserved when adding new
content or media.
