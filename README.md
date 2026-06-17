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

- **Hero background video**: `components/hero.tsx` renders
  `public/video/hero-loop.mp4` (muted, looping, ~10s, sourced from training
  footage) with `public/images/hero-poster.jpg` as the poster frame and the
  reduced-motion fallback. To swap in a different clip, drop a new file at
  `public/video/hero-loop.mp4` and re-extract a poster frame, e.g.:

  ```bash
  ffmpeg -i input.mp4 -an -t 10 -c:v libx264 -crf 23 -preset slow \
    -movflags +faststart public/video/hero-loop.mp4
  ffmpeg -i public/video/hero-loop.mp4 -frames:v 1 -q:v 2 \
    public/images/hero-poster.jpg
  ```

  Other downloaded candidate clips (if any) live in
  `media-source/instagram/` (gitignored) — re-run the commands above against
  a different source file to try another clip.
- **Work cards**: `components/work-card.tsx` shows a static poster image by
  default for any project with a `media: { video, poster }` field in
  `data/content.ts` — four of the six projects currently point at clips in
  `public/video/work-*.mp4` / `public/images/work-*-poster.jpg`. The video
  (`preload="metadata"` only, so the full clip isn't fetched upfront) plays on
  hover on devices with a mouse, or while the card is scrolled into view on
  touch devices, and pauses otherwise. Projects without a `media` field fall
  back to the colored gradient + grain texture. To swap or add footage,
  process a source clip the same way as the hero loop:

  ```bash
  ffmpeg -ss <start> -i input.mp4 -an -t 10 -c:v libx264 -crf 23 -preset slow \
    -movflags +faststart public/video/work-<name>.mp4
  ffmpeg -ss 2 -i public/video/work-<name>.mp4 -frames:v 1 -q:v 2 \
    public/images/work-<name>-poster.jpg
  ```

  Add `transpose=2` (or `transpose=1`, depending on source) to the `-vf` filter
  if a source clip was recorded sideways. Then add the matching `media` object
  to the project in `data/content.ts`.

## Swapping in real photos

Place images in `public/` (e.g. `public/images/...`) and reference them with
`next/image` for automatic optimization. Good candidates: work card thumbnails
(see above) and any future imagery in the About section.

- **Athletes section**: `components/athletes.tsx` renders a grid of player
  portraits from `athletes.roster` in `data/content.ts`, each with a
  `{ name, position, photo }` entry pointing at
  `public/images/athletes/athlete-0N.jpg`. The current roster (5 NEC Green
  Rockets players) uses placeholder names (`Player 01`–`05`) and
  `"Position TBD"` — update these fields with real names and rugby positions
  (prop, lock, hooker, etc.) once available. Source portraits were resized to
  800px wide with:

  ```bash
  ffmpeg -i input.jpg -vf "scale=800:-1" -q:v 3 public/images/athletes/athlete-0N.jpg
  ```

## Updating contact details

Email, Instagram handle, and CTA copy are all in the `cta` export of
`data/content.ts`:

```ts
export const cta = {
  heading: "LET'S CREATE",
  ...
  email: "hello@sportsdesignjapan.com",
  instagram: { handle: "@sports_designjp", url: "https://instagram.com/sports_designjp" },
  ...
};
```

## Brand assets

`public/brand/` holds the processed logo:

- `logo.png` — original source artwork (cream background).
- `icon.png` / `icon-512.png` — circular play-button mark with the
  background removed, used in the navbar and footer.
- `wordmark-dark.png` / `lockup-dark.png` — the "SPORTS DESIGN JAPAN"
  wordmark recolored to off-white with transparent letterforms, and a
  combined icon + wordmark lockup, available for future use (e.g. the
  preloader or a larger hero lockup).

`app/favicon.ico` and `app/apple-icon.png` are generated from `icon.png`. To
update the branding, replace `public/brand/logo.png` and regenerate these
derived assets.

## Favicon & social preview

- `app/favicon.ico` and `app/apple-icon.png` are generated from the brand icon
  — replace with your own if the branding changes.
- `app/opengraph-image.tsx` generates the social share image (1200×630) at build
  time using `next/og`, embedding `public/brand/icon-512.png`. Edit the
  JSX/styles there to match real branding, or replace the file with a static
  `opengraph-image.png` in `app/`.

## Accessibility & motion

The site respects `prefers-reduced-motion`: the preloader, smooth scroll, custom
cursor, scroll reveals, and counters all fall back to instant/no-animation states.
Focus styles, semantic landmarks, and alt text should be preserved when adding new
content or media.
