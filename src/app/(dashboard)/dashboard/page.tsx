import { redirect } from "next/navigation";
import { requireUser } from "@/lib/services/authService";
import { DASHBOARD_PATHS } from "@/config/constants";

export default async function DashboardPage() {
  const user = await requireUser();
  const pathKey = user.role.toLowerCase() as keyof typeof DASHBOARD_PATHS;
  redirect(DASHBOARD_PATHS[pathKey]);
}
