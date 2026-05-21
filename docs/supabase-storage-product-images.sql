-- IronGym — Supabase Storage: bucket product-images + RLS
-- =============================================================================
-- PREREQUISITES:
--   - docs/supabase-auth-admin.sql (public.is_admin())
--   - Admin users in public.admin_profiles
--
-- STEP 1 — Dashboard (recommended):
--   Storage → New bucket
--   - Name: product-images
--   - Public bucket: ON (public read for shop)
--
-- STEP 2 — Run this SQL in SQL Editor (idempotent)
-- =============================================================================

-- Create public bucket (skip if you already created it in the UI)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Drop legacy policies on storage.objects for this bucket (re-run safe)
-- ---------------------------------------------------------------------------
drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;

-- ---------------------------------------------------------------------------
-- Public read — shop and visitors can load image URLs
-- ---------------------------------------------------------------------------
create policy "product_images_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'product-images');

-- ---------------------------------------------------------------------------
-- Admin write — authenticated session + admin_profiles
-- ---------------------------------------------------------------------------
create policy "product_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

create policy "product_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  )
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

create policy "product_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- Optional verification
-- ---------------------------------------------------------------------------
-- select id, name, public from storage.buckets where id = 'product-images';
-- select policyname, roles, cmd from pg_policies
--   where schemaname = 'storage' and tablename = 'objects'
--   and policyname like 'product_images%';
