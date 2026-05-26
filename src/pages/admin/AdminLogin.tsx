import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { signInWithPassword, useAdminSession } from "@/lib/admin-auth";

export default function AdminLogin() {
  const { loading, session, isAdmin, unconfigured } = useAdminSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && session && isAdmin) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname;
    return <Navigate to={from && from.startsWith("/admin") ? from : "/admin"} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signInWithPassword(email.trim(), password);
    setSubmitting(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    navigate("/admin", { replace: true });
  }

  return (
    <>
      <Seo title="Admin — sign in" description="Sign in to the Vivanterra admin." />
      <main className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="font-display text-ink text-2xl tracking-tight">
              VIVANTERRA
            </Link>
            <p className="eyebrow text-gold mt-2 text-[10px]">Admin</p>
          </div>

          <div className="bg-paper border border-line-dark rounded-sm p-8 md:p-10">
            <h1
              className="font-display text-ink mb-2"
              style={{
                fontSize: "clamp(24px, 2.8vw, 32px)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Sign in
            </h1>
            <p className="text-muted-soft text-sm mb-7">
              Use your allow-listed admin email and password.
            </p>

            {unconfigured && (
              <div className="mb-6 p-4 border border-gold/40 bg-gold/5 text-ink/80 text-sm rounded-sm">
                Supabase isn't configured yet. The login form won't work until
                <code className="mx-1 px-1 bg-ink/5 rounded">VITE_SUPABASE_URL</code>
                and
                <code className="mx-1 px-1 bg-ink/5 rounded">
                  VITE_SUPABASE_ANON_KEY
                </code>
                are set in Vercel.
              </div>
            )}

            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <label className="block">
                <span className="eyebrow text-muted-soft mb-2 inline-block">
                  Email
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-4 py-3 text-[15px] text-ink placeholder:text-ink/45 outline-none focus:border-gold focus:bg-paper transition-colors"
                  placeholder="you@vivanterra.in"
                />
              </label>

              <label className="block">
                <span className="eyebrow text-muted-soft mb-2 inline-block">
                  Password
                </span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-4 py-3 text-[15px] text-ink placeholder:text-ink/45 outline-none focus:border-gold focus:bg-paper transition-colors"
                  placeholder="••••••••"
                />
              </label>

              {error && (
                <p className="text-[13px] text-[hsl(var(--destructive))]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || unconfigured}
                className="w-full inline-flex items-center justify-center gap-2 h-12 px-5 bg-ink text-paper font-semibold text-[11px] tracking-[0.20em] uppercase rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Signing in
                  </>
                ) : (
                  <>
                    <LogIn size={14} /> Sign in
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-soft mt-6">
            First-time setup: create your auth user in the Supabase dashboard,
            then make sure your email is in
            <code className="mx-1 px-1 bg-ink/5 rounded">
              vivanterra_admin_users
            </code>
            .
          </p>
        </div>
      </main>
    </>
  );
}
