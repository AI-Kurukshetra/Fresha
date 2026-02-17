import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layouts/DashboardShell";
import { requireUser } from "@/lib/services/authService";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
