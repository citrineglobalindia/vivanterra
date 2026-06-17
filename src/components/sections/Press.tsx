import { motion } from "framer-motion";
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
    <section
      id="press"
      className="bg-ink text-paper border-y border-line/40 py-7 md:py-9"
    >
      <div className="max-w-page container-x mb-4 md:mb-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gold/60" />
          <span className="eyebrow text-paper">In the press</span>
        </motion.div>
      </div>

      <Marquee speed={28}>
        {QUOTES.map((q, i) => (
          <div
            key={i}
            className="mx-2.5 inline-flex items-center gap-2.5 rounded-full border border-line/60 px-4 py-2 whitespace-nowrap"
          >
            <span className="font-display italic text-paper/90 text-[13px] md:text-[14px]">
              — {q.pub}
            </span>
            <span className="text-gold/60">·</span>
            <span className="text-[12.5px] md:text-[13.5px] text-paper/75">
              '{q.quote}'
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
