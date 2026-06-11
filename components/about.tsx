import { about } from "@/data/content";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import CountUp from "./count-up";

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="grid gap-12 sm:grid-cols-12 sm:gap-8">
        <Reveal className="sm:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {about.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-tight text-paper sm:text-6xl">
            {about.heading.en}
            <span className="ml-4 align-middle font-jp text-lg font-normal text-muted">
              {about.heading.jp}
            </span>
          </h2>
        </Reveal>

        <Reveal className="flex flex-col gap-6 sm:col-span-8 sm:col-start-5">
          {about.body.map((paragraph, i) => (
            <p key={i} className="max-w-2xl text-base text-muted sm:text-lg">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>

      <RevealGroup className="mt-20 grid grid-cols-2 gap-8 border-t border-line pt-12 sm:mt-28 sm:grid-cols-4 sm:gap-12 sm:pt-16">
        {about.stats.map((stat) => (
          <RevealItem key={stat.label} className="flex flex-col gap-2">
            <p className="font-mono text-4xl font-semibold text-paper sm:text-6xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">
              {stat.label}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
