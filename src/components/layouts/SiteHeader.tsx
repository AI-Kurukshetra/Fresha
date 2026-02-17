import Link from "next/link";

interface SiteHeaderProps {
  isAuthenticated: boolean;
}

export function SiteHeader({ isAuthenticated }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-charcoal-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg text-charcoal-900">
          Fresha Studio
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-charcoal-700 md:flex">
          <Link href="/#services">Services</Link>
          <Link href="/#experience">For business</Link>
          <Link href="/#team">Team</Link>
          <Link href="/book">Book</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-charcoal-100 px-3 py-2 text-sm font-semibold text-charcoal-900 transition-all duration-300 hover:border-rose-600 hover:text-rose-700"
          >
            Log in
          </Link>
          <Link
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:from-rose-700 hover:to-rose-700"
          >
            {isAuthenticated ? "Dashboard" : "Get started"}
          </Link>
        </div>
      </div>
    </header>
  );
}
