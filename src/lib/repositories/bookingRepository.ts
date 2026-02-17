import { z } from "zod";
import type { Booking } from "@/domain/entities/booking";
import type { BookingId, StaffId, UserId } from "@/domain/types/common";
import { logger } from "@/lib/logger";
import { toBookingId, toServiceId, toStaffId, toUserId } from "@/lib/utils/branding";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";

interface BookingRow {
  id: string;
  service_id: string;
  staff_id: string;
  customer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const BookingStatusSchema = z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]);
const PaymentStatusSchema = z.enum(["UNPAID", "PAID", "FAILED"]);

const mapBooking = (row: BookingRow): Booking => ({
  id: toBookingId(row.id),
  serviceId: toServiceId(row.service_id),
  staffId: toStaffId(row.staff_id),
  customerId: toUserId(row.customer_id),
  date: row.date,
  startTime: row.start_time,
  endTime: row.end_time,
  status: BookingStatusSchema.parse(row.status),
  paymentStatus: PaymentStatusSchema.parse(row.payment_status),
  createdAt: row.created_at
});

export const bookingRepository = {
  async listAll(): Promise<Booking[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, service_id, staff_id, customer_id, date, start_time, end_time, status, payment_status, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) {
      logger.error({ error }, "Failed to list bookings");
      return [];
    }

    return data.map(mapBooking);
  },
  async listByCustomer(customerId: UserId): Promise<Booking[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, service_id, staff_id, customer_id, date, start_time, end_time, status, payment_status, created_at")
      .eq("customer_id", customerId)
      .order("date", { ascending: false });

    if (error || !data) {
      logger.error({ error, customerId }, "Failed to list customer bookings");
      return [];
    }

    return data.map(mapBooking);
  },
  async listByStaff(staffId: StaffId): Promise<Booking[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, service_id, staff_id, customer_id, date, start_time, end_time, status, payment_status, created_at")
      .eq("staff_id", staffId)
      .order("date", { ascending: true });

    if (error || !data) {
      logger.error({ error, staffId }, "Failed to list staff bookings");
      return [];
    }

    return data.map(mapBooking);
  },
  async listByStaffAndDate(staffId: StaffId, date: string): Promise<Booking[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, service_id, staff_id, customer_id, date, start_time, end_time, status, payment_status, created_at")
      .eq("staff_id", staffId)
      .eq("date", date)
      .neq("status", "CANCELLED")
      .order("start_time", { ascending: true });

    if (error || !data) {
      logger.error({ error, staffId, date }, "Failed to list bookings by staff and date");
      return [];
    }

    return data.map(mapBooking);
  },
  async create(data: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from("bookings")
      .insert({
        service_id: data.serviceId,
        staff_id: data.staffId,
        customer_id: data.customerId,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        status: data.status,
        payment_status: data.paymentStatus
      })
      .select("id, service_id, staff_id, customer_id, date, start_time, end_time, status, payment_status, created_at")
      .single();

    if (error || !created) {
      logger.error({ error }, "Failed to create booking");
      throw error ?? new Error("Unable to create booking");
    }

    return mapBooking(created);
  },
  async updateStatus(id: BookingId, status: Booking["status"]): Promise<Booking> {
    const supabase = await createSupabaseServerClient();
    const { data: updated, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select("id, service_id, staff_id, customer_id, date, start_time, end_time, status, payment_status, created_at")
      .single();

    if (error || !updated) {
      logger.error({ error, id }, "Failed to update booking status");
      throw new Error("Unable to update booking status");
    }

    return mapBooking(updated);
  },
  async updatePaymentStatus(id: BookingId, status: Booking["paymentStatus"]): Promise<Booking> {
    const supabase = await createSupabaseServerClient();
    const { data: updated, error } = await supabase
      .from("bookings")
      .update({ payment_status: status })
      .eq("id", id)
      .select("id, service_id, staff_id, customer_id, date, start_time, end_time, status, payment_status, created_at")
      .single();

    if (error || !updated) {
      logger.error({ error, id }, "Failed to update payment status");
      throw new Error("Unable to update payment status");
    }

    return mapBooking(updated);
  }
};
