import { z } from "zod";
import type { Role } from "@/domain/types/common";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";

export interface UserContext {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const RoleSchema = z.enum(["ADMIN", "STAFF", "CUSTOMER"]);

export const getUserContext = async (): Promise<UserContext | null> => {
  const supabase = await createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, name, email, role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    logger.warn({ error: profileError, userId: authData.user.id }, "Profile lookup failed");
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: RoleSchema.parse(profile.role)
  };
};
