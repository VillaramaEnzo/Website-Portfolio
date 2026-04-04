import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ILY_AUTH_COOKIE_NAME, isIlyAuthenticated } from "@/lib/ilyAuth";

export const metadata: Metadata = {
  title: "For My Love",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function IlyPage() {
  const cookieStore = await cookies();
  const isAuthenticated = isIlyAuthenticated(
    cookieStore.get(ILY_AUTH_COOKIE_NAME)?.value,
  );

  if (!isAuthenticated) {
    redirect("/ily/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <section className="max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-light mb-6">I Love You</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Happy birthday, my love! This little corner of the internet is just
          for you.
        </p>
      </section>
    </main>
  );
}
  