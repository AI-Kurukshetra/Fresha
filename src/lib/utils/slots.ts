import { parseTimeToMinutes, minutesToTime } from "@/lib/utils/time";

export interface BookingWindow {
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

const overlaps = (slotStart: number, slotEnd: number, booking: BookingWindow): boolean => {
  const bookingStart = parseTimeToMinutes(booking.startTime);
  const bookingEnd = parseTimeToMinutes(booking.endTime);
  return slotStart < bookingEnd && slotEnd > bookingStart;
};

export const generateTimeSlots = (
  workStart: string,
  workEnd: string,
  durationMinutes: number,
  existingBookings: BookingWindow[]
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const start = parseTimeToMinutes(workStart);
  const end = parseTimeToMinutes(workEnd);

  for (let current = start; current + durationMinutes <= end; current += durationMinutes) {
    const slotStart = current;
    const slotEnd = current + durationMinutes;
    const slot = {
      startTime: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd)
    };

    const isBooked = existingBookings.some((booking) => overlaps(slotStart, slotEnd, booking));
    slots.push({
      ...slot,
      available: !isBooked
    });
  }

  return slots;
};
