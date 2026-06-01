import { type ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Briefcase,
  Inbox,
  Megaphone,
  Menu,
  MessageSquare,
  Newspaper,
  Palette,
  PenSquare,
  Users,
  X,
} from "lucide-react";
import { signOut } from "@/lib/admin-auth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: Building2, end: false },
  { to: "/admin/blogs", label: "Blogs", icon: PenSquare, end: false },
  { to: "/admin/news", label: "News", icon: Newspaper, end: false },
  { to: "/admin/press", label: "Press Releases", icon: Megaphone, end: false },
  { to: "/admin/gallery", label: "Gallery", icon: Image, end: false },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare, end: false },
  { to: "/admin/leads", label: "Leads", icon: Inbox, end: false },
  { to: "/admin/careers", label: "Careers", icon: Briefcase, end: false },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users, end: false },
  { to: "/admin/settings", label: "Theme", icon: Palette, end: false },
];

export default function AdminLayout({
  children,
  email,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  email: string | null;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f7f6f1] text-ink flex">
      {/* Sidebar */}
      <aside
        className={[
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-paper border-r border-line-dark flex flex-col transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-line-dark">
          <Link to="/admin" className="font-display text-ink text-lg tracking-tight">
            VIVANTERRA
          </Link>
          <button
            type="button"
            className="lg:hidden text-ink/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-ink text-paper font-medium"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink",
                  ].join(" ")
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-line-dark p-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-ink/60 hover:text-gold transition-colors mb-3"
          >
            <ArrowUpRight size={13} /> View live site
          </Link>
          <a
            href="mailto:hello@vivanterra.in"
            className="flex items-center gap-2 text-xs text-ink/60 hover:text-gold transition-colors"
          >
            <Mail size={13} /> hello@vivanterra.in
          </a>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-paper border-b border-line-dark flex items-center justify-between px-5 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-ink/70"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <span className="font-display text-ink text-base md:text-lg">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-ink/70">
            <span className="hidden sm:inline">{email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-line-dark hover:border-gold hover:text-gold transition-colors"
            >
              <LogOut size={13} />
              <span className="tracking-[0.04em]">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page header */}
        {(title || actions) && (
          <div className="px-5 md:px-8 pt-8 pb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              {title && (
                <h1
                  className="font-display text-ink"
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-ink/55 mt-2 text-sm">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}

        <main className="flex-1 px-5 md:px-8 pb-16">{children}</main>
      </div>
    </div>
  );
}
