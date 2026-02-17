import { redirect } from "next/navigation";
import type { Role } from "@/domain/types/common";
import { getUserContext } from "@/infrastructure/auth/getUser";
import { DASHBOARD_PATHS } from "@/config/constants";

export const requireUser = async () => {
  const user = await getUserContext();
  if (!user) {
    redirect("/login");
  }
  return user;
};

export const requireRole = async (role: Role) => {
  const user = await requireUser();
  if (user.role !== role) {
    redirect(DASHBOARD_PATHS[user.role.toLowerCase() as keyof typeof DASHBOARD_PATHS]);
  }
  return user;
};
