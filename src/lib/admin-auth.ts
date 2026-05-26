import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "./supabase";

export type AdminAuthState = {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
  email: string | null;
  /** True when Supabase env vars aren't set — show a setup-needed banner. */
  unconfigured: boolean;
  error: string | null;
};

const initialState: AdminAuthState = {
  loading: true,
  session: null,
  isAdmin: false,
  email: null,
  unconfigured: !supabaseConfigured,
  error: null,
};

/**
 * Checks whether the currently-signed-in user appears in the
 * vivanterra_admin_users allowlist. Returns null on no session, true / false
 * otherwise, throws on RPC failure.
 */
async function isAdminFromServer(): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("vivanterra_admin_users")
    .select("email")
    .limit(1);
  if (error) {
    // Common: RLS denies; user is not an admin.
    return false;
  }
  return (data ?? []).length > 0;
}

export function useAdminSession(): AdminAuthState & {
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<AdminAuthState>(initialState);

  const evaluate = useCallback(async () => {
    if (!supabaseConfigured) {
      setState({
        loading: false,
        session: null,
        isAdmin: false,
        email: null,
        unconfigured: true,
        error: null,
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user.email ?? null;
      const isAdmin = session ? await isAdminFromServer() : false;
      setState({
        loading: false,
        session,
        isAdmin,
        email,
        unconfigured: false,
        error: null,
      });
    } catch (err) {
      setState({
        loading: false,
        session: null,
        isAdmin: false,
        email: null,
        unconfigured: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, []);

  useEffect(() => {
    evaluate();
    if (!supabaseConfigured) return;
    const { data: sub } = getSupabase().auth.onAuthStateChange(() => {
      evaluate();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [evaluate]);

  return { ...state, refresh: evaluate };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabaseConfigured)
    return { ok: false, error: "Supabase not configured" };
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  if (!supabaseConfigured) return;
  await getSupabase().auth.signOut();
}
