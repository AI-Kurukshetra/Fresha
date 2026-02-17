import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { UserContext } from "@/infrastructure/auth/getUser";
import { signOut } from "@/app/(auth)/actions";

interface DashboardShellProps {
  user: UserContext;
  children: ReactNode;
}

const navLinks: Record<UserContext["role"], { label: string; href: string }[]> = {
  ADMIN: [
    { label: "Overview", href: "/admin" },
    { label: "Bookings", href: "/admin#bookings" },
    { label: "Services", href: "/admin#services" },
    { label: "Staff", href: "/admin#staff" }
  ],
  STAFF: [{ label: "My Schedule", href: "/staff" }],
  CUSTOMER: [{ label: "Book Appointment", href: "/book" }]
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-cloud-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-lg text-ink-900">
            Fresha Studio
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-700 md:flex">
            {navLinks[user.role].map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-600 md:inline">{user.name}</span>
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
