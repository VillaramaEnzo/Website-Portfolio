"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ANALYTICS_CONSENT_CHANGE_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  getGoogleTagInitScript,
  getGoogleTagScriptUrl,
  hasAnalyticsConsent,
  isAnalyticsEnabled,
  trackPageView,
} from "@/app/utils/analytics";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hasConsent, setHasConsent] = useState<boolean>(() => hasAnalyticsConsent());
  const [gaReady, setGaReady] = useState<boolean>(
    () => typeof window !== "undefined" && typeof window.gtag === "function",
  );

  const analyticsEnabled = isAnalyticsEnabled();
  const shouldLoadAnalytics = analyticsEnabled && hasConsent;
  const queryString = searchParams.toString();

  useEffect(() => {
    if (!analyticsEnabled) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ANALYTICS_CONSENT_STORAGE_KEY) {
        setHasConsent(event.newValue === "granted");
      }
    };

    const handleConsentChange = () => {
      setHasConsent(hasAnalyticsConsent());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, handleConsentChange);
    };
  }, [analyticsEnabled]);

  useEffect(() => {
    if (!shouldLoadAnalytics || !gaReady || !pathname) return;
    const path = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(path);
  }, [gaReady, pathname, queryString, shouldLoadAnalytics]);

  const initScript = useMemo(() => getGoogleTagInitScript(), []);

  if (!shouldLoadAnalytics) {
    return null;
  }

  return (
    <>
      <Script
        id="google-gtag-src"
        src={getGoogleTagScriptUrl()}
        strategy="afterInteractive"
        onLoad={() => setGaReady(true)}
      />
      <Script id="google-gtag-init" strategy="afterInteractive">
        {initScript}
      </Script>
    </>
  );
}
