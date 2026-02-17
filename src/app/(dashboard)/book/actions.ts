"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/components/features/ActionForm";
import { createBooking, createPayment } from "@/lib/use-cases/bookingUseCases";
import { requireRole } from "@/lib/services/authService";

export const bookAppointmentAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  const user = await requireRole("CUSTOMER");
  const result = await createBooking({
    serviceId: formData.get("serviceId"),
    staffId: formData.get("staffId"),
    customerId: user.id,
    date: formData.get("date"),
    startTime: formData.get("startTime")
  });

  if (!result.success) {
    return { status: "error", message: result.error };
  }

  revalidatePath("/book");
  return { status: "success", message: "Booking confirmed" };
};

export const payBookingAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  void prevState;
  await requireRole("CUSTOMER");
  const result = await createPayment({
    bookingId: formData.get("bookingId"),
    amount: Number(formData.get("amount"))
  });

  if (!result.success) {
    return { status: "error", message: result.error };
  }

  revalidatePath("/book");
  return { status: "success", message: "Payment recorded" };
};
