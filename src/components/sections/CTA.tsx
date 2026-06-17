import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../ui/Reveal";
import Magnetic from "../ui/Magnetic";

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="bg-ink text-paper py-24 md:py-[160px] relative overflow-hidden">
      {/* Gold ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[100vh]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,165,115,0.12) 0%, rgba(196,165,115,0.04) 40%, rgba(14,14,16,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="max-w-page container-x relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 relative">
          {/* Gold divider on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: "var(--gold)", opacity: 0.55 }} aria-hidden="true" />

          {/* Newsletter */}
          <div className="lg:pr-16">
            <Reveal>
              <div className="eyebrow text-paper mb-6">Correspondence</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display mb-10" style={{ fontSize: "clamp(40px, 5.5vw, 84px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
                Stay in <span className="italic text-gold">correspondence.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              {submitted ? (
                <p className="text-paper/80 text-[15px] py-6">
                  Thank you. We will write to you with our next chapter.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="flex items-end gap-4 max-w-md">
                  <div className="flex-1">
                    <label htmlFor="email" className="eyebrow text-paper mb-2 block">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@studio.com"
                      className="w-full bg-transparent border-b border-paper/30 pb-3 text-[16px] outline-none focus:border-paper transition-colors placeholder:text-paper/30"
                    />
                  </div>
                  <Magnetic className="inline-block shrink-0">
                    <button type="submit" className="btn btn-light shrink-0">
                      Subscribe
                      <ArrowUpRight className="btn-arrow" size={16} />
                    </button>
                  </Magnetic>
                </form>
              )}
            </Reveal>
          </div>

          {/* Visit */}
          <div className="lg:pl-16">
            <Reveal>
              <div className="eyebrow text-paper mb-6">In Person</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display mb-10" style={{ fontSize: "clamp(40px, 5.5vw, 84px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
                Or visit us <span className="italic text-gold">in private.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-3 text-paper/85 text-[15px] mb-10">
                <p>4th Floor, Cassini Towers, 13th Cross Rd,<br/>Sadashiva Nagar, Bengaluru 560080</p>
                <p>+91 88675 89797</p>
                <p>hello@vivanterra.in</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <Magnetic className="inline-block">
                <a href="#footer" className="btn btn-light">
                  Book a viewing
                  <ArrowUpRight className="btn-arrow" size={16} />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
