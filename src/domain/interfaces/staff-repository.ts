import type { Staff } from "../entities/staff";
import type { StaffId, UserId } from "../types/common";

export interface StaffRepository {
  list(): Promise<Staff[]>;
  findById(id: StaffId): Promise<Staff | null>;
  findByUserId(userId: UserId): Promise<Staff | null>;
  create(data: Omit<Staff, "id">): Promise<Staff>;
  update(id: StaffId, data: Partial<Omit<Staff, "id">>): Promise<Staff>;
  remove(id: StaffId): Promise<void>;
}
