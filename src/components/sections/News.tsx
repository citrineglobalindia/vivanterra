import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

const NEWS = [
  {
    date: "April 2026",
    title: "Inside the studio: a year of materials.",
    dek: "Our head of design walks through twelve months of stone, brass and oak.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "March 2026",
    title: "Sense of Space tops out in Sadashiva Nagar.",
    dek: "The first of our 2027 deliveries reaches its full height ahead of schedule.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "February 2026",
    title: "A conversation with our founding architect.",
    dek: "On patience, restraint and the future of Bengaluru's skyline.",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function News() {
  return (
    <section id="developments" className="bg-sand-soft text-ink py-24 md:py-[180px] section-glow">
      <div className="max-w-page container-x">
        <div className="mb-16 md:mb-24">
          <Reveal>
            <div className="eyebrow mb-6 text-ink/60">Newsroom — Latest</div>
          </Reveal>
          <SplitText
            as="h2"
            text="Stories from the studio."
            className="font-display text-ink"
            by="word"
          />
          <style>{`
            #developments h2.font-display { font-size: clamp(40px, 6vw, 88px); font-weight: 300; line-height: 1; letter-spacing: -0.02em; }
          `}</style>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {NEWS.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.1}>
              <article className="group cursor-pointer" data-cursor="hover">
                <div className="img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink/5 mb-6">
                  <img src={n.image} alt={n.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="eyebrow text-ink/60 mb-3">{n.date}</div>
                <h3 className="font-display mb-3" style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {n.title}
                </h3>
                <p className="text-[14px] text-muted-soft mb-5">{n.dek}</p>
                <Link to="/blogs" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] font-medium nav-link">
                  Read
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
