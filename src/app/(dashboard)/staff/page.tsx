import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActionForm, FormSubmitButton } from "@/components/features/ActionForm";
import { BookingList, type BookingListItem } from "@/components/features/BookingList";
import { requireRole } from "@/lib/services/authService";
import { staffRepository } from "@/lib/repositories/staffRepository";
import { bookingRepository } from "@/lib/repositories/bookingRepository";
import { formatDate, formatTime } from "@/lib/utils/date";
import { completeBookingAction } from "@/app/(dashboard)/staff/actions";
import { toUserId } from "@/lib/utils/branding";

export default async function StaffPage() {
  const user = await requireRole("STAFF");
  const staffProfile = await staffRepository.findByUserId(toUserId(user.id));

  if (!staffProfile) {
    return (
      <Card>
        <h1 className="font-display text-2xl text-ink-900">Staff profile missing</h1>
        <p className="text-sm text-ink-600">Ask an admin to link your account to a staff profile.</p>
      </Card>
    );
  }

  const bookings = await bookingRepository.listByStaff(staffProfile.id);
  const bookingItems: BookingListItem[] = bookings.map((booking) => ({
    id: booking.id,
    date: booking.date,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    title: `${formatDate(booking.date)} - ${formatTime(booking.startTime)}`,
    subtitle: `Status: ${booking.status}`,
    searchable: `${booking.status} ${booking.paymentStatus} ${booking.date}`,
    rightSlot: (
      <>
        <Badge variant={booking.paymentStatus === "PAID" ? "mint" : "cloud"}>{booking.paymentStatus}</Badge>
        {booking.status !== "COMPLETED" ? (
          <ActionForm action={completeBookingAction} className="flex">
            <input type="hidden" name="bookingId" value={booking.id} />
            <FormSubmitButton type="submit" size="sm" variant="secondary" pendingText="Completing...">
              Mark complete
            </FormSubmitButton>
          </ActionForm>
        ) : null}
      </>
    )
  }));

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <h1 className="font-display text-3xl text-ink-900">Hello {staffProfile.name}</h1>
          <p className="text-sm text-ink-600">Here is your schedule and booking status for today.</p>
        </div>
        <Card className="p-6">
          <div className="flex h-full min-h-[240px] flex-col justify-between rounded-2xl border border-charcoal-100 bg-gradient-to-br from-beige-50 via-white to-transparent p-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Today</p>
              <h3 className="font-display text-2xl text-ink-900">Staff schedule</h3>
              <p className="text-sm text-ink-600">
                Review your appointments, confirm client readiness, and complete sessions as they wrap.
              </p>
            </div>
            <div className="mt-6 grid gap-2 text-xs text-ink-600">
              <div className="flex items-center justify-between">
                <span>Shift window</span>
                <span className="font-semibold text-ink-900">
                  {staffProfile.workStartTime} - {staffProfile.workEndTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="font-semibold text-ink-900">On shift</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <BookingList title="Your bookings" items={bookingItems} emptyMessage="No bookings assigned yet." />
      </section>
    </div>
  );
}
