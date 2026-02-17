import type { Role, UserId } from "../types/common";

export interface User {
  id: UserId;
  name: string;
  email: string;
  role: Role;
}
