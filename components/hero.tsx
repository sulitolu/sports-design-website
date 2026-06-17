"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useLoading } from "./loading-context";
import { hero } from "@/data/content";
import ScrollIndicator from "./scroll-indicator";
import { EASE_OUT } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";

const lineVariants: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1.1, ease: EASE_OUT, delay: 0.15 + i * 0.1 },
  }),
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.7 },
  },
};

export default function Hero() {
  const { loaded } = useLoading();
  const animate = loaded ? "visible" : "hidden";
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden border-b border-line"
    >
      <div className="absolute inset-0 -z-10 clip-diagonal">
        {reducedMotion ? (
          <Image
            src="/images/hero-poster.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-poster.jpg"
            className="h-full w-full object-cover"
          >
            <source src="/video/hero-loop.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/0 via-paper/10 to-paper/60" />
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 pt-36 sm:px-10">
        <h1 className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.04em] text-ink">
          {hero.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(3rem,15vw,13rem)]"
                custom={i}
                initial="hidden"
                animate={animate}
                variants={lineVariants}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      <motion.div
        className="flex flex-col gap-6 border-t border-line bg-ink px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-10"
        initial="hidden"
        animate={animate}
        variants={fadeVariants}
      >
        <p className="max-w-sm text-sm text-muted sm:text-base">
          {hero.tagline.en}
          <br />
          <span className="font-jp text-xs text-muted">
            {hero.tagline.jp}
          </span>
        </p>
        <ScrollIndicator label={hero.scrollLabel} />
      </motion.div>
    </section>
  );
}
