import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

const PILLARS = [
  {
    label: "Climate",
    text: "Three hundred and fifty days of pure light per year shape every facade we draw — from shading to material temperature.",
  },
  {
    label: "Connectivity",
    text: "Eight hours from London, four from Mumbai, two from Riyadh. A meeting place for the patient and the global.",
  },
  {
    label: "Culture",
    text: "A young city that takes craft seriously. Galleries, ateliers and a generation of collectors writing a new chapter.",
  },
];

export default function WhyCity() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["8%", "-8%"]);

  return (
    <section ref={ref} className="bg-paper text-ink py-24 md:py-[180px] overflow-hidden">
      <div className="max-w-page container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-6">
            <div className="img-zoom aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink/5">
              <motion.img
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=80"
                alt="Architectural tower against the sky"
                loading="lazy"
                className="h-[116%] w-full object-cover"
                style={{ y }}
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:pt-10">
            <Reveal>
              <div className="eyebrow mb-6 text-ink/60">Why this city</div>
            </Reveal>
            <SplitText
              as="h2"
              text="Why Dubai."
              className="font-display text-ink mb-12"
              by="word"
            />
            <style>{`
              section h2.font-display { font-size: clamp(40px, 6vw, 88px); font-weight: 300; line-height: 1; letter-spacing: -0.02em; }
            `}</style>

            <div className="space-y-10">
              {PILLARS.map((p, i) => (
                <Reveal key={p.label} delay={0.1 + i * 0.1}>
                  <div>
                    <div className="eyebrow text-ink/60 mb-3">{p.label}</div>
                    <p className="text-[16px] md:text-[17px] text-ink/85 leading-[1.6] max-w-[520px]">
                      {p.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
