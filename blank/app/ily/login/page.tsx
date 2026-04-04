import type { Metadata } from "next";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    config?: string;
    next?: string;
    qr?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Secret Login",
  robots: {
    index: false,
    follow: false,
  },
};

function sanitizeNextPath(pathname: string | undefined): string {
  if (!pathname) {
    return "/ily";
  }

  if (pathname.startsWith("/ily")) {
    return pathname;
  }

  return "/ily";
}

export default async function IlyLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const showError = params.error === "1";
  const showConfigError = params.config === "1";
  const showQrError = params.qr === "invalid" || params.qr === "expired";
  const nextPath = sanitizeNextPath(params.next);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="w-full max-w-md border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-medium mb-3">Private Page</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Enter the password to unlock this page.
        </p>

        {showError ? (
          <p className="text-sm text-red-600 mb-4">
            Incorrect password. Please try again.
          </p>
        ) : null}

        {showQrError ? (
          <p className="text-sm text-red-600 mb-4">
            QR unlock link is invalid or expired. You can still use password
            login.
          </p>
        ) : null}

        {showConfigError ? (
          <p className="text-sm text-red-600 mb-4">
            This page is not configured yet. Add the password in your env file.
          </p>
        ) : null}

        <form action="/ily/auth" method="post" className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-black text-white dark:bg-white dark:text-black py-2.5 font-medium"
          >
            Unlock
          </button>
        </form>
      </section>
    </main>
  );
}

