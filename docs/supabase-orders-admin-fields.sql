-- IronGym — Admin order fields + status timestamps
-- =============================================================================
-- PREREQUISITES: docs/supabase-orders.sql
-- APPLY: Supabase Dashboard → SQL Editor (safe to re-run)
-- =============================================================================

alter table public.orders
  add column if not exists internal_notes text,
  add column if not exists tracking_number text,
  add column if not exists shipping_carrier text,
  add column if not exists shipped_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists cancelled_at timestamptz;

-- Set shipped_at / completed_at / cancelled_at on first transition to that status
create or replace function public.orders_set_status_timestamps()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'shipped' and new.shipped_at is null then
    new.shipped_at := now();
  end if;

  if new.status = 'completed' and new.completed_at is null then
    new.completed_at := now();
  end if;

  if new.status = 'cancelled' and new.cancelled_at is null then
    new.cancelled_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists orders_status_timestamps on public.orders;
create trigger orders_status_timestamps
  before update on public.orders
  for each row
  execute function public.orders_set_status_timestamps();
