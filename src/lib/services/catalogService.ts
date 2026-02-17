import { cache } from "react";
import { serviceRepository } from "@/lib/repositories/serviceRepository";
import { staffRepository } from "@/lib/repositories/staffRepository";

export const getServicesCached = cache(async () => serviceRepository.list());
export const getStaffCached = cache(async () => staffRepository.list());
export const getServicesLive = async () => serviceRepository.list();
export const getStaffLive = async () => staffRepository.list();
