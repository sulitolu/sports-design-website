"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { WorkProject } from "@/data/content";

const GRADIENTS = [
  "from-[#3a1f1a] via-ink to-ink",
  "from-[#1a2a3a] via-ink to-ink",
  "from-[#2a1a3a] via-ink to-ink",
  "from-[#1a3a2a] via-ink to-ink",
  "from-[#3a2a1a] via-ink to-ink",
  "from-[#1a1a3a] via-ink to-ink",
];

export default function WorkCard({
  project,
  index,
}: {
  project: WorkProject;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <article ref={ref} className="group border-t border-line py-8 sm:py-12">
      <div
        data-cursor="view"
        className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink sm:aspect-[21/9]"
      >
        <motion.div
          className={`absolute inset-x-0 -top-[10%] -bottom-[10%] bg-gradient-to-br ${
            GRADIENTS[index % GRADIENTS.length]
          } transition-transform duration-700 ease-out group-hover:scale-105`}
          style={{ y }}
        />
        <div className="grain-bg absolute inset-0 opacity-25 mix-blend-overlay" />
        <div className="absolute left-4 top-4 font-mono text-xs tracking-widest text-paper/70 sm:left-6 sm:top-6">
          {project.timecode}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-paper sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{project.client}</p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span>{project.category}</span>
          <span className="text-accent">{project.year}</span>
        </div>
      </div>
    </article>
  );
}
