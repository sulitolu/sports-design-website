import { marquee } from "@/data/content";

const JP_PATTERN = /[　-ヿ㐀-鿿＀-￯]/;

function MarqueeItems({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 pr-8"
      aria-hidden={ariaHidden}
    >
      {marquee.items.map((item, i) => (
        <span key={i} className="flex items-center gap-8">
          <span
            className={`text-2xl font-semibold uppercase tracking-tight sm:text-4xl ${
              JP_PATTERN.test(item) ? "font-jp" : "font-display"
            }`}
          >
            {item}
          </span>
          <span
            className="block h-[9px] w-[9px] rotate-45 bg-accent"
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-line py-5 sm:py-7"
      aria-label={marquee.items.join(", ")}
    >
      <div className="flex w-max animate-marquee text-paper hover:[animation-play-state:paused] motion-reduce:animate-none">
        <MarqueeItems />
        <MarqueeItems ariaHidden />
      </div>
    </div>
  );
}
