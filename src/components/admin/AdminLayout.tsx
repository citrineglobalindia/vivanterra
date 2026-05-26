import { type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowUpRight, LogOut, Mail, MessageCircle } from "lucide-react";
import { signOut } from "@/lib/admin-auth";

export default function AdminLayout({
  children,
  email,
  title,
}: {
  children: ReactNode;
  email: string | null;
  title?: string;
}) {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-ink text-paper border-b border-line">
        <div className="max-w-page container-x flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="font-display text-paper tracking-tight text-lg"
            >
              VIVANTERRA{" "}
              <span className="text-gold/70 text-[10px] tracking-[0.2em] ml-2 uppercase">
                Admin
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-5">
              <AdminNavLink to="/admin">Enquiries</AdminNavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs text-paper/70">
            <span className="hidden md:inline">{email}</span>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 hover:text-gold transition-colors"
            >
              View site <ArrowUpRight size={12} />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-paper/25 hover:border-gold hover:text-gold transition-colors"
            >
              <LogOut size={12} />
              <span className="text-[11px] tracking-[0.16em] uppercase">
                Sign out
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Title row */}
      {title && (
        <div className="border-b border-line-dark bg-paper">
          <div className="max-w-page container-x py-10 md:py-14">
            <h1
              className="font-display text-ink"
              style={{
                fontSize: "clamp(28px, 3.4vw, 44px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-page container-x py-10 md:py-14">{children}</main>

      {/* Helper footer */}
      <footer className="border-t border-line-dark mt-16">
        <div className="max-w-page container-x py-8 flex items-center justify-between text-xs text-muted-soft">
          <span>Admin · Vivanterra</span>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hello@vivanterra.in"
              className="inline-flex items-center gap-1 hover:text-gold"
            >
              <Mail size={12} /> hello@vivanterra.in
            </a>
            <a
              href="https://wa.me/918867589797"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-gold"
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminNavLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          "text-[11px] tracking-[0.18em] uppercase transition-colors",
          isActive ? "text-gold" : "text-paper/70 hover:text-paper",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
