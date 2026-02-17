import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-4 rounded-3xl bg-white p-8 shadow-card">
        <h1 className="font-display text-3xl text-ink-900">Page not found</h1>
        <p className="text-sm text-ink-600">We couldn't find the page you were looking for.</p>
        <Link href="/" className="rounded-full bg-rose-600 px-6 py-2 text-sm font-semibold text-white">
          Return home
        </Link>
      </div>
    </div>
  );
}
