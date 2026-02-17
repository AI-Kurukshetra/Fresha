import type { Booking } from "../entities/booking";
import type { BookingId, StaffId, UserId } from "../types/common";

export interface BookingRepository {
  listAll(): Promise<Booking[]>;
  listByCustomer(customerId: UserId): Promise<Booking[]>;
  listByStaff(staffId: StaffId): Promise<Booking[]>;
  listByStaffAndDate(staffId: StaffId, date: string): Promise<Booking[]>;
  create(data: Omit<Booking, "id" | "createdAt">): Promise<Booking>;
  updateStatus(id: BookingId, status: Booking["status"]): Promise<Booking>;
  updatePaymentStatus(id: BookingId, status: Booking["paymentStatus"]): Promise<Booking>;
}
