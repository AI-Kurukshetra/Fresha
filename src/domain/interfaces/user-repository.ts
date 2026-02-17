import type { User } from "../entities/user";
import type { Role, UserId } from "../types/common";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  create(data: Omit<User, "id"> & { id: UserId }): Promise<User>;
  updateRole(id: UserId, role: Role): Promise<User>;
}
