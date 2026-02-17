import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ActionForm } from "@/components/features/ActionForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { BookingList, type BookingListItem } from "@/components/features/BookingList";
import { requireRole } from "@/lib/services/authService";
import { getAdminStats } from "@/lib/services/dashboardService";
import { getServicesCached, getStaffCached } from "@/lib/services/catalogService";
import { bookingRepository } from "@/lib/repositories/bookingRepository";
import { formatDate, formatTime } from "@/lib/utils/date";
import {
  createServiceAction,
  createStaffAction,
  deleteServiceAction,
  deleteStaffAction,
  updateServiceAction,
  updateStaffAction
} from "@/app/(dashboard)/admin/actions";

export default async function AdminPage() {
  await requireRole("ADMIN");

  const [stats, services, staff, bookings] = await Promise.all([
    getAdminStats(),
    getServicesCached(),
    getStaffCached(),
    bookingRepository.listAll()
  ]);

  const serviceMap = new Map(services.map((service) => [service.id, service]));
  const staffMap = new Map(staff.map((member) => [member.id, member]));
  const bookingItems: BookingListItem[] = bookings.map((booking) => {
    const service = serviceMap.get(booking.serviceId);
    const staffMember = staffMap.get(booking.staffId);
    return {
      id: booking.id,
      date: booking.date,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      title: service?.name ?? "Service",
      subtitle: `${formatDate(booking.date)} - ${formatTime(booking.startTime)} to ${formatTime(booking.endTime)} • ${
        staffMember?.name ?? "Staff"
      } • ${booking.status}`,
      searchable: `${service?.name ?? ""} ${staffMember?.name ?? ""} ${booking.status} ${booking.paymentStatus} ${booking.date}`,
      rightSlot: (
        <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700">
          {booking.paymentStatus}
        </span>
      )
    };
  });

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <h1 className="font-display text-3xl text-ink-900">Admin command center</h1>
          <p className="text-sm text-ink-600">
            Track daily performance, manage services, and keep your team aligned.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard label="Bookings today" value={stats.bookingsToday} />
            <StatCard label="Revenue today" value={`$${stats.revenueToday.toFixed(2)}`} />
          </div>
        </div>
        <Card className="p-6">
          <div className="flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-ink-100 bg-gradient-to-br from-emerald-50 via-white to-transparent p-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Today</p>
              <h3 className="font-display text-2xl text-ink-900">Studio pulse</h3>
              <p className="text-sm text-ink-600">
                See what is booked, paid, and ready for your team to deliver.
              </p>
            </div>
            <div className="mt-6 grid gap-2 text-xs text-ink-600">
              <div className="flex items-center justify-between">
                <span>Peak window</span>
                <span className="font-semibold text-ink-900">11:00 AM - 2:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Top service</span>
                <span className="font-semibold text-ink-900">Restorative Facial</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section id="services" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink-900">Services</h2>
            <Badge variant="mint">Active</Badge>
          </div>
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col gap-4 border border-ink-100 shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{service.name}</p>
                    <p className="text-xs text-ink-600">
                      {service.durationMinutes} minutes - ${service.price.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant="cloud">Live</Badge>
                </div>
                <ActionForm action={updateServiceAction} className="grid gap-3 md:grid-cols-3">
                  <input type="hidden" name="id" value={service.id} />
                  <Input name="name" label="Name" defaultValue={service.name} required />
                  <Input
                    name="durationMinutes"
                    label="Duration"
                    type="number"
                    min={15}
                    max={240}
                    defaultValue={service.durationMinutes}
                    required
                  />
                  <Input
                    name="price"
                    label="Price"
                    type="number"
                    min={1}
                    max={500}
                    step="0.01"
                    defaultValue={service.price}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </div>
                </ActionForm>
                <form action={deleteServiceAction} className="flex justify-end">
                  <input type="hidden" name="id" value={service.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Remove service
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="font-display text-xl text-ink-900">Add new service</h3>
          <ActionForm action={createServiceAction}>
            <Input name="name" label="Service name" required />
            <Input name="durationMinutes" label="Duration (min)" type="number" min={15} max={240} required />
            <Input name="price" label="Price" type="number" min={1} max={500} step="0.01" required />
            <Button type="submit">Create service</Button>
          </ActionForm>
        </Card>
      </section>

      <section id="staff" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink-900">Staff</h2>
            <Badge variant="mint">On shift</Badge>
          </div>
          <div className="space-y-4">
            {staff.map((member) => (
              <Card key={member.id} className="flex flex-col gap-4 border border-ink-100 shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{member.name}</p>
                    <p className="text-xs text-ink-600">
                      {member.expertise} - {member.workStartTime} to {member.workEndTime}
                    </p>
                  </div>
                  <Badge variant="cloud">Scheduled</Badge>
                </div>
                <ActionForm action={updateStaffAction} className="grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={member.id} />
                  <Input name="name" label="Name" defaultValue={member.name} required />
                  <Input name="expertise" label="Expertise" defaultValue={member.expertise} required />
                  <Input name="workStartTime" label="Start" type="time" defaultValue={member.workStartTime} required />
                  <Input name="workEndTime" label="End" type="time" defaultValue={member.workEndTime} required />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </div>
                </ActionForm>
                <form action={deleteStaffAction} className="flex justify-end">
                  <input type="hidden" name="id" value={member.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Remove staff
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="font-display text-xl text-ink-900">Add new staff</h3>
          <ActionForm action={createStaffAction}>
            <Input name="name" label="Staff name" required />
            <Input name="expertise" label="Expertise" required />
            <Input name="workStartTime" label="Work start" type="time" required />
            <Input name="workEndTime" label="Work end" type="time" required />
            <Button type="submit">Add staff</Button>
          </ActionForm>
        </Card>
      </section>

      <section id="bookings" className="space-y-4">
        <BookingList title="All bookings" items={bookingItems} emptyMessage="No bookings yet." />
      </section>
    </div>
  );
}
