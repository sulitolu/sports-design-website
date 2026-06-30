"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLoading } from "./loading-context";
import { hero } from "@/data/content";
import { EASE_OUT } from "@/lib/motion";

export default function Hero() {
  const { loaded } = useLoading();

  // Entrance is gated on the preloader finishing. Each element fades/rises in
  // on a small stagger. The global prefers-reduced-motion reset neutralizes
  // these, and framer-motion respects an empty `animate` until `loaded`.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: loaded ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  return (
    <section
      id="top"
      className="relative border-b border-line bg-ink"
      style={{ scrollMarginTop: 70 }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:min-h-[calc(100svh-67px)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Left: text column ── */}
        <div>
          {/* Eyebrow: live red dot + location */}
          <motion.div className="flex items-center gap-3" {...rise(0.05)}>
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-accent animate-blink"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted sm:text-[11px]">
              {hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline stack */}
          <h1
            className="mt-6 font-display tracking-[-0.04em]"
            style={{ lineHeight: 0.84 }}
          >
            <motion.span
              className="block font-light text-[clamp(1.6rem,3.4vw,2.9rem)]"
              style={{ color: "rgba(13,13,16,0.34)" }}
              {...rise(0.12)}
            >
              {hero.lines.sports}
            </motion.span>
            <motion.span
              className="block font-extrabold text-paper text-[clamp(3.4rem,7vw,6.4rem)]"
              {...rise(0.18)}
            >
              {hero.lines.design}
            </motion.span>
            <motion.span
              className="block font-extrabold text-accent text-[clamp(3.4rem,7vw,6.4rem)]"
              {...rise(0.24)}
            >
              {hero.lines.japan}
            </motion.span>
          </h1>

          {/* Lead — "inside the game" emphasized in near-black */}
          <motion.p
            className="mt-7 max-w-[30rem] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.55] text-muted"
            {...rise(0.32)}
          >
            {hero.lead.pre}
            <span className="font-semibold text-paper">
              {hero.lead.emphasis}
            </span>
            {hero.lead.post}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            {...rise(0.4)}
          >
            <a
              href={hero.ctas.primary.href}
              className="group inline-flex items-center gap-2 bg-paper px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-accent"
            >
              {hero.ctas.primary.label}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={hero.ctas.secondary.href}
              className="inline-flex items-center border border-line-strong px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {hero.ctas.secondary.label}
            </a>
          </motion.div>
        </div>

        {/* ── Right: cinematic media card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
        >
          <div className="relative aspect-[4/5] w-full">
            {/* Clipped media layer — the diagonal cut + a drop-shadow that
                follows the clipped silhouette (box-shadow would square it off). */}
            <div
              data-cursor="view"
              className="absolute inset-0 overflow-hidden bg-paper"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 94%, 0 100%)",
                filter: "drop-shadow(0 26px 44px rgba(13,13,16,0.42))",
              }}
            >
              <Image
                src={hero.media.poster}
                alt={hero.media.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
              {/* Bottom darkening gradient so overlay text reads */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-paper/80 via-paper/10 to-transparent"
              />

              {/* REC timecode (top-left) */}
              <div className="absolute left-5 top-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-accent animate-blink"
                />
                {hero.media.rec}&nbsp;&nbsp;{hero.media.timecode}
              </div>

              {/* Play disc (center) */}
              <div className="absolute left-1/2 top-1/2 flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/95 shadow-xl">
                <span
                  aria-hidden
                  className="ml-1.5 block h-0 w-0 border-y-[11px] border-l-[17px] border-y-transparent border-l-paper"
                />
              </div>

              {/* Caption (bottom-left) */}
              <div className="absolute bottom-7 left-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70">
                  {hero.media.kicker}
                </p>
                <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-ink">
                  {hero.media.title}
                </p>
              </div>
            </div>

            {/* Red corner tab — lives outside the clipped layer so the diagonal
                cut doesn't remove it; it nests into the cut bottom-right corner. */}
            <div className="absolute bottom-0 right-0 bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
              {hero.media.tab}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Below-grid meta row ── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:px-10">
        <span className="font-jp">{hero.branding}</span>
        <span>{hero.scrollLabel} —</span>
      </div>
    </section>
  );
}
