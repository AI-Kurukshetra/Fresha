import { z } from "zod";
import type { BookingId, PaymentId, ServiceId, StaffId, UserId } from "@/domain/types/common";

const uuidSchema = z.string().uuid();

export const toUserId = (value: string): UserId => uuidSchema.parse(value) as UserId;
export const toServiceId = (value: string): ServiceId => uuidSchema.parse(value) as ServiceId;
export const toStaffId = (value: string): StaffId => uuidSchema.parse(value) as StaffId;
export const toBookingId = (value: string): BookingId => uuidSchema.parse(value) as BookingId;
export const toPaymentId = (value: string): PaymentId => uuidSchema.parse(value) as PaymentId;
