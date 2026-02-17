"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/components/features/ActionForm";
import { markBookingCompleted } from "@/lib/use-cases/bookingUseCases";
import { requireRole } from "@/lib/services/authService";

export const completeBookingAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  await requireRole("STAFF");
  const bookingId = String(formData.get("bookingId"));
  const result = await markBookingCompleted(bookingId);

  if (!result.success) {
    return { status: "error", message: result.error };
  }

  revalidatePath("/staff");
  return { status: "success", message: "Booking marked complete" };
};
