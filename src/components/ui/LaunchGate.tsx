import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import ComingSoon from "./ComingSoon";

/**
 * Gates the public site behind a pre-launch countdown until LAUNCH_TS.
 * Bypassed for /admin routes and when ?preview is present, so the team
 * can work and preview before go-live. Auto-reveals the site at launch.
 */
export const LAUNCH_TS = new Date("2026-07-05T11:11:00+05:30").getTime();

export default function LaunchGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [now, setNow] = useState(() => Date.now());

  const bypass =
    location.pathname.startsWith("/admin") ||
    new URLSearchParams(location.search).has("preview");

  useEffect(() => {
    if (bypass || now >= LAUNCH_TS) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [bypass, now]);

  if (bypass || now >= LAUNCH_TS) return <>{children}</>;
  return <ComingSoon target={LAUNCH_TS} />;
}
