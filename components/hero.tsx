"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLoading } from "./loading-context";
import { hero } from "@/data/content";
import ScrollIndicator from "./scroll-indicator";
import { EASE_OUT } from "@/lib/motion";

const LINE_SIZES = "text-[clamp(3rem,12vw,10rem)]";

export default function Hero() {
  const { loaded } = useLoading();

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden border-b border-line bg-paper"
    >
      {/* Concentric circles — subtle cinematic texture behind the logo */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {[200, 320, 450, 600, 780, 980].map((r) => (
          <circle
            key={r}
            cx="50%"
            cy="55%"
            r={r}
            fill="none"
            stroke="rgb(244 243 239 / 0.04)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Top monogram — like LN's small logo above the name */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 pt-8"
        initial={{ opacity: 0, y: -8 }}
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
          className="h-7 w-7 brightness-0 invert opacity-60 sm:h-9 sm:w-9"
        />
      </motion.div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-start px-6 pt-28 pb-6 sm:px-10 sm:pt-36">

        {/* Mixed-weight name — "SPORTS" light, "DESIGN" bold, "JAPAN" accent */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 }}
        >
          <h1 className="font-display uppercase leading-[0.88] tracking-[-0.04em]">
            <span className={`block font-light text-ink/50 ${LINE_SIZES}`}>
              Sports
            </span>
            <span className={`block font-extrabold text-ink ${LINE_SIZES}`}>
              Design
            </span>
            <span className={`block font-extrabold text-accent ${LINE_SIZES}`}>
              Japan
            </span>
          </h1>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.35em] text-muted sm:text-xs">
            映像制作 &nbsp;/&nbsp; アスリートブランディング
          </p>
        </motion.div>

        {/* Large logo mark — the portrait equivalent */}
        <motion.div
          className="mt-10 sm:mt-14"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.3 }}
        >
          <Image
            src="/brand/icon-512.png"
            alt="Sports Design Japan"
            width={512}
            height={512}
            priority
            className="h-[clamp(150px,32vw,300px)] w-[clamp(150px,32vw,300px)] grayscale invert"
          />
        </motion.div>
      </div>

      {/* Bottom strip — cream bar with tagline + scroll */}
      <motion.div
        className="flex flex-col gap-6 border-t border-line bg-ink px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-10"
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
