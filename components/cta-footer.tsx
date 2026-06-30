"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { cta, site } from "@/data/content";
import { Reveal } from "./reveal";

export default function CtaFooter() {
  const lenis = useLenis();

  const handleBackToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="border-t border-line-dark bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
        <Reveal>
          <h2 className="font-display font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-ink">
            <span className="block text-[clamp(2.75rem,13vw,11rem)]">
              {cta.heading.en}
            </span>
            <span className="mt-2 block font-jp text-[clamp(1.25rem,5vw,3rem)] font-medium text-accent">
              {cta.heading.jp}
            </span>
          </h2>
        </Reveal>

        <Reveal className="mt-12 flex flex-col gap-10 sm:mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <p className="max-w-sm text-sm text-muted-dark sm:text-base">
              {cta.body}
            </p>
            <a
              href={`mailto:${cta.email}`}
              className="group inline-flex w-fit flex-col font-mono text-lg text-ink sm:text-2xl"
            >
              {cta.email}
              <span className="mt-1 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          </div>

          <div className="flex flex-col items-start gap-8 sm:items-end">
            <a
              href={cta.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit flex-col font-mono text-sm uppercase tracking-[0.2em] text-ink sm:text-base"
            >
              {cta.instagram.handle}
              <span className="mt-1 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </a>

            <button
              type="button"
              onClick={handleBackToTop}
              className="group flex flex-col items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-dark transition-colors hover:text-accent"
            >
              <span
                aria-hidden="true"
                className="block h-8 w-px bg-line-dark transition-colors group-hover:bg-accent"
              />
              {cta.backToTop}
            </button>
          </div>
        </Reveal>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-dark px-6 py-6 sm:px-10">
        <Image
          src="/brand/icon-512.png"
          alt=""
          width={26}
          height={26}
          className="h-6 w-6 shrink-0 object-contain sm:h-[26px] sm:w-[26px]"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-dark">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
