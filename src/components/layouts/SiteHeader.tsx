import Link from "next/link";

interface SiteHeaderProps {
  isAuthenticated: boolean;
}

export function SiteHeader({ isAuthenticated }: SiteHeaderProps) {
  return (
    <header className="w-full border-b border-ink-100 bg-white/95 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg text-ink-900">
          Fresha Studio
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-700 md:flex">
          <Link href="/#services">Services</Link>
          <Link href="/#experience">For business</Link>
          <Link href="/#team">Team</Link>
          <Link href="/book">Book</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-900 hover:border-ink-600"
          >
            Log in
          </Link>
          <Link
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="rounded-xl bg-mint-600 px-4 py-2 text-sm font-semibold text-white hover:bg-mint-700"
          >
            {isAuthenticated ? "Dashboard" : "Get started"}
          </Link>
        </div>
      </div>
    </header>
  );
}
