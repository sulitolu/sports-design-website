"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLoading } from "./loading-context";
import { hero } from "@/data/content";
import ScrollIndicator from "./scroll-indicator";
import { useMediaQuery } from "@/lib/use-media-query";
import { EASE_OUT } from "@/lib/motion";

export default function Hero() {
  const { loaded } = useLoading();
  const sectionRef = useRef<HTMLElement>(null);
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  // Normalized mouse -0.5 → +0.5 relative to section centre
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { damping: 28, stiffness: 100, mass: 0.9 });
  const my = useSpring(rawY, { damping: 28, stiffness: 100, mass: 0.9 });

  // Each layer gets a different multiplier → parallax depth
  const circlesX  = useTransform(mx, v => v * 20);
  const circlesY  = useTransform(my, v => v * 20);
  const sportsX   = useTransform(mx, v => v * 30);
  const sportsY   = useTransform(my, v => v * 22);
  const designX   = useTransform(mx, v => v * 55);
  const designY   = useTransform(my, v => v * 40);
  const japanX    = useTransform(mx, v => v * 80);
  const japanY    = useTransform(my, v => v * 58);
  const logoX     = useTransform(mx, v => v * 120);
  const logoY     = useTransform(my, v => v * 90);
  // 3-D tilt on the logo mark
  const rotateX   = useTransform(my, v => v * -22);
  const rotateY   = useTransform(mx, v => v *  22);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left  - rect.width  / 2) / rect.width);
    rawY.set((e.clientY - rect.top   - rect.height / 2) / rect.height);
  };
  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); };

  const parallax = (x: typeof logoX, y: typeof logoY) =>
    isFinePointer ? { x, y } : {};

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden border-b border-line bg-paper"
      onMouseMove={isFinePointer ? handleMouseMove : undefined}
      onMouseLeave={isFinePointer ? handleMouseLeave : undefined}
    >
      {/* ── Concentric rings — breathe & parallax (deepest layer) ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={parallax(circlesX, circlesY)}
      >
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {[200, 320, 450, 600, 780, 980].map((r, i) => (
            <motion.circle
              key={r}
              cx="50%"
              cy="55%"
              r={r}
              fill="none"
              stroke="rgb(244 243 239 / 0.055)"
              strokeWidth="1"
              animate={{ r: [r, r + 14, r] }}
              transition={{
                duration: 5 + i * 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* ── Top monogram ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 pt-8"
        initial={{ opacity: 0, y: -10 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
      >
        <Image
          src="/brand/icon.png"
          alt=""
          aria-hidden
          width={36}
          height={36}
          priority
          className="h-7 w-7 brightness-0 invert opacity-50 sm:h-9 sm:w-9"
        />
      </motion.div>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col items-center justify-start px-6 pt-28 pb-6 sm:px-10 sm:pt-36">

        {/* Text — three depth layers */}
        <div className="text-center">
          <h1 className="font-display uppercase leading-[0.88] tracking-[-0.04em]">
            <motion.span
              className="block text-[clamp(3rem,12vw,10rem)] font-light text-ink/40"
              style={parallax(sportsX, sportsY)}
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.12 }}
            >
              Sports
            </motion.span>
            <motion.span
              className="block text-[clamp(3rem,12vw,10rem)] font-extrabold text-ink"
              style={parallax(designX, designY)}
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.22 }}
            >
              Design
            </motion.span>
            <motion.span
              className="block text-[clamp(3rem,12vw,10rem)] font-extrabold text-accent"
              style={parallax(japanX, japanY)}
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.32 }}
            >
              Japan
            </motion.span>
          </h1>

          <motion.p
            className="mt-5 font-mono text-[10px] uppercase tracking-[0.35em] text-muted sm:text-xs"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.5 }}
          >
            映像制作 &nbsp;/&nbsp; アスリートブランディング
          </motion.p>
        </div>

        {/* Logo mark — closest layer, parallax + 3-D tilt */}
        <motion.div
          className="mt-10 sm:mt-14"
          style={
            isFinePointer
              ? { x: logoX, y: logoY, rotateX, rotateY, perspective: 700 }
              : {}
          }
          initial={{ opacity: 0, scale: 0.82 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: EASE_OUT, delay: 0.3 }}
          whileHover={{ scale: 1.06 }}
        >
          <Image
            src="/brand/icon-512.png"
            alt="Sports Design Japan"
            width={512}
            height={512}
            priority
            className="h-[clamp(150px,32vw,300px)] w-[clamp(150px,32vw,300px)] grayscale invert drop-shadow-[0_0_40px_rgba(0,70,255,0.25)]"
          />
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <motion.div
        className="relative z-10 flex flex-col gap-6 border-t border-line bg-ink px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-10"
        initial={{ opacity: 0, y: 12 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.65 }}
      >
        <p className="max-w-sm text-sm text-muted sm:text-base">
          {hero.tagline.en}
        </p>
        <ScrollIndicator label={hero.scrollLabel} />
      </motion.div>
    </section>
  );
}
