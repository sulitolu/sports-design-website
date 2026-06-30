"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { WorkProject } from "@/data/content";
import { useMediaQuery } from "@/lib/use-media-query";

// Dark-section placeholders shown only when a project has no media.
const GRADIENTS = [
  "from-[#1b1d24] via-paper to-paper",
  "from-[#24272f] via-paper to-paper",
  "from-[#E20D1B]/15 via-paper to-paper",
  "from-[#1c1f26] via-paper to-paper",
  "from-[#262932] via-paper to-paper",
  "from-[#15171d] via-paper to-paper",
];

export default function WorkCard({
  project,
  index,
}: {
  project: WorkProject;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isTouch = useMediaQuery("(hover: none) and (pointer: coarse)");
  const canHover = useMediaQuery("(hover: hover)");
  const isInView = useInView(ref, { amount: 0.5 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  // Disable parallax on touch — scroll listeners run on JS thread and cause lag.
  const y = reducedMotion || isTouch ? "0%" : yRaw;
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldPlay = !reducedMotion && (canHover ? isHovering : isInView);
  const { media } = project;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <article ref={ref} className="group border-t border-line-dark py-8 sm:py-12">
      <div
        data-cursor="view"
        className="relative aspect-[4/3] overflow-hidden clip-diagonal bg-ink sm:aspect-[21/9]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          className="absolute inset-x-0 -top-[10%] -bottom-[10%] overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ y }}
        >
          {media ? (
            reducedMotion ? (
              <Image src={media.poster} alt="" fill className="object-cover" />
            ) : (
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="metadata"
                poster={media.poster}
                className="h-full w-full object-cover"
              >
                <source src={media.video} type="video/mp4" />
              </video>
            )
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}
            />
          )}
        </motion.div>
        {media && (
          <div className="absolute inset-0 bg-gradient-to-b from-paper/50 via-transparent to-paper/30" />
        )}
        <div className="absolute left-4 top-4 font-mono text-xs tracking-widest text-ink/70 sm:left-6 sm:top-6">
          {project.timecode}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-ink sm:text-5xl">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-muted-dark">{project.client}</p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-dark">
          <span>{project.category}</span>
          <span className="text-accent">{project.year}</span>
        </div>
      </div>
    </article>
  );
}
