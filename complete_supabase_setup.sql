-- =====================================================================
-- MBSx BGMI Store - Complete Supabase Schema
-- Includes: Accounts, UC Prices, Xsuit/Supercar Gifts, Reviews, Proofs, 
-- and Payment Manager settings.
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ACCOUNTS (Products)
CREATE TABLE IF NOT EXISTS public.products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC NOT NULL,
  category        TEXT DEFAULT 'Budget',
  status          TEXT DEFAULT 'available',
  youtube_url     TEXT,
  primary_login   TEXT,
  secondary_login TEXT,
  garuntee        TEXT, -- Note: legacy spelling preserved for frontend compatibility
  tag             TEXT DEFAULT 'None',
  image_urls      TEXT[], -- Array of Cloudinary URLs
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UC PRICES
CREATE TABLE IF NOT EXISTS public.uc_prices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uc_amount       INTEGER NOT NULL,
  market_price    NUMERIC,
  offer_price     NUMERIC NOT NULL,
  bonus_uc        INTEGER DEFAULT 0,
  tag             TEXT, -- e.g. 'Best Value', 'Hot'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. XSUIT GIFTS (Catalog)
CREATE TABLE IF NOT EXISTS public.xsuit_gifts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  price           NUMERIC NOT NULL,
  image_url       TEXT,
  tag             TEXT DEFAULT 'None',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUPERCAR GIFTS (Catalog)
CREATE TABLE IF NOT EXISTS public.supercar_gifts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  price           NUMERIC NOT NULL,
  type            TEXT, -- e.g. 'Sports', 'SUV'
  image_url       TEXT,
  tag             TEXT DEFAULT 'None',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  comment         TEXT,
  rating          INTEGER CHECK (rating >= 1 AND rating <= 5),
  status          TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROOFS (Deal Screenshots)
CREATE TABLE IF NOT EXISTS public.proofs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT,
  image_url       TEXT NOT NULL,
  month           TEXT, -- e.g. 'May 2024'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADMIN PAYMENT SETTINGS (Global Defaults)
CREATE TABLE IF NOT EXISTS public.admin_payment_settings (
  id              INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one row
  payee_name      TEXT,
  payee_upi_id    TEXT,
  bank_name       TEXT,
  account_holder  TEXT,
  account_number  TEXT,
  ifsc_code       TEXT,
  branch          TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize settings row if it doesn't exist
INSERT INTO public.admin_payment_settings (id, payee_name)
VALUES (1, 'MBS Admin')
ON CONFLICT (id) DO NOTHING;

-- 8. PAYMENT LINKS (Generated Checkout Pages)
CREATE TABLE IF NOT EXISTS public.payment_links (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id  TEXT,
  customer_name   TEXT,
  amount          NUMERIC NOT NULL,
  status          TEXT DEFAULT 'active', -- active, revoked, paid
  expires_at      TIMESTAMPTZ,
  note            TEXT,
  pin             TEXT,
  payee_name      TEXT,
  payee_upi       TEXT,
  bank_details    JSONB, -- Snapshotted bank info at time of generation
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- DISABLE ROW LEVEL SECURITY (RLS) FOR ADMIN ACCESS
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.xsuit_gifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.supercar_gifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proofs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_payment_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links DISABLE ROW LEVEL SECURITY;

