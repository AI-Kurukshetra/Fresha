export const APP_NAME = "Fresha Studio" as const;

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
export const PAYMENT_STATUSES = ["UNPAID", "PAID", "FAILED"] as const;
export const USER_ROLES = ["ADMIN", "STAFF", "CUSTOMER"] as const;

export const MINUTES_PER_HOUR = 60 as const;
export const SLOT_BUFFER_MINUTES = 0 as const;

export const DASHBOARD_PATHS = {
  admin: "/admin",
  staff: "/staff",
  customer: "/book"
} as const;
