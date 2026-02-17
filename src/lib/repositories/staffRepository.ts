import type { Staff } from "@/domain/entities/staff";
import type { StaffId, UserId } from "@/domain/types/common";
import { logger } from "@/lib/logger";
import { toStaffId, toUserId } from "@/lib/utils/branding";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";

interface StaffRow {
  id: string;
  name: string;
  expertise: string;
  work_start_time: string;
  work_end_time: string;
  user_id: string | null;
}

const mapStaff = (row: StaffRow): Staff => ({
  id: toStaffId(row.id),
  name: row.name,
  expertise: row.expertise,
  workStartTime: row.work_start_time,
  workEndTime: row.work_end_time,
  ...(row.user_id ? { userId: toUserId(row.user_id) } : {})
});

export const staffRepository = {
  async list(): Promise<Staff[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("staff")
      .select("id, name, expertise, work_start_time, work_end_time, user_id")
      .order("name");

    if (error || !data) {
      logger.error({ error }, "Failed to list staff");
      return [];
    }

    return data.map(mapStaff);
  },
  async findById(id: StaffId): Promise<Staff | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("staff")
      .select("id, name, expertise, work_start_time, work_end_time, user_id")
      .eq("id", id)
      .single();

    if (error || !data) {
      logger.warn({ error, id }, "Staff not found");
      return null;
    }

    return mapStaff(data);
  },
  async findByUserId(userId: UserId): Promise<Staff | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("staff")
      .select("id, name, expertise, work_start_time, work_end_time, user_id")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      logger.warn({ error, userId }, "Staff profile not found for user");
      return null;
    }

    return mapStaff(data);
  },
  async create(data: Omit<Staff, "id">): Promise<Staff> {
    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from("staff")
      .insert({
        name: data.name,
        expertise: data.expertise,
        work_start_time: data.workStartTime,
        work_end_time: data.workEndTime,
        user_id: data.userId ?? null
      })
      .select("id, name, expertise, work_start_time, work_end_time, user_id")
      .single();

    if (error || !created) {
      logger.error({ error }, "Failed to create staff");
      throw new Error("Unable to create staff");
    }

    return mapStaff(created);
  },
  async update(id: StaffId, data: Partial<Omit<Staff, "id">>): Promise<Staff> {
    const supabase = await createSupabaseServerClient();
    const { data: updated, error } = await supabase
      .from("staff")
      .update({
        name: data.name,
        expertise: data.expertise,
        work_start_time: data.workStartTime,
        work_end_time: data.workEndTime,
        user_id: data.userId ?? null
      })
      .eq("id", id)
      .select("id, name, expertise, work_start_time, work_end_time, user_id")
      .single();

    if (error || !updated) {
      logger.error({ error, id }, "Failed to update staff");
      throw new Error("Unable to update staff");
    }

    return mapStaff(updated);
  },
  async remove(id: StaffId): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("staff").delete().eq("id", id);

    if (error) {
      logger.error({ error, id }, "Failed to delete staff");
      throw new Error("Unable to delete staff");
    }
  }
};
