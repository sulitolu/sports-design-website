"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { nav } from "@/data/content";
import { EASE_OUT } from "@/lib/motion";

const overlayVariants: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const linkListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  exit: { opacity: 0, y: 24, transition: { duration: 0.3, ease: EASE_OUT } },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label={nav.wordmark}
          >
            <Image
              src="/brand/icon-512.png"
              alt=""
              width={38}
              height={38}
              priority
              className="h-[34px] w-[34px] object-contain sm:h-[38px] sm:w-[38px]"
            />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[13px] font-extrabold uppercase tracking-[-0.01em] text-paper">
                {nav.wordmark}
              </span>
              <span className="mt-1 font-jp text-[9.5px] tracking-[0.18em] text-muted">
                {nav.wordmarkJp}
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <nav
              className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-paper"
              aria-label="Primary"
            >
              {nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group relative py-1 transition-colors hover:text-accent"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>
            <a
              href={nav.cta.href}
              className="inline-flex items-center bg-accent px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-paper"
            >
              {nav.cta.label}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              className="block h-px w-6 bg-paper"
              animate={
                open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }
              }
            />
            <motion.span
              className="block h-px w-6 bg-paper"
              animate={
                open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }
              }
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-ink md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          >
            <motion.nav
              className="flex flex-col items-center gap-6"
              variants={linkListVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Mobile"
            >
              {nav.links.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  variants={linkVariants}
                  className="font-display text-5xl font-extrabold uppercase tracking-[-0.04em] text-paper sm:text-6xl"
                >
                  {link.label}
                  <span className="ml-3 font-jp text-base font-normal text-muted">
                    {link.jp}
                  </span>
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
