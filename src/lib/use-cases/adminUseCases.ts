import { z } from "zod";
import type { Result } from "@/domain/types/result";
import type { Service } from "@/domain/entities/service";
import type { Staff } from "@/domain/entities/staff";
import { serviceRepository } from "@/lib/repositories/serviceRepository";
import { staffRepository } from "@/lib/repositories/staffRepository";
import { logger } from "@/lib/logger";
import { toServiceId, toStaffId } from "@/lib/utils/branding";

const ServiceSchema = z.object({
  name: z.string().min(2).max(100),
  durationMinutes: z.number().int().min(15).max(240),
  price: z.number().min(1).max(500)
});

const StaffSchema = z.object({
  name: z.string().min(2).max(100),
  expertise: z.string().min(2).max(120),
  workStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  workEndTime: z.string().regex(/^\d{2}:\d{2}$/)
});

export const createService = async (input: unknown): Promise<Result<Service>> => {
  const parsed = ServiceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid service data" };
  }

  try {
    const service = await serviceRepository.create(parsed.data);
    return { success: true, data: service };
  } catch (error) {
    logger.error({ error }, "Create service failed");
    return { success: false, error: "Failed to create service" };
  }
};

export const updateService = async (id: string, input: unknown): Promise<Result<Service>> => {
  const parsed = ServiceSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid service data" };
  }

  try {
    const service = await serviceRepository.update(toServiceId(id), parsed.data);
    return { success: true, data: service };
  } catch (error) {
    logger.error({ error }, "Update service failed");
    return { success: false, error: "Failed to update service" };
  }
};

export const deleteService = async (id: string): Promise<Result<null>> => {
  try {
    await serviceRepository.remove(toServiceId(id));
    return { success: true, data: null };
  } catch (error) {
    logger.error({ error }, "Delete service failed");
    return { success: false, error: "Failed to delete service" };
  }
};

export const createStaff = async (input: unknown): Promise<Result<Staff>> => {
  const parsed = StaffSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid staff data" };
  }

  try {
    const staff = await staffRepository.create(parsed.data);
    return { success: true, data: staff };
  } catch (error) {
    logger.error({ error }, "Create staff failed");
    return { success: false, error: "Failed to create staff" };
  }
};

export const updateStaff = async (id: string, input: unknown): Promise<Result<Staff>> => {
  const parsed = StaffSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid staff data" };
  }

  try {
    const staff = await staffRepository.update(toStaffId(id), parsed.data);
    return { success: true, data: staff };
  } catch (error) {
    logger.error({ error }, "Update staff failed");
    return { success: false, error: "Failed to update staff" };
  }
};

export const deleteStaff = async (id: string): Promise<Result<null>> => {
  try {
    await staffRepository.remove(toStaffId(id));
    return { success: true, data: null };
  } catch (error) {
    logger.error({ error }, "Delete staff failed");
    return { success: false, error: "Failed to delete staff" };
  }
};
