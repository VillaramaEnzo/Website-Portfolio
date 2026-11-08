# Analytics (`blank`)

This project uses a consent-first Google Analytics setup.

## Design Goals

- Load analytics only after explicit consent.
- Keep analytics disabled in local/dev by default.
- Mount once globally so all current and future routes are tracked.
- Minimize hydration impact with a tiny client-only boundary.

## Files

- Loader: `app/components/analytics/GoogleAnalytics.tsx`
- Utility helpers: `app/utils/analytics.ts`
- Mount point: `app/context/ClientWrapper.tsx`
- Env template: `.env.example`

## Environment Variables

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-R95SQ1SR0R
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

Recommendations:
- Local/dev: `NEXT_PUBLIC_ANALYTICS_ENABLED=false`
- Production: set `NEXT_PUBLIC_ANALYTICS_ENABLED=true`

## Consent Model

- Consent key in local storage: `blank.analytics.consent`
- Supported values:
  - `granted` -> GA script loads and route pageviews are tracked
  - `denied` -> GA does not load, and future pageviews are not sent

Use utility helpers from `app/utils/analytics.ts`:
- `hasAnalyticsConsent()`
- `setAnalyticsConsent(granted: boolean)`

`setAnalyticsConsent` dispatches a custom event so the mounted loader reacts immediately.

## Route Tracking

- Tracking happens on pathname/search param changes.
- `send_page_view: false` is set in GA config so we control pageview events manually.
- This avoids duplicate pageviews in SPA navigation.

## Disable Path

Immediate kill switch:
- Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` in production env and redeploy.

Consent-level disable:
- Set consent to denied via `setAnalyticsConsent(false)` in client code.
