-- IronGym — Supabase Auth + admin_profiles (Step 3)
-- Run in Supabase SQL Editor after docs/supabase-schema.sql

-- ---------------------------------------------------------------------------
-- admin_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create index if not exists admin_profiles_email_idx on public.admin_profiles(email);

alter table public.admin_profiles enable row level security;

-- Authenticated users can read only their own row (app checks admin access)
drop policy if exists "admin_profiles_select_own" on public.admin_profiles;
create policy "admin_profiles_select_own"
  on public.admin_profiles
  for select
  to authenticated
  using (id = auth.uid());

-- No insert/update/delete via API — add admins manually in SQL Editor (see below)

-- ---------------------------------------------------------------------------
-- Helper: is the current user an admin?
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- HOW TO CREATE TWO ADMIN ACCOUNTS
-- ---------------------------------------------------------------------------
-- 1) Supabase Dashboard → Authentication → Users → Add user
--    Create each user with email + password (e.g. admin1@..., admin2@...).
--    Copy each user's UUID from the Users table.
--
-- 2) Insert into admin_profiles (replace UUID and email):
--
-- insert into public.admin_profiles (id, email, role)
-- values
--   ('00000000-0000-0000-0000-000000000001', 'admin1@example.com', 'admin'),
--   ('00000000-0000-0000-0000-000000000002', 'admin2@example.com', 'admin');
--
-- 3) Verify:
-- select * from public.admin_profiles;
--
-- 4) Login at http://localhost:3000/admin/login
