-- Run this script in your Supabase SQL Editor to create the Transaction Management tables.

-- 1. MAIN TABLE
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  transaction_type TEXT NOT NULL,
  mode_of_deal TEXT,
  transaction_date DATE NOT NULL,
  owner_price NUMERIC,
  sold_price NUMERIC,
  profit NUMERIC,
  buyer_phone TEXT,
  payment_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ACCOUNT TABLE
CREATE TABLE public.account_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref TEXT REFERENCES public.transactions(transaction_id) ON DELETE CASCADE,
  product_link TEXT,
  primary_login_provider TEXT,
  secondary_login_provider TEXT,
  mothermail_status TEXT,
  login_type TEXT,
  guarantee_plan TEXT,
  guarantee_scope TEXT,
  unlink_eligible_date DATE,
  guarantee_void_date DATE,
  guarantee_notes TEXT,
  credentials TEXT,
  owner_phone TEXT,
  reseller_phone TEXT
);

-- 3. XSUIT TABLE
CREATE TABLE public.xsuit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref TEXT REFERENCES public.transactions(transaction_id) ON DELETE CASCADE,
  owner_ig_id TEXT,
  owner_ig_name TEXT,
  buyer_ig_id TEXT,
  buyer_ig_name TEXT,
  delivery_date DATE
);

-- 4. SUPERCAR TABLE
CREATE TABLE public.supercar_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref TEXT REFERENCES public.transactions(transaction_id) ON DELETE CASCADE,
  owner_ig_id TEXT,
  owner_ig_name TEXT,
  buyer_ig_id TEXT,
  buyer_ig_name TEXT,
  delivery_date DATE
);

-- 5. UC TABLE
CREATE TABLE public.uc_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref TEXT REFERENCES public.transactions(transaction_id) ON DELETE CASCADE,
  uc_quantity INTEGER,
  bgmi_id TEXT,
  delivery_date DATE
);

-- IMPORTANT: Enable read/write access (disable RLS or add policies)
-- If you are using anonymous keys for your admin panel and don't want to deal with complex policies:
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.xsuit_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.supercar_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_transactions DISABLE ROW LEVEL SECURITY;
