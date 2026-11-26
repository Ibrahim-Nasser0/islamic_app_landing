-- Note: Superseded by ./supabase_schema.sql (full schema: admin_users, feedback, download_events, site_notices, app_releases).
-- Run this SQL inside your Supabase SQL Editor when you create your Admin Panel project
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text unique,
  category text not null check (category in ('bug', 'suggestion', 'adhan_times', 'other')),
  message text not null,
  device_info text,
  contact text,
  locale text default 'ar',
  status text not null default 'new' check (status in ('new', 'reviewing', 'resolved', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Only service_role (used securely in Next.js /api/feedback) or authenticated admins in your Admin Panel can read/update
create policy "Allow admin authenticated read and update"
  on public.feedback
  for all
  to authenticated
  using (true)
  with check (true);
