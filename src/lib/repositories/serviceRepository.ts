import type { Service } from "@/domain/entities/service";
import type { ServiceId } from "@/domain/types/common";
import { logger } from "@/lib/logger";
import { toServiceId } from "@/lib/utils/branding";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";

interface ServiceRow {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

const mapService = (row: ServiceRow): Service => ({
  id: toServiceId(row.id),
  name: row.name,
  durationMinutes: row.duration_minutes,
  price: row.price
});

export const serviceRepository = {
  async list(): Promise<Service[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("services").select("id, name, duration_minutes, price").order("name");

    if (error || !data) {
      logger.error({ error }, "Failed to list services");
      return [];
    }

    return data.map(mapService);
  },
  async findById(id: ServiceId): Promise<Service | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, name, duration_minutes, price")
      .eq("id", id)
      .single();

    if (error || !data) {
      logger.warn({ error, id }, "Service not found");
      return null;
    }

    return mapService(data);
  },
  async create(data: Omit<Service, "id">): Promise<Service> {
    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from("services")
      .insert({
        name: data.name,
        duration_minutes: data.durationMinutes,
        price: data.price
      })
      .select("id, name, duration_minutes, price")
      .single();

    if (error || !created) {
      logger.error({ error }, "Failed to create service");
      throw new Error("Unable to create service");
    }

    return mapService(created);
  },
  async update(id: ServiceId, data: Partial<Omit<Service, "id">>): Promise<Service> {
    const supabase = await createSupabaseServerClient();
    const { data: updated, error } = await supabase
      .from("services")
      .update({
        name: data.name,
        duration_minutes: data.durationMinutes,
        price: data.price
      })
      .eq("id", id)
      .select("id, name, duration_minutes, price")
      .single();

    if (error || !updated) {
      logger.error({ error, id }, "Failed to update service");
      throw new Error("Unable to update service");
    }

    return mapService(updated);
  },
  async remove(id: ServiceId): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      logger.error({ error, id }, "Failed to delete service");
      throw new Error("Unable to delete service");
    }
  }
};
