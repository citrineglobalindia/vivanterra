import { motion } from "framer-motion";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

/** Editable list — swap with real partner SVGs later. */
const PARTNERS = ["Logo 01", "Logo 02", "Logo 03", "Logo 04", "Logo 05", "Logo 06"];

export default function Collaborations() {
  return (
    <section className="bg-ink text-paper py-24 md:py-[180px]">
      <div className="max-w-page container-x">
        <Reveal>
          <div className="eyebrow text-paper/60 mb-6">Curated Collaborations</div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <SplitText
              as="h2"
              text="We work with houses that share our standards."
              className="font-display"
              by="word"
            />
            <style>{`
              section h2.font-display { font-size: clamp(36px, 5vw, 72px); font-weight: 300; line-height: 1.05; }
            `}</style>
          </div>
          <div className="md:col-span-5 md:pt-3">
            <Reveal delay={0.15}>
              <p className="text-paper/75 max-w-[480px] text-[15px] leading-[1.7]">
                Each Vivanterra residence is shaped in dialogue with a small circle
                of ateliers, fabricators and design studios we have known for years.
                We choose partners for the same reasons we choose materials:
                quiet conviction, precise craft, and a refusal to take shortcuts
                where the eye, the hand or the light might one day find them.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 md:mt-28 hairline" />

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-6 items-center justify-items-center">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p}
              className="font-display italic text-paper/70 text-xl md:text-2xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {p}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
