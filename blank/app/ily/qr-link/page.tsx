import type { Metadata } from "next";
import { createIlyQrUnlockToken } from "@/lib/ilyAuth";

export const metadata: Metadata = {
  title: "QR Unlock Link",
  robots: {
    index: false,
    follow: false,
  },
};

function getSiteOrigin() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_URL;

  if (!configured) {
    return "http://localhost:3000";
  }

  if (configured.startsWith("http://") || configured.startsWith("https://")) {
    return configured;
  }

  return `https://${configured}`;
}

export default function IlyQrLinkPage() {
  const token = createIlyQrUnlockToken();
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <section className="w-full max-w-2xl border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-medium mb-3">QR link not configured</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Add <code>ILY_QR_SIGNING_SECRET</code> in <code>.env.local</code>{" "}
            to generate a QR unlock link.
          </p>
        </section>
      </main>
    );
  }

  const unlockUrl = `${getSiteOrigin()}/ily/unlock?token=${encodeURIComponent(token)}`;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="w-full max-w-2xl border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-medium mb-3">QR Unlock URL</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Copy this URL into any QR generator. Scanning it unlocks{" "}
          <code>/ily</code> and sets the auth cookie.
        </p>
        <pre className="p-3 rounded-lg bg-black/5 dark:bg-white/10 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-all">
          {unlockUrl}
        </pre>
      </section>
    </main>
  );
}

