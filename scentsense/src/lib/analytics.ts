// Minimal analytics hook. Logs to console in dev; posts to a lightweight beacon
// in production if NEXT_PUBLIC_ANALYTICS_DOMAIN is configured. Replace with
// Plausible / GA / PostHog before launch.

export type AnalyticsEvent =
  | "landing_view"
  | "cta_click"
  | "flow_start"
  | "flow_step"
  | "flow_submit"
  | "recommendation_view"
  | "try_another_vibe"
  | "share_click"
  | "affiliate_click"
  | "email_submit"
  | "concierge_waitlist_submit"
  | "theme_toggle";

export function track(
  event: AnalyticsEvent,
  props: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined") return;
  const payload = { event, props, ts: Date.now() };
  try {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", payload);
    const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
    if (domain && navigator.sendBeacon) {
      navigator.sendBeacon(
        `/api/analytics?d=${encodeURIComponent(domain)}`,
        JSON.stringify(payload),
      );
    }
  } catch {
    // Swallow analytics errors – never block UX
  }
}
