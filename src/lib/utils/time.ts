import { MINUTES_PER_HOUR } from "@/config/constants";

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map((value) => Number(value));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error("Invalid time format");
  }
  return hours * MINUTES_PER_HOUR + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const normalized = Math.max(0, minutes);
  const hours = Math.floor(normalized / MINUTES_PER_HOUR);
  const mins = normalized % MINUTES_PER_HOUR;
  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(mins).padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}`;
};

export const addMinutes = (time: string, increment: number): string => {
  return minutesToTime(parseTimeToMinutes(time) + increment);
};
