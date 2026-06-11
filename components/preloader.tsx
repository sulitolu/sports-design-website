"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useLoading } from "./loading-context";
import { useMediaQuery } from "@/lib/use-media-query";
import { EASE_CURTAIN } from "@/lib/motion";
import { nav } from "@/data/content";

export default function Preloader() {
  const { setLoaded } = useLoading();
  const lenis = useLenis();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  const displayCount = reducedMotion ? 100 : count;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    lenis?.stop();

    if (reducedMotion) {
      const timeout = setTimeout(() => setExiting(true), 100);
      return () => clearTimeout(timeout);
    }

    const duration = 1800;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setExiting(true), 250);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, lenis]);

  if (hidden) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-ink"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={
        exiting
          ? { clipPath: "inset(0% 0% 100% 0%)" }
          : { clipPath: "inset(0% 0% 0% 0%)" }
      }
      transition={{ duration: reducedMotion ? 0.3 : 1, ease: EASE_CURTAIN }}
      onAnimationComplete={() => {
        if (!exiting) return;
        setHidden(true);
        setLoaded(true);
        document.body.style.overflow = "";
        lenis?.start();
      }}
    >
      <p className="font-display text-xs font-semibold tracking-[0.4em] text-paper sm:text-sm">
        {nav.shortmark} — {nav.wordmark}
      </p>
      <p className="font-mono text-[20vw] leading-none text-paper sm:text-[10vw]">
        {String(displayCount).padStart(3, "0")}
      </p>
      <div className="absolute bottom-12 h-px w-1/2 max-w-xs bg-line">
        <div
          className="h-full bg-accent"
          style={{ width: `${displayCount}%` }}
        />
      </div>
    </motion.div>
  );
}
