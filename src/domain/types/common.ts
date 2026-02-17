export type Brand<K, T> = K & { readonly brand: T };

export type UserId = Brand<string, "UserId">;
export type ServiceId = Brand<string, "ServiceId">;
export type StaffId = Brand<string, "StaffId">;
export type BookingId = Brand<string, "BookingId">;
export type PaymentId = Brand<string, "PaymentId">;

export type Role = "ADMIN" | "STAFF" | "CUSTOMER";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED";

export type IsoDateString = Brand<string, "IsoDateString">;
export type TimeString = Brand<string, "TimeString">;
