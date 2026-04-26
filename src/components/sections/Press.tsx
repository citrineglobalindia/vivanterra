import Marquee from "../ui/Marquee";

const QUOTES = [
  { pub: "Wallpaper*", quote: "A studio of unusual restraint." },
  { pub: "Architectural Record", quote: "Quiet, exact, deeply considered." },
  { pub: "Monocle", quote: "Reshaping luxury for a slower decade." },
  { pub: "Financial Times", quote: "The most patient developer in the gulf." },
  { pub: "Domus", quote: "Material as a form of argument." },
  { pub: "Dezeen", quote: "Less is, once again, more — done properly." },
];

export default function Press() {
  return (
    <section id="press" className="bg-ink text-paper border-y border-line h-[200px] flex items-center">
      <Marquee speed={30}>
        {QUOTES.map((q, i) => (
          <div
            key={i}
            className="mx-4 flex items-center gap-3 rounded-full border border-line px-6 py-3 whitespace-nowrap"
          >
            <span className="font-display italic text-paper/90 text-[15px]">— {q.pub}</span>
            <span className="text-paper/40">·</span>
            <span className="text-[14px] text-paper/80">'{q.quote}'</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
