-- IronGym — Recommended RLS policies (apply AFTER admin auth works)
-- WARNING: This removes permissive anon write access. Test admin CRUD after applying.
-- Run only when admin_profiles and admin users are set up.

-- Requires public.is_admin() from docs/supabase-auth-admin.sql

-- ---------------------------------------------------------------------------
-- Drop MVP permissive policies
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- categories — public read visible, admin full write
-- ---------------------------------------------------------------------------
create policy "categories_select_public"
  on public.categories for select
  to anon, authenticated
  using (status = 'visible');

create policy "categories_admin_insert"
  on public.categories for insert
  to authenticated
  with check (public.is_admin());

create policy "categories_admin_update"
  on public.categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_admin_delete"
  on public.categories for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- collections — public read visible, admin full write
-- ---------------------------------------------------------------------------
create policy "collections_select_public"
  on public.collections for select
  to anon, authenticated
  using (status = 'visible');

create policy "collections_admin_insert"
  on public.collections for insert
  to authenticated
  with check (public.is_admin());

create policy "collections_admin_update"
  on public.collections for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "collections_admin_delete"
  on public.collections for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- products — public read published only; admin read/write all
-- ---------------------------------------------------------------------------
create policy "products_select_published"
  on public.products for select
  to anon, authenticated
  using (status = 'published');

create policy "products_select_admin"
  on public.products for select
  to authenticated
  using (public.is_admin());

create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- product_collections & product_images — admin only (except published via join later)
-- ---------------------------------------------------------------------------
create policy "product_collections_select_admin"
  on public.product_collections for select
  to authenticated
  using (public.is_admin());

create policy "product_collections_admin_insert"
  on public.product_collections for insert
  to authenticated
  with check (public.is_admin());

create policy "product_collections_admin_delete"
  on public.product_collections for delete
  to authenticated
  using (public.is_admin());

create policy "product_images_select_published"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );

create policy "product_images_select_admin"
  on public.product_images for select
  to authenticated
  using (public.is_admin());

create policy "product_images_admin_insert"
  on public.product_images for insert
  to authenticated
  with check (public.is_admin());

create policy "product_images_admin_update"
  on public.product_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "product_images_admin_delete"
  on public.product_images for delete
  to authenticated
  using (public.is_admin());
