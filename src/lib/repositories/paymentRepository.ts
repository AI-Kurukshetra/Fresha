import { z } from "zod";
import type { Payment } from "@/domain/entities/payment";
import type { BookingId } from "@/domain/types/common";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";
import { toBookingId, toPaymentId } from "@/lib/utils/branding";

interface PaymentRow {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  transaction_id: string;
  created_at: string;
}

const PaymentStatusSchema = z.enum(["UNPAID", "PAID", "FAILED"]);

const mapPayment = (row: PaymentRow): Payment => ({
  id: toPaymentId(row.id),
  bookingId: toBookingId(row.booking_id),
  amount: row.amount,
  status: PaymentStatusSchema.parse(row.status),
  transactionId: row.transaction_id,
  createdAt: row.created_at
});

export const paymentRepository = {
  async create(data: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from("payments")
      .insert({
        booking_id: data.bookingId,
        amount: data.amount,
        status: data.status,
        transaction_id: data.transactionId
      })
      .select("id, booking_id, amount, status, transaction_id, created_at")
      .single();

    if (error || !created) {
      logger.error({ error }, "Failed to create payment");
      throw new Error("Unable to create payment");
    }

    return mapPayment(created);
  },
  async findByBookingId(bookingId: BookingId): Promise<Payment | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("payments")
      .select("id, booking_id, amount, status, transaction_id, created_at")
      .eq("booking_id", bookingId)
      .single();

    if (error || !data) {
      return null;
    }

    return mapPayment(data);
  }
};
