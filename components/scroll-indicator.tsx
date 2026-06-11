"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ScrollIndicator({ label }: { label: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted">
      <span>{label}</span>
      <motion.span
        aria-hidden="true"
        className="block h-8 w-px bg-line-strong"
        animate={reducedMotion ? undefined : { scaleY: [0.2, 1, 0.2] }}
        style={{ transformOrigin: "top" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
