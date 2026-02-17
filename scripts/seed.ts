import dotenv from "dotenv";
import { createSupabaseAdminClient } from "../src/infrastructure/database/supabaseAdmin";
import { logger } from "../src/lib/logger";

dotenv.config({ path: ".env.local" });
dotenv.config();

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

interface ServiceSeed {
  name: string;
  duration_minutes: number;
  price: number;
}

interface StaffSeed {
  name: string;
  expertise: string;
  work_start_time: string;
  work_end_time: string;
  user_id?: string | null;
}

const seedUsers: SeedUser[] = [
  { name: "Admin Rivera", email: "admin@fresha.demo", password: "Admin123!", role: "ADMIN" },
  { name: "Casey Moore", email: "customer1@fresha.demo", password: "Customer123!", role: "CUSTOMER" },
  { name: "Jordan Lee", email: "customer2@fresha.demo", password: "Customer123!", role: "CUSTOMER" },
  { name: "Arielle Chen", email: "staff@fresha.demo", password: "Staff123!", role: "STAFF" }
];

const serviceSeeds: ServiceSeed[] = [
  { name: "Restorative Facial", duration_minutes: 60, price: 95 },
  { name: "Signature Blowout", duration_minutes: 45, price: 65 },
  { name: "Thermal Stone Massage", duration_minutes: 90, price: 140 }
];

const staffSeeds: StaffSeed[] = [
  { name: "Arielle Chen", expertise: "Facial artistry", work_start_time: "09:00", work_end_time: "17:00" },
  { name: "Diego Martins", expertise: "Holistic massage", work_start_time: "10:00", work_end_time: "18:00" },
  { name: "Imani Brooks", expertise: "Nail design", work_start_time: "11:00", work_end_time: "19:00" }
];

const getTodayIso = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date: string, days: number) => {
  const base = new Date(`${date}T00:00:00`);
  base.setDate(base.getDate() + days);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, "0");
  const day = String(base.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ensureUser = async (supabase: ReturnType<typeof createSupabaseAdminClient>, user: SeedUser) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      name: user.name,
      role: user.role
    }
  });

  if (error && !error.message.toLowerCase().includes("already")) {
    throw new Error(error.message);
  }

  if (data.user) {
    return data.user.id;
  }

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (listError || !listData) {
    throw new Error("Unable to locate existing user");
  }

  const existing = listData.users.find((item) => item.email?.toLowerCase() === user.email.toLowerCase());
  if (!existing) {
    throw new Error("Existing user not found");
  }

  return existing.id;
};

const seed = async () => {
  const supabase = createSupabaseAdminClient();

  const userIds = new Map<string, string>();
  for (const user of seedUsers) {
    const id = await ensureUser(supabase, user);
    userIds.set(user.email, id);

    const { error } = await supabase.from("users").upsert({
      id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  const { data: existingServices } = await supabase
    .from("services")
    .select("id, name")
    .in(
      "name",
      serviceSeeds.map((service) => service.name)
    );

  const existingServiceNames = new Set(existingServices?.map((service) => service.name) ?? []);
  const servicesToInsert = serviceSeeds.filter((service) => !existingServiceNames.has(service.name));

  if (servicesToInsert.length > 0) {
    const { error } = await supabase.from("services").insert(servicesToInsert);
    if (error) {
      throw new Error(error.message);
    }
  }

  const { data: services } = await supabase.from("services").select("id, name, duration_minutes, price");
  if (!services) {
    throw new Error("Services missing after seed");
  }

  const staffWithUser = staffSeeds.map((member) => ({
    ...member,
    user_id: member.name === "Arielle Chen" ? userIds.get("staff@fresha.demo") ?? null : null
  }));

  const { data: existingStaff } = await supabase
    .from("staff")
    .select("id, name")
    .in(
      "name",
      staffWithUser.map((member) => member.name)
    );

  const existingStaffNames = new Set(existingStaff?.map((member) => member.name) ?? []);
  const staffToInsert = staffWithUser.filter((member) => !existingStaffNames.has(member.name));

  if (staffToInsert.length > 0) {
    const { error } = await supabase.from("staff").insert(staffToInsert);
    if (error) {
      throw new Error(error.message);
    }
  }

  const { data: staff } = await supabase.from("staff").select("id, name, work_start_time, work_end_time");
  if (!staff) {
    throw new Error("Staff missing after seed");
  }

  const { count: bookingCount } = await supabase.from("bookings").select("id", { count: "exact", head: true });
  if ((bookingCount ?? 0) === 0) {
    const today = getTodayIso();
    const dayTwo = addDays(today, 1);

    const serviceMap = new Map(services.map((service) => [service.name, service]));
    const staffMap = new Map(staff.map((member) => [member.name, member]));

    const bookingsSeed = [
      {
        service_id: serviceMap.get("Restorative Facial")?.id,
        staff_id: staffMap.get("Arielle Chen")?.id,
        customer_id: userIds.get("customer1@fresha.demo"),
        date: today,
        start_time: "10:00",
        end_time: "11:00",
        status: "CONFIRMED",
        payment_status: "PAID"
      },
      {
        service_id: serviceMap.get("Signature Blowout")?.id,
        staff_id: staffMap.get("Imani Brooks")?.id,
        customer_id: userIds.get("customer2@fresha.demo"),
        date: today,
        start_time: "12:30",
        end_time: "13:15",
        status: "CONFIRMED",
        payment_status: "UNPAID"
      },
      {
        service_id: serviceMap.get("Thermal Stone Massage")?.id,
        staff_id: staffMap.get("Diego Martins")?.id,
        customer_id: userIds.get("customer1@fresha.demo"),
        date: today,
        start_time: "14:00",
        end_time: "15:30",
        status: "CONFIRMED",
        payment_status: "PAID"
      },
      {
        service_id: serviceMap.get("Signature Blowout")?.id,
        staff_id: staffMap.get("Arielle Chen")?.id,
        customer_id: userIds.get("customer2@fresha.demo"),
        date: dayTwo,
        start_time: "11:00",
        end_time: "11:45",
        status: "CONFIRMED",
        payment_status: "UNPAID"
      },
      {
        service_id: serviceMap.get("Restorative Facial")?.id,
        staff_id: staffMap.get("Arielle Chen")?.id,
        customer_id: userIds.get("customer1@fresha.demo"),
        date: dayTwo,
        start_time: "15:00",
        end_time: "16:00",
        status: "CONFIRMED",
        payment_status: "PAID"
      }
    ];

    const validBookings = bookingsSeed.filter(
      (booking) => booking.service_id && booking.staff_id && booking.customer_id
    );

    const { data: createdBookings, error } = await supabase.from("bookings").insert(validBookings).select("id, payment_status");
    if (error) {
      throw new Error(error.message);
    }

    const paymentsSeed = (createdBookings ?? [])
      .filter((booking) => booking.payment_status === "PAID")
      .map((booking, index) => ({
        booking_id: booking.id,
        amount: 100 + index * 20,
        status: "PAID",
        transaction_id: `SEED-TXN-${booking.id.slice(0, 8).toUpperCase()}`
      }));

    if (paymentsSeed.length > 0) {
      const { error: paymentError } = await supabase.from("payments").insert(paymentsSeed);
      if (paymentError) {
        throw new Error(paymentError.message);
      }
    }
  }

  logger.info("Seed complete");
};

seed().catch((error) => {
  logger.error({ error }, "Seed failed");
  process.exit(1);
});
