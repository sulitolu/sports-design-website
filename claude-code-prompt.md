# Claude Code Prompt — Sports Design Japan Website

Copy everything below this line and paste it into Claude Code as your first message.

---

Build a premium, awwwards-caliber marketing website for my sports media agency. Work autonomously: scaffold the project, build every section, then run the build and fix all errors before finishing.

## The business

**Sports Design Japan** — a sports media and athlete branding agency based in Japan, founded by a professional rugby player. We create cinematic short-form video, athlete personal branding, and social content for teams, athletes, and sports brands in the Japanese market. Clients include professional rugby organizations (Japan Rugby League One). Shot on Sony cinema gear, edited in Adobe Premiere/After Effects. The brand voice is confident, athletic, and bilingual (English-first with Japanese accents).

## Tech stack

- Next.js 14+ (App Router) with TypeScript
- Tailwind CSS
- Framer Motion for all animation
- Lenis for smooth scrolling
- next/font for fonts (no external font CDN links)
- No CMS for now — content lives in a single `data/content.ts` file so I can edit copy easily

## Design direction — premium / awwwards style

This must NOT look like a template. Target the level of sites featured on awwwards: bold typography-driven layout, generous negative space, orchestrated motion, and one or two signature moments.

**Typography**
- Display/headings: **Poppins Bold (700) and ExtraBold (800)**, tight letter-spacing (-0.02em to -0.04em), set very large. Hero headline should fill the viewport width (use clamp() or viewport units, e.g. 9–13vw).
- Body: Poppins Regular/Medium at comfortable sizes.
- Japanese accents: Noto Sans JP for short bilingual labels (e.g. "WORK / 制作実績", "CONTACT / お問い合わせ").
- Utility labels and stats: a monospace font (IBM Plex Mono) styled like video timecodes — this is a film-production agency, so timecode motifs (00:00:00:00) are an authentic detail.

**Color**
- Near-black ink background: #0A0A0B
- Off-white text: #F5F5F2
- One accent only: electric red-orange #FF3B1F (used sparingly — hover states, the cursor, one highlighted word per section)
- Subtle gray for secondary text: #8A8A8E
- Thin 1px borders at 10–14% white opacity for grid lines

**Signature awwwards-style elements (build all of these)**
1. **Preloader**: brief loading screen — counter from 0 to 100 with the wordmark, then a smooth curtain/clip-path reveal into the hero.
2. **Hero**: full-viewport. Oversized stacked wordmark "SPORTS DESIGN JAPAN" in Poppins ExtraBold, each line animating up with staggered reveal (clip-path or y-translate). A looping muted background video placeholder (use a dark gradient + grain overlay div as the placeholder, with a clearly marked spot to drop in an .mp4 later). Small bilingual tagline and a scroll indicator.
3. **Marquee ticker**: infinite horizontal scrolling strip — "ATHLETE BRANDING — CINEMATIC FILM — SOCIAL CONTENT — 映像制作 —" repeating, pausing on hover.
4. **Custom cursor**: small dot that scales into a circle with "VIEW" text when hovering work items. Disable on touch devices.
5. **Scroll animations**: every section reveals on scroll (fade + y-translate, staggered children). Use Framer Motion `whileInView` with `once: true`.
6. **Selected Work**: large image/video cards with parallax on scroll and hover zoom. 4–6 placeholder projects (e.g. "Match Day Cinematic — NEC Green Rockets", "Athlete Brand Film", "Season Hype Reel", "Social Series — 30 Days of Training"). Each card shows title, category, year, and a timecode-style label.
7. **Services section**: three services — 01 Cinematic Film (match day films, hype reels, brand films), 02 Athlete Branding (personal brand strategy, content systems, social identity), 03 Social Content (short-form vertical video, season-long content packages). Each row expands or reveals detail on hover/click.
8. **About section**: founder story — a professional rugby player who builds media from inside the game, with athlete-level access and understanding teams can't get from outside agencies. Include 3–4 big stat counters that count up on scroll (e.g. years in pro rugby, videos delivered, total views).
9. **Big CTA footer**: huge "LET'S CREATE / 一緒に作りましょう" headline, email link with underline hover animation, Instagram link (@sportsdesignjapan), and a back-to-top button.

**Pages**
- Single landing page (`/`) with all sections above and anchor navigation
- Sticky minimal navbar: wordmark left, links right (Work, Services, About, Contact), hamburger full-screen overlay menu on mobile with staggered link animation

## Quality bar

- Fully responsive down to 375px — the giant typography must scale gracefully
- Respect `prefers-reduced-motion`: disable heavy animation when set
- Visible keyboard focus states; semantic HTML; alt text on all images
- Lighthouse-friendly: lazy-load below-the-fold media, no layout shift on font load (`display: swap`)
- Metadata: proper title/description, Open Graph tags, favicon placeholder
- Keep all copy in `data/content.ts` with both EN strings and short JP label strings

## Process

1. Scaffold with `create-next-app` (TypeScript + Tailwind + App Router)
2. Install framer-motion and lenis
3. Build the layout, fonts, and design tokens first, then sections in order
4. Run `npm run build` and fix every error/warning before declaring done
5. Finish with a short README explaining where to swap in real videos, photos, and contact email

Ask me zero questions — make confident decisions and build the whole thing.
