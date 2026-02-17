# Fresha Studio — Salon & Spa Booking MVP

Production-ready MVP inspired by Fresha, built with Next.js App Router, TypeScript strict mode, and Supabase.

## Stack
- Next.js (App Router)
- React 19
- TypeScript (strict)
- Supabase (Auth, Postgres)
- Tailwind CSS
- Vercel-ready

## Core Features
- Customer booking with dynamic time slots
- Double booking prevention with database exclusion constraints
- Admin services and staff management
- Staff schedule view and completion updates
- Simulated payment tracking with transaction IDs
- Role-based access control

## Demo Accounts (Seeded)
- Admin: `admin@fresha.demo` / `Admin123!`
- Staff: `staff@fresha.demo` / `Staff123!`
- Customer: `customer1@fresha.demo` / `Customer123!`
- Customer: `customer2@fresha.demo` / `Customer123!`

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example` and fill values.
3. Run migrations in Supabase.
4. Seed demo data:
   ```bash
   npm run seed
   ```
5. Start the app:
   ```bash
   npm run dev
   ```

## Supabase Setup
1. Create a new Supabase project.
2. In the Supabase SQL editor, run the migration file:
   - `supabase/migrations/20260217120000_init.sql`
3. Copy project keys into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (required for `npm run seed` only)

## Booking Logic
- Time slots are generated based on staff working hours.
- Slot length equals service duration.
- A PostgreSQL exclusion constraint prevents overlapping bookings by staff.

## Deployment (Vercel)
1. Push the repository to GitHub.
2. Create a Vercel project and import the repo.
3. Add environment variables from `.env.local` in Vercel Settings.
4. Deploy.

## Project Structure
```
src/
  app/
    (auth)/
    (dashboard)/
  components/
    ui/
    features/
    layouts/
  config/
  domain/
  infrastructure/
  lib/
  scripts/
  supabase/
```

## Scripts
- `npm run dev` — local development
- `npm run build` — production build
- `npm run seed` — seed demo data
- `npm run typecheck` — TypeScript strict check

## Notes
- Supabase Row Level Security is enabled.
- Admin privileges are enforced via database policies and server actions.
- The app uses server components by default and server actions for mutations.
