-- IronGym — Customer accounts + order ownership
-- =============================================================================
-- PREREQUISITES:
--   docs/supabase-schema.sql
--   docs/supabase-auth-admin.sql
--   docs/supabase-orders.sql
--   docs/supabase-rls-production.sql (public.is_admin())
--
-- APPLY: Supabase Dashboard → SQL Editor (safe to re-run)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- customer_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  phone text,
  default_address text,
  default_city text,
  default_postcode text,
  default_country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_profiles_email_idx on public.customer_profiles(email);

drop trigger if exists customer_profiles_set_updated_at on public.customer_profiles;
create trigger customer_profiles_set_updated_at
  before update on public.customer_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- orders.customer_id
-- ---------------------------------------------------------------------------
alter table public.orders
  add column if not exists customer_id uuid references auth.users(id) on delete set null;

create index if not exists orders_customer_id_idx on public.orders(customer_id);

-- ---------------------------------------------------------------------------
-- RLS — customer_profiles
-- ---------------------------------------------------------------------------
alter table public.customer_profiles enable row level security;

drop policy if exists "customer_profiles_select_own" on public.customer_profiles;
drop policy if exists "customer_profiles_insert_own" on public.customer_profiles;
drop policy if exists "customer_profiles_update_own" on public.customer_profiles;

create policy "customer_profiles_select_own"
  on public.customer_profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "customer_profiles_insert_own"
  on public.customer_profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "customer_profiles_update_own"
  on public.customer_profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update on public.customer_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Auto-create customer_profiles on auth sign-up (works without client session)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_auth_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customer_profiles (
    id,
    email,
    first_name,
    last_name,
    default_country
  )
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'first_name', null),
    coalesce(new.raw_user_meta_data->>'last_name', null),
    'Svizzera'
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(excluded.first_name, customer_profiles.first_name),
    last_name = coalesce(excluded.last_name, customer_profiles.last_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_customer_profile on auth.users;
create trigger on_auth_user_created_customer_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_customer_profile();

-- ---------------------------------------------------------------------------
-- RLS — orders (customer read + logged-in checkout insert)
-- ---------------------------------------------------------------------------
drop policy if exists "orders_select_customer" on public.orders;
drop policy if exists "orders_insert_customer" on public.orders;

create policy "orders_select_customer"
  on public.orders
  for select
  to authenticated
  using (
    customer_id = auth.uid()
    or (
      customer_id is null
      and lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "orders_insert_customer"
  on public.orders
  for insert
  to authenticated
  with check (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RLS — order_items (customer read own order lines)
-- ---------------------------------------------------------------------------
drop policy if exists "order_items_select_customer" on public.order_items;

create policy "order_items_select_customer"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_id
        and (
          o.customer_id = auth.uid()
          or (
            o.customer_id is null
            and lower(o.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
          )
        )
    )
  );

-- Logged-in checkout: items only for orders owned by the customer (order row inserted first)
create policy "order_items_insert_customer"
  on public.order_items
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.orders o
      where o.id = order_id
        and o.customer_id = auth.uid()
    )
  );
