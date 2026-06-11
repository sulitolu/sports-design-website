"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

/** Fades and slides children up into view once, when scrolled into the viewport. */
export function Reveal({ children, variants, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants ?? fadeUp}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Wraps children that use `fadeUp`, staggering their reveal. */
export function RevealGroup({ children, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A single item inside a `RevealGroup` — inherits the stagger timing from its parent. */
export function RevealItem({ children, variants, ...props }: RevealProps) {
  return (
    <motion.div variants={variants ?? fadeUp} {...props}>
      {children}
    </motion.div>
  );
}
