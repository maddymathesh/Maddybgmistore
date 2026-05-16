-- =====================================================================
-- MBSx Transaction Panel - Full Schema Update
-- Run this in Supabase SQL Editor to sync with the new form fields
-- =====================================================================

-- Drop old tables if they exist (re-run safe)
DROP TABLE IF EXISTS public.account_transactions CASCADE;
DROP TABLE IF EXISTS public.xsuit_transactions CASCADE;
DROP TABLE IF EXISTS public.supercar_transactions CASCADE;
DROP TABLE IF EXISTS public.uc_transactions CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;

-- 1. MAIN TRANSACTIONS TABLE
CREATE TABLE public.transactions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id      TEXT UNIQUE NOT NULL,        -- e.g. MBSAID001
  transaction_type    TEXT NOT NULL DEFAULT 'Account',
  transaction_date    DATE NOT NULL,
  mode_of_deal        TEXT,                        -- WhatsApp, Telegram, etc.
  mode_of_payment     TEXT,                        -- Full UPI, EMI, etc.
  payment_status      TEXT,                        -- Fully Paid, Pending, Pending EMI
  owner_price         NUMERIC,                     -- Cost Price
  sold_price          NUMERIC,                     -- Sold Price
  profit              NUMERIC,                     -- Auto-calculated
  buyer_phone         TEXT,
  owner_phone         TEXT,
  seller_phone        TEXT,
  reseller_phone      TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ACCOUNT TRANSACTIONS DETAIL TABLE
CREATE TABLE public.account_transactions (
  id                              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref                 TEXT REFERENCES public.transactions(transaction_id) ON DELETE CASCADE,
  product_link                    TEXT,
  primary_login_provider          TEXT,
  primary_credentials             TEXT,
  primary_mothermail_status       TEXT,
  secondary_login_provider        TEXT,
  secondary_credentials           TEXT,
  secondary_mothermail_status     TEXT,
  guarantee_plan                  TEXT,
  primary_unlink_date             DATE,
  primary_guarantee_void          TEXT,            -- 'date' or 'no_guarantee'
  primary_guarantee_void_date     DATE,
  secondary_unlink_date           DATE,
  secondary_guarantee_void        TEXT,
  secondary_guarantee_void_date   DATE,
  owner_proof_link                TEXT,
  created_at                      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Disable RLS for admin panel access
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_transactions DISABLE ROW LEVEL SECURITY;

-- =====================================================================
-- XSUIT TRANSACTIONS TABLE
-- Run this block to add XSuit Gift support
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.xsuit_transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref   TEXT REFERENCES public.transactions(transaction_id) ON DELETE CASCADE,
  xsuit_name        TEXT,
  gifter_ig_name    TEXT,
  gifter_ig_id      TEXT,
  buyer_ig_name     TEXT,
  buyer_ig_id       TEXT,
  delivery_date     DATE,
  delivery_time     TEXT,
  gift_status       TEXT DEFAULT 'Pending',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.xsuit_transactions DISABLE ROW LEVEL SECURITY;

-- =====================================================================
-- SUPERCAR TRANSACTIONS TABLE
-- Run this block to add Supercar Gift support
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.supercar_transactions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref     TEXT REFERENCES public.transactions(transaction_id) ON DELETE CASCADE,
  supercar_name       TEXT,
  supercar_card_tier  TEXT,
  gifter_ig_name      TEXT,
  gifter_ig_id        TEXT,
  buyer_ig_name       TEXT,
  buyer_ig_id         TEXT,
  delivery_date       DATE,
  delivery_time       TEXT,
  gift_status         TEXT DEFAULT 'Pending',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.supercar_transactions DISABLE ROW LEVEL SECURITY;
