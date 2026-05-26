import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAdminSession } from "@/lib/admin-auth";

/**
 * Wrap any /admin route in this guard. Renders children only if the user
 * has a Supabase session AND their email is in the vivanterra_admin_users
 * allowlist (verified server-side via RLS).
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { loading, session, isAdmin, unconfigured, error } = useAdminSession();
  const location = useLocation();

  if (unconfigured) {
    return <SetupNeeded />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="animate-spin text-ink/40" size={28} />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <NotAllowed />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto text-[hsl(var(--destructive))] mb-3" />
          <p className="text-ink/80">{error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function SetupNeeded() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-paper border border-line-dark rounded-sm p-8 md:p-10">
        <div className="eyebrow text-gold mb-4">Admin · setup needed</div>
        <h1 className="font-display text-ink text-2xl mb-4">
          Supabase isn't configured for this deployment.
        </h1>
        <p className="text-ink/80 leading-relaxed mb-5">
          Add the following environment variables in Vercel → Project Settings →
          Environment Variables, then redeploy:
        </p>
        <pre className="bg-ink text-paper text-[12px] p-4 rounded-sm overflow-auto leading-relaxed">{`VITE_SUPABASE_URL=https://tivlznrjwtdtjmmfrczo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_…
SUPABASE_URL=https://tivlznrjwtdtjmmfrczo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=…`}</pre>
        <p className="text-xs text-muted-soft mt-5">
          The Vite-prefixed keys are baked into the client bundle. The unprefixed
          ones are read only by the /api/contact serverless function.
        </p>
      </div>
    </div>
  );
}

function NotAllowed() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <AlertTriangle className="mx-auto text-[hsl(var(--destructive))] mb-4" />
        <h1 className="font-display text-ink text-2xl mb-3">Not authorised.</h1>
        <p className="text-ink/75 leading-relaxed">
          Your account isn't in the Vivanterra admin allowlist. Ask an existing
          admin to add your email to the <code>vivanterra_admin_users</code>{" "}
          table.
        </p>
      </div>
    </div>
  );
}
