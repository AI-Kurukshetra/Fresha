import { cache } from "react";
import { createSupabaseServerClient } from "@/infrastructure/database/supabaseServer";
import { getTodayIso } from "@/lib/utils/date";

export interface AdminStats {
  bookingsToday: number;
  revenueToday: number;
}

export const getAdminStats = cache(async (): Promise<AdminStats> => {
  const supabase = await createSupabaseServerClient();
  const today = getTodayIso();

  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("date", today);

  const { data: payments } = await supabase
    .from("payments")
    .select("amount, created_at")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  const revenueToday = (payments ?? []).reduce((total, payment) => total + Number(payment.amount), 0);

  return {
    bookingsToday: bookingCount ?? 0,
    revenueToday
  };
});
