import type { BookingId, BookingStatus, PaymentStatus, ServiceId, StaffId, UserId } from "../types/common";

export interface Booking {
  id: BookingId;
  serviceId: ServiceId;
  staffId: StaffId;
  customerId: UserId;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
