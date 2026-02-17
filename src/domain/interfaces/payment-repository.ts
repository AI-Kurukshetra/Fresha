import type { Payment } from "../entities/payment";
import type { BookingId } from "../types/common";

export interface PaymentRepository {
  create(data: Omit<Payment, "id" | "createdAt">): Promise<Payment>;
  findByBookingId(bookingId: BookingId): Promise<Payment | null>;
}
