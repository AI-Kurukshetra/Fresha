import type { User } from "@/domain/entities/user";
import type { Role, UserId } from "@/domain/types/common";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";
import { toUserId } from "@/lib/utils/branding";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const mapUser = (row: UserRow): User => ({
  id: toUserId(row.id),
  name: row.name,
  email: row.email,
  role: row.role
});

export const userRepository = {
  async findById(id: UserId): Promise<User | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("users").select("id, name, email, role").eq("id", id).single();

    if (error || !data) {
      logger.warn({ error, id }, "User not found");
      return null;
    }

    return mapUser(data);
  },
  async create(data: Omit<User, "id"> & { id: UserId }): Promise<User> {
    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from("users")
      .insert({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      })
      .select("id, name, email, role")
      .single();

    if (error || !created) {
      logger.error({ error }, "Failed to create user");
      throw new Error("Unable to create user");
    }

    return mapUser(created);
  },
  async updateRole(id: UserId, role: Role): Promise<User> {
    const supabase = await createSupabaseServerClient();
    const { data: updated, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select("id, name, email, role")
      .single();

    if (error || !updated) {
      logger.error({ error, id }, "Failed to update user role");
      throw new Error("Unable to update user role");
    }

    return mapUser(updated);
  }
};
