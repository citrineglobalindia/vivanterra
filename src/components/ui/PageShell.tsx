import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { type ReactNode, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

interface PageShellProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}

/**
 * Editorial inner-page shell used by all non-home routes.
 * Cream background, deep-sage type, gold accents.
 */
export default function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="bg-paper text-ink">
      <Nav />

      <section className="pt-[140px] md:pt-[180px] pb-24 md:pb-32 section-glow">
        <div className="max-w-page container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="eyebrow text-gold mb-6">{eyebrow}</div>
            <h1
              className="font-display text-ink"
              style={{
                fontSize: "clamp(48px, 8vw, 128px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
              }}
            >
              {title}
            </h1>
            {intro && (
              <p className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-soft">
                {intro}
              </p>
            )}
          </motion.div>

          <div className="hairline-dark mt-16 md:mt-24" />
        </div>
      </section>

      {children ? (
        <section className="pb-24 md:pb-32">
          <div className="max-w-page container-x">{children}</div>
        </section>
      ) : (
        <section className="pb-24 md:pb-40">
          <div className="max-w-page container-x">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="grid md:grid-cols-12 gap-10"
            >
              <div className="md:col-span-7">
                <p className="text-2xl md:text-3xl font-display font-light leading-snug text-ink">
                  This page is part of the upcoming Vivanterra experience. Detailed content,
                  imagery and interactions will be added during the next production phase.
                </p>
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <div className="eyebrow text-muted-soft mb-4">In the meantime</div>
                <p className="text-base text-muted-soft leading-relaxed mb-8">
                  Connect with our team to discuss residences, partnerships, or career
                  opportunities at Velociti Real Estate.
                </p>
                <Link to="/contact" className="btn btn-dark">
                  Get in touch
                  <ArrowUpRight className="btn-arrow" size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
