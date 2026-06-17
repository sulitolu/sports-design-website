"use client";

import { ReactLenis } from "lenis/react";
import { useMediaQuery } from "@/lib/use-media-query";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Touch devices use hardware-accelerated native scroll — Lenis on mobile
  // intercepts touch events on the JS thread, causing lag and dropped taps.
  const isTouch = useMediaQuery("(hover: none) and (pointer: coarse)");

  if (reducedMotion || isTouch) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}
