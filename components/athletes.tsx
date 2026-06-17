import Image from "next/image";
import { athletes } from "@/data/content";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

export default function Athletes() {
  return (
    <section
      id="athletes"
      className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32"
    >
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {athletes.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-5xl font-extrabold uppercase tracking-[-0.04em] leading-[0.95] text-paper sm:text-7xl lg:text-8xl">
            {athletes.heading.en}
            <span className="ml-4 align-middle font-jp text-lg font-normal text-muted">
              {athletes.heading.jp}
            </span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted sm:text-base">
          {athletes.intro}
        </p>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
        {athletes.roster.map((athlete) => (
          <RevealItem key={athlete.name}>
            <div className="group relative aspect-[1000/1777] overflow-hidden rounded-sm bg-ink">
              <Image
                src={athlete.photo}
                alt={`${athlete.name} — ${athlete.position}, NEC Green Rockets`}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <div className="mt-4">
              <p className="font-display text-lg font-bold uppercase tracking-tight text-paper">
                {athlete.name}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {athlete.position}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
