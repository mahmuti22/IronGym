-- IronGym — Stripe payment fields on orders
-- =============================================================================
-- PREREQUISITES: docs/supabase-orders.sql
-- APPLY: Supabase Dashboard → SQL Editor (safe to re-run)
-- =============================================================================

alter table public.orders
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_customer_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists payment_provider text default 'manual';

create index if not exists orders_stripe_session_id_idx on public.orders(stripe_session_id);
create index if not exists orders_stripe_payment_intent_id_idx on public.orders(stripe_payment_intent_id);
