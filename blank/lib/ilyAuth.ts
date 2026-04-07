export const ILY_AUTH_COOKIE_NAME = "ily-auth";
export const ILY_AUTH_COOKIE_VALUE = "granted";
export const ILY_AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const ILY_PAGE_ENABLED_ENV_NAME = "ILY_PAGE_ENABLED";
export const NEXT_PUBLIC_ILY_PAGE_ENABLED_ENV_NAME = "NEXT_PUBLIC_ILY_PAGE_ENABLED";
export const ILY_QR_SIGNING_SECRET_ENV_NAME = "ILY_QR_SIGNING_SECRET";
export const ILY_QR_TTL_SECONDS_ENV_NAME = "ILY_QR_TTL_SECONDS";
export const ILY_PASSWORD_ENV_NAME = "ILY_PAGE_PASSWORD";

export function getIlyAuthCookieOptions() {
  return {
    name: ILY_AUTH_COOKIE_NAME,
    value: ILY_AUTH_COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ILY_AUTH_COOKIE_MAX_AGE_SECONDS,
  };
}

export function isIlyAuthenticated(cookieValue: string | undefined): boolean {
  return cookieValue === ILY_AUTH_COOKIE_VALUE;
}

function parseIlyEnabled(rawValue: string | undefined): boolean {
  if (typeof rawValue !== "string") {
    return true;
  }

  const normalized = rawValue.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return normalized === "true";
}

export function isIlyPageEnabledServer(): boolean {
  return parseIlyEnabled(process.env[ILY_PAGE_ENABLED_ENV_NAME]);
}

export function isIlyPageEnabledClient(): boolean {
  return parseIlyEnabled(process.env[NEXT_PUBLIC_ILY_PAGE_ENABLED_ENV_NAME]);
}

export function isSafeIlyPath(pathname: string): boolean {
  return pathname === "/ily" || pathname.startsWith("/ily/");
}

