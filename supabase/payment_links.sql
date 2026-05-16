-- Optional: mirror payment records in Supabase for reporting.
-- Primary storage uses Firestore (payment_links, payment_settings).

create table if not exists payment_links (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  order_id text not null,
  customer_name text not null,
  amount numeric(12, 2) not null,
  pin text not null,
  upi_id text not null,
  payee_name text not null,
  expires_in_minutes int not null check (expires_in_minutes between 5 and 30),
  expires_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  created_at timestamptz not null default now()
);

create index if not exists payment_links_status_idx on payment_links (status);
create index if not exists payment_links_created_at_idx on payment_links (created_at desc);

alter table payment_links enable row level security;

-- Admin-only access when using Supabase Auth with admin role claims.
