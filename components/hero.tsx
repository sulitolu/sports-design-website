"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLoading } from "./loading-context";
import { hero } from "@/data/content";
import ScrollIndicator from "./scroll-indicator";
import { useMediaQuery } from "@/lib/use-media-query";
import { EASE_OUT } from "@/lib/motion";

// Cursor-reveal radius in CSS px
const REVEAL_R = 120;
// Off-screen default so the mask hides nothing at rest
const MASK_OFF = `radial-gradient(circle 0px at -9999px -9999px, transparent 0%, black 0%)`;

export default function Hero() {
  const { loaded } = useLoading();
  const sectionRef = useRef<HTMLElement>(null);
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  // ── Parallax spring setup ──────────────────────────────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { damping: 28, stiffness: 100, mass: 0.9 });
  const my = useSpring(rawY, { damping: 28, stiffness: 100, mass: 0.9 });

  const circlesX = useTransform(mx, v => v * 18);
  const circlesY = useTransform(my, v => v * 18);
  const sportsX  = useTransform(mx, v => v * 24);
  const sportsY  = useTransform(my, v => v * 18);
  const designX  = useTransform(mx, v => v * 44);
  const designY  = useTransform(my, v => v * 34);
  const japanX   = useTransform(mx, v => v * 64);
  const japanY   = useTransform(my, v => v * 48);
  const logoX    = useTransform(mx, v => v * 90);
  const logoY    = useTransform(my, v => v * 70);
  const rotateX  = useTransform(my, v => v * -18);
  const rotateY  = useTransform(mx, v => v *  18);

  const px = (x: typeof logoX, y: typeof logoY) =>
    isFinePointer ? { x, y } : {};

  // ── Refs to the top (mask) layer of each word ─────────────────────────────
  // We update these directly in the mouse handler — zero React re-renders.
  const sportsTopRef = useRef<HTMLSpanElement>(null);
  const designTopRef = useRef<HTMLSpanElement>(null);
  const japanTopRef  = useRef<HTMLSpanElement>(null);

  const applyMask = (
    ref: React.RefObject<HTMLSpanElement | null>,
    clientX: number,
    clientY: number,
  ) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // Soft edge: transparent centre → solid black at 65% of radius
    const mask = `radial-gradient(circle ${REVEAL_R}px at ${x}px ${y}px, transparent 0%, black 65%)`;
    el.style.webkitMaskImage = mask;
    el.style.maskImage = mask;
  };

  const resetMasks = () => {
    [sportsTopRef, designTopRef, japanTopRef].forEach(ref => {
      if (ref.current) {
        ref.current.style.webkitMaskImage = MASK_OFF;
        ref.current.style.maskImage = MASK_OFF;
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Parallax
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      rawX.set((e.clientX - rect.left  - rect.width  / 2) / rect.width);
      rawY.set((e.clientY - rect.top   - rect.height / 2) / rect.height);
    }
    // Text colour reveal
    applyMask(sportsTopRef, e.clientX, e.clientY);
    applyMask(designTopRef, e.clientX, e.clientY);
    applyMask(japanTopRef,  e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    resetMasks();
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden border-b border-line bg-ink"
      onMouseMove={isFinePointer ? handleMouseMove : undefined}
      onMouseLeave={isFinePointer ? handleMouseLeave : undefined}
    >
      {/* ── Concentric rings ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={px(circlesX, circlesY)}
      >
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {[180, 300, 440, 600, 780, 980].map((r, i) => (
            <motion.circle
              key={r} cx="50%" cy="50%"
              fill="none" stroke="rgb(13 13 16 / 0.06)" strokeWidth="1"
              initial={{ r }}
              animate={{ r: [r, r + 16, r] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* ── Top bar ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-8 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
        >
          <Image src="/brand/icon.png" alt="" aria-hidden width={32} height={32} priority className="h-7 w-7 opacity-40" />
        </motion.div>
        <motion.p
          className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted sm:text-[10px]"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
        >
          映像制作&nbsp;&nbsp;/&nbsp;&nbsp;Yokohama
        </motion.p>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 flex-col items-center justify-between px-4 pt-24 pb-6 sm:px-8 sm:pt-28">

        {/* Logo */}
        <motion.div
          className="mt-4 sm:mt-6"
          style={isFinePointer ? { x: logoX, y: logoY, rotateX, rotateY, perspective: 700 } : {}}
          initial={{ opacity: 0, scale: 0.78 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.1 }}
        >
          <Image
            src="/brand/icon-512.png" alt="Sports Design Japan"
            width={512} height={512} priority
            className="h-[clamp(100px,18vw,200px)] w-[clamp(100px,18vw,200px)] drop-shadow-[0_4px_32px_rgba(0,70,255,0.12)]"
          />
        </motion.div>

        {/* Type stack */}
        <div className="w-full text-center">
          <h1 className="font-display uppercase tracking-[-0.04em] leading-[0.82]">

            {/* ── SPORTS ── whisper → reveals accent blue ── */}
            <motion.div
              className="relative block"
              style={px(sportsX, sportsY)}
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.18 }}
            >
              {/* Reveal layer: accent blue */}
              <span aria-hidden className="pointer-events-none absolute inset-0 block text-[clamp(1.1rem,3.8vw,4rem)] font-light text-accent">
                Sports
              </span>
              {/* Original layer: pale, masked at cursor */}
              <span
                ref={sportsTopRef}
                className="relative block text-[clamp(1.1rem,3.8vw,4rem)] font-light text-paper/20"
                style={{ WebkitMaskImage: MASK_OFF, maskImage: MASK_OFF }}
              >
                Sports
              </span>
            </motion.div>

            {/* ── DESIGN ── dominant → reveals accent blue ── */}
            <motion.div
              className="relative block"
              style={px(designX, designY)}
              initial={{ opacity: 0, y: 32 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.26 }}
            >
              {/* Reveal layer: accent blue */}
              <span aria-hidden className="pointer-events-none absolute inset-0 block text-[clamp(4.5rem,22vw,22rem)] font-extrabold text-accent">
                Design
              </span>
              {/* Original layer: black, masked at cursor */}
              <span
                ref={designTopRef}
                className="relative block text-[clamp(4.5rem,22vw,22rem)] font-extrabold text-paper"
                style={{ WebkitMaskImage: MASK_OFF, maskImage: MASK_OFF }}
              >
                Design
              </span>
            </motion.div>

            {/* ── JAPAN ── accent blue → reveals cream (dissolves into bg) ── */}
            <motion.div
              className="relative block"
              style={px(japanX, japanY)}
              initial={{ opacity: 0, y: 24 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.34 }}
            >
              {/* Reveal layer: cream — letter appears to melt into background */}
              <span aria-hidden className="pointer-events-none absolute inset-0 block text-[clamp(2.5rem,9.5vw,9.5rem)] font-extrabold text-ink">
                Japan
              </span>
              {/* Original layer: blue, masked at cursor */}
              <span
                ref={japanTopRef}
                className="relative block text-[clamp(2.5rem,9.5vw,9.5rem)] font-extrabold text-accent"
                style={{ WebkitMaskImage: MASK_OFF, maskImage: MASK_OFF }}
              >
                Japan
              </span>
            </motion.div>

          </h1>

          <motion.p
            className="mt-5 font-mono text-[9px] uppercase tracking-[0.35em] text-muted sm:text-[11px]"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.52 }}
          >
            アスリートブランディング
          </motion.p>
        </div>

        <div />
      </div>

      {/* ── Bottom bar ── */}
      <motion.div
        className="relative z-30 flex flex-col gap-4 border-t border-line bg-ink px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10"
        initial={{ opacity: 0, y: 12 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.65 }}
      >
        <p className="max-w-xs text-sm text-muted sm:text-base">{hero.tagline.en}</p>
        <ScrollIndicator label={hero.scrollLabel} />
      </motion.div>
    </section>
  );
}
