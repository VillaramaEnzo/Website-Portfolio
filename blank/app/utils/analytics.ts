export const ANALYTICS_CONSENT_STORAGE_KEY = "blank.analytics.consent";
export const ANALYTICS_CONSENT_CHANGE_EVENT = "blank:analytics-consent-change";

type ConsentValue = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getMeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
}

export function isAnalyticsEnabled(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
    Boolean(getMeasurementId())
  );
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) === "granted";
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  const value: ConsentValue = granted ? "granted" : "denied";
  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_CHANGE_EVENT, { detail: value }));
}

export function getGoogleTagScriptUrl(): string {
  return `https://www.googletagmanager.com/gtag/js?id=${getMeasurementId()}`;
}

export function getGoogleTagInitScript(): string {
  const id = getMeasurementId();
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${id}', { send_page_view: false });
  `;
}

export function trackPageView(path: string): void {
  const id = getMeasurementId();
  if (!id || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    send_to: id,
  });
}
