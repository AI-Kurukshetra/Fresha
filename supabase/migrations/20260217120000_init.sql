create extension if not exists "pgcrypto";
create extension if not exists "btree_gist";

create type public.user_role as enum ('ADMIN', 'STAFF', 'CUSTOMER');
create type public.booking_status as enum ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
create type public.payment_status as enum ('UNPAID', 'PAID', 'FAILED');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'CUSTOMER',
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(10, 2) not null check (price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  expertise text not null,
  work_start_time time not null,
  work_end_time time not null,
  user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (work_end_time > work_start_time)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  staff_id uuid not null references public.staff(id) on delete restrict,
  customer_id uuid not null references public.users(id) on delete restrict,
  date date not null,
  start_time time not null,
  end_time time not null,
  status public.booking_status not null default 'PENDING',
  payment_status public.payment_status not null default 'UNPAID',
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  amount numeric(10, 2) not null check (amount >= 0),
  status public.payment_status not null,
  transaction_id text not null unique,
  created_at timestamptz not null default now(),
  unique (booking_id)
);

alter table public.bookings
  add constraint booking_no_overlap
  exclude using gist (
    staff_id with =,
    tsrange(date + start_time, date + end_time, '[)') with &&
  )
  where (status <> 'CANCELLED');

create index if not exists bookings_staff_date_idx on public.bookings (staff_id, date);
create index if not exists bookings_customer_date_idx on public.bookings (customer_id, date);
create index if not exists services_name_idx on public.services (name);
create index if not exists staff_name_idx on public.staff (name);
create index if not exists payments_created_idx on public.payments (created_at);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Guest'),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'CUSTOMER')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'ADMIN');
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'STAFF');
$$;

alter table public.users enable row level security;
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

create policy "users_read_self" on public.users
  for select using (auth.uid() = id or public.is_admin());

create policy "services_read_all" on public.services
  for select using (true);

create policy "services_admin_manage" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "staff_read_all" on public.staff
  for select using (true);

create policy "staff_admin_manage" on public.staff
  for all using (public.is_admin()) with check (public.is_admin());

create policy "bookings_customer_read" on public.bookings
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "bookings_staff_read" on public.bookings
  for select using (
    exists (
      select 1 from public.staff
      where staff.id = bookings.staff_id
        and staff.user_id = auth.uid()
    )
  );

create policy "bookings_customer_insert" on public.bookings
  for insert with check (customer_id = auth.uid());

create policy "bookings_customer_update" on public.bookings
  for update using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "bookings_staff_update" on public.bookings
  for update using (
    exists (
      select 1 from public.staff
      where staff.id = bookings.staff_id
        and staff.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.staff
      where staff.id = bookings.staff_id
        and staff.user_id = auth.uid()
    )
  );

create policy "payments_insert" on public.payments
  for insert with check (
    exists (
      select 1 from public.bookings
      where bookings.id = payments.booking_id
        and bookings.customer_id = auth.uid()
    )
  );

create policy "payments_read" on public.payments
  for select using (
    public.is_admin() or
    exists (
      select 1 from public.bookings
      where bookings.id = payments.booking_id
        and (bookings.customer_id = auth.uid())
    )
  );
