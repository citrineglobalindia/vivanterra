import {
  ArrowUp,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

type FooterLink = { label: string; to: string; external?: boolean };


const USEFUL: FooterLink[] = [
  { label: "About Us", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Velociti", to: "https://velocitirealestate.com/", external: true },
  { label: "Career", to: "/career" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

const POLICIES: FooterLink[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Disclaimer", to: "/disclaimer" },
  { label: "RERA Disclaimer", to: "/rera-disclaimer" },
  { label: "Sitemap", to: "/sitemap.xml", external: true },
];

const EMAIL = "hello@vivanterra.in";
const PHONE_DISPLAY = "+91 88675 89797";
const PHONE_TEL = "+918867589797";
const WHATSAPP_URL = "https://wa.me/918867589797";
const ADDRESS = "4th Floor, Cassini Towers, 13th Cross Rd, Sadashiva Nagar, Bengaluru 560080";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function FooterItem({ link }: { link: FooterLink }) {
  const cls = "text-sm text-paper/70 hover:text-gold transition-colors";
  return link.external ? (
    <a href={link.to} target="_blank" rel="noreferrer" className={cls}>
      {link.label}
    </a>
  ) : (
    <Link to={link.to} className={cls}>
      {link.label}
    </Link>
  );
}

function FooterNav({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-[11px] tracking-[0.22em] uppercase text-paper font-medium pb-1.5 mb-3 border-b border-gold/50 inline-block">
        {title}
      </h3>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.label}>
            <FooterItem link={l} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink-deep text-paper border-t-2 border-gold" id="footer">
      <div className="max-w-page container-x py-8 md:py-9">
        {/* Wordmark */}
        <div className="flex justify-center">
          <Link
            to="/"
            aria-label="Vivanterra — home"
            className="font-display text-paper text-2xl md:text-4xl tracking-[0.08em] hover:text-gold transition-colors"
          >
            VIVANTERRA
          </Link>
        </div>

        <div className="h-px w-full bg-gold/70 mt-4 md:mt-5 mb-6 md:mb-7" />

        {/* Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 md:gap-8">
          <FooterNav title="Useful Links" links={USEFUL} />

          <FooterNav title="Policies" links={POLICIES} />

          {/* Studio */}
          <div>
            <h3 className="text-[11px] tracking-[0.22em] uppercase text-paper font-medium pb-1.5 mb-3 border-b border-gold/50 inline-block">
              Studio
            </h3>
            <ul className="space-y-2 text-sm text-paper/70">
              <li className="flex gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
                <span className="leading-relaxed">{ADDRESS}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-gold" />
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="hover:text-gold transition-colors tabular-nums"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-gold" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="hover:text-gold transition-colors break-all"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex items-center gap-2.5 mt-4">
              {[
                { href: "https://www.instagram.com/", label: "Instagram", Icon: Instagram },
                { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: Linkedin },
                { href: WHATSAPP_URL, label: "WhatsApp", Icon: MessageCircle },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-paper/20 text-paper/75 hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-paper/45 my-5 md:my-6" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-5 text-xs text-paper/55">
          <span className="text-center sm:text-left">
            © {new Date().getFullYear()} Vivanterra Real Estate. All rights
            reserved.
          </span>

          <div className="flex items-center gap-5">
            <span className="hidden md:inline text-paper/45">
              Wellness-first real estate · Bengaluru
            </span>
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
