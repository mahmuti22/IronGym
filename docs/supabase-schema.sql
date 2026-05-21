-- IronGym — Supabase schema (Step 2 admin, no auth yet)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at trigger
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
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  group_slug text,
  status text not null default 'visible',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_parent_id_idx on public.categories(parent_id);
create index if not exists categories_group_slug_idx on public.categories(group_slug);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- collections
-- ---------------------------------------------------------------------------
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  hero_image_url text,
  status text not null default 'visible',
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price numeric not null,
  sale_price numeric,
  category_id uuid references public.categories(id) on delete set null,
  subcategory_id uuid references public.categories(id) on delete set null,
  gender text not null default 'unisex',
  short_description text,
  long_description text,
  material text,
  fit text,
  care_instructions text,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  tags text[] not null default '{}',
  status text not null default 'draft',
  stock_status text not null default 'in_stock',
  main_image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products(status);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_subcategory_id_idx on public.products(subcategory_id);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- product_collections
-- ---------------------------------------------------------------------------
create table if not exists public.product_collections (
  product_id uuid not null references public.products(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

-- ---------------------------------------------------------------------------
-- Admin auth: run docs/supabase-auth-admin.sql after this file
-- Production RLS: docs/supabase-rls-production.sql (after admins exist)
-- Legacy: docs/supabase-rls-recommended.sql (superseded by production file)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- RLS (MVP: permissive policies; tighten with supabase-rls-recommended.sql)
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_collections enable row level security;
alter table public.product_images enable row level security;

-- categories
drop policy if exists "categories_select_anon" on public.categories;
create policy "categories_select_anon" on public.categories for select to anon, authenticated using (true);
drop policy if exists "categories_insert_anon" on public.categories;
create policy "categories_insert_anon" on public.categories for insert to anon, authenticated with check (true);
drop policy if exists "categories_update_anon" on public.categories;
create policy "categories_update_anon" on public.categories for update to anon, authenticated using (true) with check (true);
drop policy if exists "categories_delete_anon" on public.categories;
create policy "categories_delete_anon" on public.categories for delete to anon, authenticated using (true);

-- collections
drop policy if exists "collections_select_anon" on public.collections;
create policy "collections_select_anon" on public.collections for select to anon, authenticated using (true);
drop policy if exists "collections_insert_anon" on public.collections;
create policy "collections_insert_anon" on public.collections for insert to anon, authenticated with check (true);
drop policy if exists "collections_update_anon" on public.collections;
create policy "collections_update_anon" on public.collections for update to anon, authenticated using (true) with check (true);
drop policy if exists "collections_delete_anon" on public.collections;
create policy "collections_delete_anon" on public.collections for delete to anon, authenticated using (true);

-- products
drop policy if exists "products_select_anon" on public.products;
create policy "products_select_anon" on public.products for select to anon, authenticated using (true);
drop policy if exists "products_insert_anon" on public.products;
create policy "products_insert_anon" on public.products for insert to anon, authenticated with check (true);
drop policy if exists "products_update_anon" on public.products;
create policy "products_update_anon" on public.products for update to anon, authenticated using (true) with check (true);
drop policy if exists "products_delete_anon" on public.products;
create policy "products_delete_anon" on public.products for delete to anon, authenticated using (true);

-- product_collections
drop policy if exists "product_collections_select_anon" on public.product_collections;
create policy "product_collections_select_anon" on public.product_collections for select to anon, authenticated using (true);
drop policy if exists "product_collections_insert_anon" on public.product_collections;
create policy "product_collections_insert_anon" on public.product_collections for insert to anon, authenticated with check (true);
drop policy if exists "product_collections_delete_anon" on public.product_collections;
create policy "product_collections_delete_anon" on public.product_collections for delete to anon, authenticated using (true);

-- product_images
drop policy if exists "product_images_select_anon" on public.product_images;
create policy "product_images_select_anon" on public.product_images for select to anon, authenticated using (true);
drop policy if exists "product_images_insert_anon" on public.product_images;
create policy "product_images_insert_anon" on public.product_images for insert to anon, authenticated with check (true);
drop policy if exists "product_images_update_anon" on public.product_images;
create policy "product_images_update_anon" on public.product_images for update to anon, authenticated using (true) with check (true);
drop policy if exists "product_images_delete_anon" on public.product_images;
create policy "product_images_delete_anon" on public.product_images for delete to anon, authenticated using (true);
