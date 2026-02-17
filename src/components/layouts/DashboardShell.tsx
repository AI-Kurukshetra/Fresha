import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck2, ClipboardList, LayoutDashboard, Scissors, UserRound } from "lucide-react";
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

const navIcons: Record<string, ReactNode> = {
  Overview: <LayoutDashboard className="h-4 w-4" />,
  Bookings: <ClipboardList className="h-4 w-4" />,
  Services: <Scissors className="h-4 w-4" />,
  Staff: <UserRound className="h-4 w-4" />,
  "My Schedule": <CalendarCheck2 className="h-4 w-4" />,
  "Book Appointment": <CalendarCheck2 className="h-4 w-4" />
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-offwhite">
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-6 py-8">
        <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col justify-between rounded-3xl border border-charcoal-100 bg-white/80 p-6 shadow-soft backdrop-blur lg:flex">
          <div className="space-y-6">
            <Link href="/" className="font-display text-xl text-charcoal-900">
              Fresha Studio
            </Link>
            <nav className="space-y-2 text-sm">
              {navLinks[user.role].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-charcoal-700 transition-all duration-300 hover:bg-beige-100 hover:text-rose-700"
                >
                  {navIcons[link.label]}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-charcoal-100 bg-white/80 px-4 py-3 text-xs text-charcoal-600">
              Signed in as <span className="font-semibold text-charcoal-900">{user.name}</span>
            </div>
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit" className="w-full">
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <main className="w-full space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-charcoal-100 bg-white/80 px-6 py-4 shadow-soft backdrop-blur lg:hidden">
            <Link href="/" className="font-display text-lg text-charcoal-900">
              Fresha Studio
            </Link>
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
