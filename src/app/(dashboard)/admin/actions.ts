"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/components/features/ActionForm";
import { createService, createStaff, deleteService, deleteStaff, updateService, updateStaff } from "@/lib/use-cases/adminUseCases";
import { requireRole } from "@/lib/services/authService";

const ok = (message: string): ActionState => ({ status: "success", message });
const fail = (message: string): ActionState => ({ status: "error", message });

export const createServiceAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  await requireRole("ADMIN");
  const result = await createService({
    name: formData.get("name"),
    durationMinutes: Number(formData.get("durationMinutes")),
    price: Number(formData.get("price"))
  });

  if (!result.success) {
    return fail(result.error);
  }

  revalidatePath("/admin");
  return ok("Service created");
};

export const updateServiceAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const result = await updateService(id, {
    name: formData.get("name"),
    durationMinutes: Number(formData.get("durationMinutes")),
    price: Number(formData.get("price"))
  });

  if (!result.success) {
    return fail(result.error);
  }

  revalidatePath("/admin");
  return ok("Service updated");
};

export const deleteServiceAction = async (formData: FormData): Promise<void> => {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const result = await deleteService(id);
  if (!result.success) {
    throw new Error(result.error);
  }
  revalidatePath("/admin");
};

export const createStaffAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  await requireRole("ADMIN");
  const result = await createStaff({
    name: formData.get("name"),
    expertise: formData.get("expertise"),
    workStartTime: formData.get("workStartTime"),
    workEndTime: formData.get("workEndTime")
  });

  if (!result.success) {
    return fail(result.error);
  }

  revalidatePath("/admin");
  return ok("Staff added");
};

export const updateStaffAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const result = await updateStaff(id, {
    name: formData.get("name"),
    expertise: formData.get("expertise"),
    workStartTime: formData.get("workStartTime"),
    workEndTime: formData.get("workEndTime")
  });

  if (!result.success) {
    return fail(result.error);
  }

  revalidatePath("/admin");
  return ok("Staff updated");
};

export const deleteStaffAction = async (formData: FormData): Promise<void> => {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const result = await deleteStaff(id);
  if (!result.success) {
    throw new Error(result.error);
  }
  revalidatePath("/admin");
};
