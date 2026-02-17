import type { StaffId, UserId } from "../types/common";

export interface Staff {
  id: StaffId;
  name: string;
  expertise: string;
  workStartTime: string;
  workEndTime: string;
  userId?: UserId;
}
