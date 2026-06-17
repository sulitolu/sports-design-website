"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { useLoading } from "./loading-context";
import { hero } from "@/data/content";
import ScrollIndicator from "./scroll-indicator";
import { useMediaQuery } from "@/lib/use-media-query";
import { EASE_OUT } from "@/lib/motion";

const REVEAL_RADIUS = 160;
// Match --color-paper (#0d0d10) at 95% opacity so the logo barely bleeds
// through the overlay — hinting that something is hidden beneath.
const OVERLAY_COLOR = "rgba(13,13,16,0.95)";

export default function Hero() {
  const { loaded } = useLoading();
  const sectionRef = useRef<HTMLElement>(null);
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  // Start off-screen so the overlay is fully opaque on mount
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, { damping: 22, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 22, stiffness: 200 });

  // Radial gradient with transparent hole at cursor — reveals logo beneath
  const overlayBackground = useTransform(
    [springX, springY] as MotionValue[],
    ([x, y]: number[]) =>
      `radial-gradient(circle ${REVEAL_RADIUS}px at ${x}px ${y}px, transparent 0%, transparent ${REVEAL_RADIUS - 1}px, ${OVERLAY_COLOR} ${REVEAL_RADIUS}px)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden border-b border-line bg-paper"
      onMouseMove={isFinePointer ? handleMouseMove : undefined}
      onMouseLeave={isFinePointer ? handleMouseLeave : undefined}
    >
      {/* Logo — revealed by cursor on desktop, always visible on mobile */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-8 pt-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.1 }}
        >
          <Image
            src="/brand/icon-512.png"
            alt="Sports Design Japan"
            width={512}
            height={512}
            priority
            className="h-[clamp(180px,40vw,420px)] w-[clamp(180px,40vw,420px)] brightness-0 invert"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.45 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <Image
            src="/brand/wordmark-dark.png"
            alt="Sports Design Japan"
            width={600}
            height={60}
            className="h-auto w-[clamp(200px,45vw,460px)] object-contain"
          />
          <span className="font-jp text-sm text-muted">
            {hero.tagline.jp}
          </span>
        </motion.div>
      </div>

      {/* Overlay with cursor-shaped hole — desktop only */}
      {isFinePointer && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: overlayBackground }}
        />
      )}

      {/* Bottom bar — z-10 to stay above the overlay */}
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
