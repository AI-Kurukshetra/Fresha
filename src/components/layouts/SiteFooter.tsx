import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="font-display text-lg text-ink-900">Fresha Studio</p>
          <p className="text-sm text-ink-600">
            The modern platform for bookings, payments, and client love.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-ink-700">
          <Link href="/#services">Services</Link>
          <Link href="/#experience">For business</Link>
          <Link href="/#team">Team</Link>
          <Link href="/book">Book now</Link>
        </div>
      </div>
    </footer>
  );
}
