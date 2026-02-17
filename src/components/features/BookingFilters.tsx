"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface OptionItem {
  id: string;
  label: string;
}

interface BookingFiltersProps {
  services: OptionItem[];
  staff: OptionItem[];
  initialServiceId: string;
  initialStaffId: string;
  initialDate: string;
}

const buildQuery = (serviceId: string, staffId: string, date: string): string => {
  const params = new URLSearchParams();
  if (serviceId) params.set("service", serviceId);
  if (staffId) params.set("staff", staffId);
  if (date) params.set("date", date);
  return params.toString();
};

export function BookingFilters({
  services,
  staff,
  initialServiceId,
  initialStaffId,
  initialDate
}: BookingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  const defaultService = useMemo(() => initialServiceId || services[0]?.id || "", [initialServiceId, services]);
  const defaultStaff = useMemo(() => initialStaffId || staff[0]?.id || "", [initialStaffId, staff]);

  const [serviceId, setServiceId] = useState<string>(defaultService);
  const [staffId, setStaffId] = useState<string>(defaultStaff);
  const [date, setDate] = useState<string>(initialDate);

  const queryState = useMemo(
    () => ({
      service: searchParams?.get("service") ?? "",
      staff: searchParams?.get("staff") ?? "",
      date: searchParams?.get("date") ?? ""
    }),
    [searchParams]
  );

  const isDirty =
    (serviceId || "") !== (queryState.service || "") ||
    (staffId || "") !== (queryState.staff || "") ||
    (date || "") !== (queryState.date || "");

  const applyFilters = () => {
    const query = buildQuery(serviceId, staffId, date);
    startTransition(() => {
      router.replace(query ? `/book?${query}` : "/book");
      router.refresh();
    });
  };

  useEffect(() => {
    if (!isDirty) {
      setIsAutoRefreshing(false);
      return;
    }
    setIsAutoRefreshing(true);
    const timer = setTimeout(() => {
      applyFilters();
    }, 250);
    return () => clearTimeout(timer);
  }, [isDirty, serviceId, staffId, date]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Select
          name="service"
          label="Service"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.label}
            </option>
          ))}
        </Select>
        <Select
          name="staff"
          label="Specialist"
          value={staffId}
          onChange={(event) => setStaffId(event.target.value)}
        >
          {staff.map((member) => (
            <option key={member.id} value={member.id}>
              {member.label}
            </option>
          ))}
        </Select>
        <Input
          name="date"
          label="Date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="button"
          variant="primary"
          className="min-w-[180px] bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={applyFilters}
          disabled={isPending}
        >
          {isPending ? "Refreshing..." : "Refresh slots"}
        </Button>
        {isPending ? (
          <div className="flex items-center gap-2 text-xs text-ink-600">
            <span className="h-1.5 w-8 rounded-full bg-emerald-200 animate-pulse" />
            <span className="h-1.5 w-5 rounded-full bg-emerald-300 animate-pulse" />
            <span className="h-1.5 w-12 rounded-full bg-emerald-200 animate-pulse" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
