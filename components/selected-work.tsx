import { work } from "@/data/content";
import { Reveal } from "./reveal";
import WorkCard from "./work-card";

export default function SelectedWork() {
  return (
    <section
      id="work"
      className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32"
    >
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-5xl font-extrabold uppercase tracking-[-0.04em] leading-[0.95] text-paper sm:text-7xl lg:text-8xl">
          {work.heading.en}
          <span className="ml-4 align-middle font-jp text-lg font-normal text-muted">
            {work.heading.jp}
          </span>
        </h2>
        <p className="max-w-sm text-sm text-muted sm:text-base">
          {work.intro}
        </p>
      </Reveal>

      <div className="mt-12 sm:mt-16">
        {work.projects.map((project, i) => (
          <Reveal key={project.title}>
            <WorkCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
