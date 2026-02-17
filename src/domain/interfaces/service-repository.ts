import type { Service } from "../entities/service";
import type { ServiceId } from "../types/common";

export interface ServiceRepository {
  list(): Promise<Service[]>;
  findById(id: ServiceId): Promise<Service | null>;
  create(data: Omit<Service, "id">): Promise<Service>;
  update(id: ServiceId, data: Partial<Omit<Service, "id">>): Promise<Service>;
  remove(id: ServiceId): Promise<void>;
}
