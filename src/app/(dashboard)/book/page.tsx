import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ActionForm } from "@/components/features/ActionForm";
import { BookingFilters } from "@/components/features/BookingFilters";
import { BookingList, type BookingListItem } from "@/components/features/BookingList";
import { requireRole } from "@/lib/services/authService";
import { getServicesLive, getStaffLive } from "@/lib/services/catalogService";
import { getAvailableSlots } from "@/lib/use-cases/bookingUseCases";
import { bookingRepository } from "@/lib/repositories/bookingRepository";
import { getTodayIso, formatDate, formatTime } from "@/lib/utils/date";
import { bookAppointmentAction, payBookingAction } from "@/app/(dashboard)/book/actions";
import { toUserId } from "@/lib/utils/branding";

interface BookPageProps {
  searchParams?: {
    service?: string;
    staff?: string;
    date?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function BookPage({ searchParams }: BookPageProps) {
  const user = await requireRole("CUSTOMER");
  const [services, staff] = await Promise.all([getServicesLive(), getStaffLive()]);

  const defaultService = services[0];
  const defaultStaff = staff[0];

  const serviceId = searchParams?.service ?? defaultService?.id ?? "";
  const staffId = searchParams?.staff ?? defaultStaff?.id ?? "";
  const date = searchParams?.date ?? getTodayIso();

  const slots = serviceId && staffId ? await getAvailableSlots({ serviceId, staffId, date }) : [];
  const bookings = await bookingRepository.listByCustomer(toUserId(user.id));
  const servicePriceMap = new Map(services.map((service) => [service.id, service.price]));
  const serviceNameMap = new Map(services.map((service) => [service.id, service.name]));
  const selectedService = services.find((service) => service.id === serviceId);
  const selectedStaff = staff.find((member) => member.id === staffId);
  const bookingItems: BookingListItem[] = bookings.map((booking) => ({
    id: booking.id,
    date: booking.date,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    title: `${formatDate(booking.date)} - ${formatTime(booking.startTime)}`,
    subtitle: `Status: ${booking.status}`,
    searchable: `${serviceNameMap.get(booking.serviceId) ?? ""} ${booking.status} ${booking.paymentStatus} ${booking.date}`,
    rightSlot: (
      <>
        <span className="rounded-full bg-beige-100 px-3 py-1 text-xs font-semibold text-charcoal-700">
          {booking.paymentStatus}
        </span>
        <ActionForm action={payBookingAction} className="flex items-center">
          <input type="hidden" name="bookingId" value={booking.id} />
          <input type="hidden" name="amount" value={String(servicePriceMap.get(booking.serviceId) ?? 0)} />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            className={`min-w-[120px] whitespace-nowrap ${
              booking.paymentStatus === "PAID"
                ? "bg-beige-100 text-charcoal-600 hover:bg-beige-100"
                : "bg-rose-600 text-white hover:bg-rose-700"
            }`}
            disabled={booking.paymentStatus === "PAID"}
          >
            {booking.paymentStatus === "PAID" ? "Paid" : "Pay now"}
          </Button>
        </ActionForm>
      </>
    )
  }));

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="font-display text-3xl text-ink-900">Book your next ritual</h1>
        <p className="text-sm text-ink-600">Choose a service, expert, and time slot that suits your day.</p>
      </section>

      <Card className="space-y-6">
        <BookingFilters
          services={services.map((service) => ({
            id: service.id,
            label: `${service.name} - ${service.durationMinutes} min`
          }))}
          staff={staff.map((member) => ({
            id: member.id,
            label: `${member.name} - ${member.expertise}`
          }))}
          initialServiceId={serviceId}
          initialStaffId={staffId}
          initialDate={date}
        />
      </Card>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink-900">Available time slots</h2>
        <p className="text-sm text-ink-600">
          {selectedStaff && selectedService
            ? `Showing availability for ${selectedStaff.name} (${selectedStaff.workStartTime} - ${selectedStaff.workEndTime}) with ${selectedService.durationMinutes} min slots.`
            : "Select a service, specialist, and date to view slots."}
        </p>
        <Card>
          {slots.length === 0 ? (
            <p className="text-sm text-ink-600">Select service, staff, and date to view slots.</p>
          ) : (
            <ActionForm action={bookAppointmentAction} className="grid gap-3 md:grid-cols-4">
              <input type="hidden" name="serviceId" value={serviceId} />
              <input type="hidden" name="staffId" value={staffId} />
              <input type="hidden" name="date" value={date} />
              {slots.map((slot) => (
                <Button
                  key={`${slot.startTime}-${slot.endTime}`}
                  type="submit"
                  name="startTime"
                  value={slot.startTime}
                  variant={slot.available ? "primary" : "outline"}
                  className={
                    slot.available
                      ? "bg-rose-600 text-white hover:bg-rose-700 shadow-soft"
                      : "border-charcoal-100 text-charcoal-500"
                  }
                  disabled={!slot.available}
                >
                  {formatTime(slot.startTime)}
                </Button>
              ))}
            </ActionForm>
          )}
        </Card>
      </section>

      <BookingList
        title="Your bookings"
        items={bookingItems}
        emptyMessage="No bookings yet. Your next appointment will appear here."
      />
    </div>
  );
}
