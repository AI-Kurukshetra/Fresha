import type { ServiceId } from "../types/common";

export interface Service {
  id: ServiceId;
  name: string;
  durationMinutes: number;
  price: number;
}
