import {
  ArrowUp,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

type FooterLink = { label: string; to: string; external?: boolean };

const LINKS: FooterLink[] = [
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Journal", to: "/blogs" },
  { label: "Careers", to: "/career" },
  { label: "Contact", to: "/contact" },
  { label: "Velociti", to: "https://velocitirealestate.com/", external: true },
];

const EMAIL = "hello@vivanterra.in";
const PHONE_DISPLAY = "+91 88675 89797";
const PHONE_TEL = "+918867589797";
const WHATSAPP_URL = "https://wa.me/918867589797";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="bg-ink text-paper" id="footer">
      <div className="max-w-page container-x py-14 md:py-16">
        {/* Top: brand + nav */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="font-display text-paper text-2xl md:text-3xl tracking-tight"
            >
              VIVANTERRA
            </Link>
            <p className="mt-3 text-paper/60 text-sm max-w-xs leading-relaxed">
              Wellness-first real estate · Bengaluru
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) =>
              l.external ? (
                <a
                  key={l.label}
                  href={l.to}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-paper/75 hover:text-gold transition-colors"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-sm text-paper/75 hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`mailto:${EMAIL}`}
              className="text-paper/75 hover:text-gold transition-colors break-all"
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-paper/75 hover:text-gold transition-colors tabular-nums"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="hairline my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 text-xs text-paper/55">
          <span>© {new Date().getFullYear()} Vivanterra. All rights reserved.</span>

          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-gold transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-gold transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover:text-gold transition-colors"
            >
              <MessageCircle size={16} />
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-paper/25 hover:border-gold hover:text-gold transition-colors uppercase tracking-[0.16em] text-[10px]"
            >
              Top
              <ArrowUp size={11} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
