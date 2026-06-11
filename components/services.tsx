"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/data/content";
import { Reveal } from "./reveal";
import { EASE_OUT } from "@/lib/motion";

export default function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="services"
      className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32"
    >
      <Reveal>
        <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight text-paper sm:text-6xl">
          {services.heading.en}
          <span className="ml-4 align-middle font-jp text-lg font-normal text-muted">
            {services.heading.jp}
          </span>
        </h2>
      </Reveal>

      <div className="mt-12 border-t border-line sm:mt-16">
        {services.items.map((service, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={service.index} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-6 py-8 text-left sm:gap-12 sm:py-12"
              >
                <span className="font-mono text-sm text-accent sm:text-base">
                  {service.index}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-2xl font-bold uppercase tracking-tight text-paper sm:text-5xl">
                    {service.title}
                  </span>
                  <span className="mt-1 block font-jp text-sm text-muted">
                    {service.jp}
                  </span>
                </span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="font-display text-3xl font-light text-paper sm:text-4xl"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-8 sm:grid-cols-2 sm:gap-12 sm:py-2 sm:pb-12 sm:pl-20">
                      <p className="max-w-md text-sm text-muted sm:text-base">
                        {service.summary}
                      </p>
                      <ul className="flex flex-col gap-2 font-mono text-xs uppercase tracking-[0.15em] text-paper sm:text-sm">
                        {service.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-3">
                            <span
                              className="h-px w-4 bg-accent"
                              aria-hidden="true"
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
