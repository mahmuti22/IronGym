-- IronGym — Production RLS (secure catalog + admin CRUD)
-- =============================================================================
-- PREREQUISITES (run first if not already applied):
--   1. docs/supabase-schema.sql
--   2. docs/supabase-auth-admin.sql  (admin_profiles + public.is_admin())
--   3. Admin users in auth.users + rows in public.admin_profiles
--
-- APPLY: Supabase Dashboard → SQL Editor → paste & run this entire file.
-- Safe to re-run: drops old MVP/recommended policies before recreating.
--
-- Does NOT use service_role in the frontend — only anon + authenticated + RLS.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Harden public.is_admin() — must match app check (role = 'admin')
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
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. admin_profiles — read own row only; no API writes
-- ---------------------------------------------------------------------------
alter table public.admin_profiles enable row level security;

drop policy if exists "admin_profiles_select_own" on public.admin_profiles;
drop policy if exists "admin_profiles_insert" on public.admin_profiles;
drop policy if exists "admin_profiles_update" on public.admin_profiles;
drop policy if exists "admin_profiles_delete" on public.admin_profiles;

create policy "admin_profiles_select_own"
  on public.admin_profiles
  for select
  to authenticated
  using (id = auth.uid());

-- No insert/update/delete policies → denied for anon & authenticated via API.
-- Add admins manually in SQL Editor (service role / dashboard), e.g.:
--   insert into public.admin_profiles (id, email, role)
--   values ('<auth.users uuid>', 'irfan.mahmuti@hotmail.com', 'admin');

revoke all on public.admin_profiles from anon;
revoke insert, update, delete on public.admin_profiles from authenticated;
grant select on public.admin_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Enable RLS on catalog tables
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_collections enable row level security;
alter table public.product_images enable row level security;

-- ---------------------------------------------------------------------------
-- 4. Drop ALL legacy / MVP / recommended policies (idempotent)
-- ---------------------------------------------------------------------------
-- MVP (docs/supabase-schema.sql)
drop policy if exists "categories_select_anon" on public.categories;
drop policy if exists "categories_insert_anon" on public.categories;
drop policy if exists "categories_update_anon" on public.categories;
drop policy if exists "categories_delete_anon" on public.categories;

drop policy if exists "collections_select_anon" on public.collections;
drop policy if exists "collections_insert_anon" on public.collections;
drop policy if exists "collections_update_anon" on public.collections;
drop policy if exists "collections_delete_anon" on public.collections;

drop policy if exists "products_select_anon" on public.products;
drop policy if exists "products_insert_anon" on public.products;
drop policy if exists "products_update_anon" on public.products;
drop policy if exists "products_delete_anon" on public.products;

drop policy if exists "product_collections_select_anon" on public.product_collections;
drop policy if exists "product_collections_insert_anon" on public.product_collections;
drop policy if exists "product_collections_delete_anon" on public.product_collections;

drop policy if exists "product_images_select_anon" on public.product_images;
drop policy if exists "product_images_insert_anon" on public.product_images;
drop policy if exists "product_images_update_anon" on public.product_images;
drop policy if exists "product_images_delete_anon" on public.product_images;

-- Recommended / production (re-run safe)
drop policy if exists "categories_select_public" on public.categories;
drop policy if exists "categories_select_admin" on public.categories;
drop policy if exists "categories_admin_insert" on public.categories;
drop policy if exists "categories_admin_update" on public.categories;
drop policy if exists "categories_admin_delete" on public.categories;

drop policy if exists "collections_select_public" on public.collections;
drop policy if exists "collections_select_admin" on public.collections;
drop policy if exists "collections_admin_insert" on public.collections;
drop policy if exists "collections_admin_update" on public.collections;
drop policy if exists "collections_admin_delete" on public.collections;

drop policy if exists "products_select_published" on public.products;
drop policy if exists "products_select_admin" on public.products;
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;

drop policy if exists "product_collections_select_public" on public.product_collections;
drop policy if exists "product_collections_select_admin" on public.product_collections;
drop policy if exists "product_collections_admin_insert" on public.product_collections;
drop policy if exists "product_collections_admin_update" on public.product_collections;
drop policy if exists "product_collections_admin_delete" on public.product_collections;

drop policy if exists "product_images_select_published" on public.product_images;
drop policy if exists "product_images_select_admin" on public.product_images;
drop policy if exists "product_images_admin_insert" on public.product_images;
drop policy if exists "product_images_admin_update" on public.product_images;
drop policy if exists "product_images_admin_delete" on public.product_images;

-- ---------------------------------------------------------------------------
-- 5. GRANTs — anon read-only on public catalog; authenticated writes via RLS
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.categories to anon, authenticated;
grant select on public.collections to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_collections to anon, authenticated;
grant select on public.product_images to anon, authenticated;

revoke insert, update, delete on public.categories from anon;
revoke insert, update, delete on public.collections from anon;
revoke insert, update, delete on public.products from anon;
revoke insert, update, delete on public.product_collections from anon;
revoke insert, update, delete on public.product_images from anon;

grant insert, update, delete on public.categories to authenticated;
grant insert, update, delete on public.collections to authenticated;
grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.product_collections to authenticated;
grant insert, update, delete on public.product_images to authenticated;

-- ---------------------------------------------------------------------------
-- 6. categories — anon/authenticated: visible only; admin: all + write
-- ---------------------------------------------------------------------------
create policy "categories_select_public"
  on public.categories
  for select
  to anon, authenticated
  using (status = 'visible');

create policy "categories_select_admin"
  on public.categories
  for select
  to authenticated
  using (public.is_admin());

create policy "categories_admin_insert"
  on public.categories
  for insert
  to authenticated
  with check (public.is_admin());

create policy "categories_admin_update"
  on public.categories
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_admin_delete"
  on public.categories
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. collections — anon/authenticated: visible only; admin: all + write
-- ---------------------------------------------------------------------------
create policy "collections_select_public"
  on public.collections
  for select
  to anon, authenticated
  using (status = 'visible');

create policy "collections_select_admin"
  on public.collections
  for select
  to authenticated
  using (public.is_admin());

create policy "collections_admin_insert"
  on public.collections
  for insert
  to authenticated
  with check (public.is_admin());

create policy "collections_admin_update"
  on public.collections
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "collections_admin_delete"
  on public.collections
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 8. products — public: published only; admin: all + write
-- ---------------------------------------------------------------------------
create policy "products_select_published"
  on public.products
  for select
  to anon, authenticated
  using (status = 'published');

create policy "products_select_admin"
  on public.products
  for select
  to authenticated
  using (public.is_admin());

create policy "products_admin_insert"
  on public.products
  for insert
  to authenticated
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 9. product_collections — public: links to published products; admin: full
-- ---------------------------------------------------------------------------
create policy "product_collections_select_public"
  on public.product_collections
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.status = 'published'
    )
  );

create policy "product_collections_select_admin"
  on public.product_collections
  for select
  to authenticated
  using (public.is_admin());

create policy "product_collections_admin_insert"
  on public.product_collections
  for insert
  to authenticated
  with check (public.is_admin());

create policy "product_collections_admin_update"
  on public.product_collections
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "product_collections_admin_delete"
  on public.product_collections
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 10. product_images — public: images of published products; admin: full
-- ---------------------------------------------------------------------------
create policy "product_images_select_published"
  on public.product_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.status = 'published'
    )
  );

create policy "product_images_select_admin"
  on public.product_images
  for select
  to authenticated
  using (public.is_admin());

create policy "product_images_admin_insert"
  on public.product_images
  for insert
  to authenticated
  with check (public.is_admin());

create policy "product_images_admin_update"
  on public.product_images
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "product_images_admin_delete"
  on public.product_images
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 11. Quick verification queries (optional, run manually after apply)
-- ---------------------------------------------------------------------------
-- select tablename, policyname, roles, cmd
-- from pg_policies
-- where schemaname = 'public'
-- order by tablename, policyname;
--
-- select id, email, role from public.admin_profiles;
-- select public.is_admin();  -- returns false in SQL Editor (no JWT)
