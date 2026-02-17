import { z } from "zod";
import { nanoid } from "nanoid";
import type { Result } from "@/domain/types/result";
import type { Booking } from "@/domain/entities/booking";
import type { Payment } from "@/domain/entities/payment";
import { bookingRepository } from "@/lib/repositories/bookingRepository";
import { serviceRepository } from "@/lib/repositories/serviceRepository";
import { staffRepository } from "@/lib/repositories/staffRepository";
import { paymentRepository } from "@/lib/repositories/paymentRepository";
import { generateTimeSlots, type TimeSlot } from "@/lib/utils/slots";
import { logger } from "@/lib/logger";
import { toBookingId, toServiceId, toStaffId, toUserId } from "@/lib/utils/branding";
import { parseTimeToMinutes, minutesToTime } from "@/lib/utils/time";

const BookingInputSchema = z.object({
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  customerId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/)
});

const PaymentInputSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive()
});

const normalizeDateInput = (value: string): string | null => {
  if (!value) {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return `${year}-${month}-${day}`;
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.slice(0, 10);
  }
  return null;
};

const normalizeBookingDate = (value: string): string | null => normalizeDateInput(value);

export const getAvailableSlots = async (params: {
  serviceId: string;
  staffId: string;
  date: string;
}): Promise<TimeSlot[]> => {
  try {
    const normalizedDate = normalizeDateInput(params.date);
    if (!normalizedDate) {
      logger.warn({ date: params.date }, "Invalid date for slot lookup");
      return [];
    }

    const serviceId = toServiceId(params.serviceId);
    const staffId = toStaffId(params.staffId);

    const [service, staff] = await Promise.all([
      serviceRepository.findById(serviceId),
      staffRepository.findById(staffId)
    ]);

    if (!service || !staff) {
      return [];
    }

    const bookings = await bookingRepository.listByStaffAndDate(staffId, normalizedDate);
    const bookingWindows = bookings
      .filter((booking) => normalizeBookingDate(booking.date) === normalizedDate)
      .map((booking) => ({
      startTime: booking.startTime,
      endTime: booking.endTime
    }));

    return generateTimeSlots(staff.workStartTime, staff.workEndTime, service.durationMinutes, bookingWindows);
  } catch (error) {
    logger.warn({ error }, "Slot generation failed");
    return [];
  }
};

export const createBooking = async (input: unknown): Promise<Result<Booking>> => {
  const parsed = BookingInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid booking data" };
  }

  try {
    const normalizedDate = normalizeDateInput(parsed.data.date);
    if (!normalizedDate) {
      return { success: false, error: "Invalid booking date" };
    }

    const serviceId = toServiceId(parsed.data.serviceId);
    const staffId = toStaffId(parsed.data.staffId);
    const customerId = toUserId(parsed.data.customerId);

    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      return { success: false, error: "Service not found" };
    }

    const startMinutes = parseTimeToMinutes(parsed.data.startTime);
    const endTimeValue = minutesToTime(startMinutes + service.durationMinutes);

    const booking = await bookingRepository.create({
      serviceId,
      staffId,
      customerId,
      date: normalizedDate,
      startTime: parsed.data.startTime,
      endTime: endTimeValue,
      status: "CONFIRMED",
      paymentStatus: "UNPAID"
    });

    return { success: true, data: booking };
  } catch (error) {
    logger.error({ error }, "Booking creation failed");
    const maybeError = error as { code?: string } | null;
    if (maybeError?.code === "23P01") {
      return { success: false, error: "Selected time is no longer available" };
    }
    return { success: false, error: "Failed to create booking" };
  }
};

export const markBookingCompleted = async (bookingId: string): Promise<Result<Booking>> => {
  try {
    const booking = await bookingRepository.updateStatus(toBookingId(bookingId), "COMPLETED");
    return { success: true, data: booking };
  } catch (error) {
    logger.error({ error }, "Failed to complete booking");
    return { success: false, error: "Unable to update booking" };
  }
};

export const createPayment = async (input: unknown): Promise<Result<Payment>> => {
  const parsed = PaymentInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid payment data" };
  }

  try {
    const payment = await paymentRepository.create({
      bookingId: toBookingId(parsed.data.bookingId),
      amount: parsed.data.amount,
      status: "PAID",
      transactionId: `TXN-${nanoid(10).toUpperCase()}`
    });

    await bookingRepository.updatePaymentStatus(toBookingId(parsed.data.bookingId), "PAID");

    return { success: true, data: payment };
  } catch (error) {
    logger.error({ error }, "Payment failed");
    return { success: false, error: "Payment failed" };
  }
};
