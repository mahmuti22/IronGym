-- IronGym — Orders + order_items (guest checkout + admin management)
-- =============================================================================
-- PREREQUISITES:
--   docs/supabase-schema.sql
--   docs/supabase-auth-admin.sql
--   docs/supabase-rls-production.sql (public.is_admin())
--
-- APPLY: Supabase Dashboard → SQL Editor → run this file (safe to re-run).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- updated_at trigger (reuse if already exists from schema)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_first_name text not null,
  customer_last_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  shipping_city text not null,
  shipping_postcode text not null,
  shipping_country text not null,
  customer_notes text,
  subtotal numeric not null default 0,
  shipping_total numeric not null default 0,
  discount_total numeric not null default 0,
  total numeric not null default 0,
  currency text not null default 'CHF',
  status text not null default 'new',
  payment_status text not null default 'pending',
  payment_method text default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_order_number_idx on public.orders(order_number);
create index if not exists orders_customer_email_idx on public.orders(customer_email);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_slug text not null,
  product_name text not null,
  product_image_url text,
  selected_size text,
  selected_color text,
  unit_price numeric not null,
  quantity int not null check (quantity > 0),
  line_total numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_slug_idx on public.order_items(product_slug);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Drop legacy / previous policy names (idempotent)
drop policy if exists "orders_insert_checkout" on public.orders;
drop policy if exists "orders_insert_anon" on public.orders;
drop policy if exists "orders_insert_admin" on public.orders;
drop policy if exists "orders_select_admin" on public.orders;
drop policy if exists "orders_update_admin" on public.orders;
drop policy if exists "orders_delete_admin" on public.orders;

drop policy if exists "order_items_insert_checkout" on public.order_items;
drop policy if exists "order_items_insert_anon" on public.order_items;
drop policy if exists "order_items_insert_admin" on public.order_items;
drop policy if exists "order_items_select_admin" on public.order_items;
drop policy if exists "order_items_update_admin" on public.order_items;
drop policy if exists "order_items_delete_admin" on public.order_items;

-- orders — guest checkout (anon): INSERT only, no read/update/delete
create policy "orders_insert_anon"
  on public.orders
  for insert
  to anon
  with check (true);

-- orders — admin (authenticated + is_admin)
create policy "orders_select_admin"
  on public.orders
  for select
  to authenticated
  using (public.is_admin());

create policy "orders_insert_admin"
  on public.orders
  for insert
  to authenticated
  with check (public.is_admin());

create policy "orders_update_admin"
  on public.orders
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "orders_delete_admin"
  on public.orders
  for delete
  to authenticated
  using (public.is_admin());

-- order_items — guest checkout (anon): INSERT only
-- Note: do NOT use EXISTS (select from orders) here — anon cannot SELECT orders.
create policy "order_items_insert_anon"
  on public.order_items
  for insert
  to anon
  with check (true);

-- order_items — admin
create policy "order_items_select_admin"
  on public.order_items
  for select
  to authenticated
  using (public.is_admin());

create policy "order_items_insert_admin"
  on public.order_items
  for insert
  to authenticated
  with check (public.is_admin());

create policy "order_items_update_admin"
  on public.order_items
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "order_items_delete_admin"
  on public.order_items
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- GRANTs (table-level; required before RLS policies apply)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon;
grant usage on schema public to authenticated;

grant insert on public.orders to anon;
grant insert on public.order_items to anon;

grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;

-- ---------------------------------------------------------------------------
-- Verify (optional)
-- ---------------------------------------------------------------------------
-- select grantee, privilege_type, table_name
-- from information_schema.role_table_grants
-- where table_schema = 'public' and table_name in ('orders', 'order_items');
--
-- select tablename, policyname, roles, cmd
-- from pg_policies
-- where schemaname = 'public' and tablename in ('orders', 'order_items');
