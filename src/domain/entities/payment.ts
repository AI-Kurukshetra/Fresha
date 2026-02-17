import type { BookingId, PaymentId, PaymentStatus } from "../types/common";

export interface Payment {
  id: PaymentId;
  bookingId: BookingId;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  createdAt: string;
}
