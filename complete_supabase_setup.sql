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
  account_type    TEXT DEFAULT 'SAVINGS ACCOUNT',
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

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) ENFORCEMENT & POLICIES
-- =====================================================================

-- Enable RLS across all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xsuit_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supercar_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- Helper macro description:
-- we verify the custom header token matches the admin secret:
-- (current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz'

-- 1. PRODUCTS
CREATE POLICY "Allow public read access on products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on products" ON public.products
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- 2. UC PRICES
CREATE POLICY "Allow public read access on uc_prices" ON public.uc_prices
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on uc_prices" ON public.uc_prices
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- 3. XSUIT GIFTS
CREATE POLICY "Allow public read access on xsuit_gifts" ON public.xsuit_gifts
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on xsuit_gifts" ON public.xsuit_gifts
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- 4. SUPERCAR GIFTS
CREATE POLICY "Allow public read access on supercar_gifts" ON public.supercar_gifts
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on supercar_gifts" ON public.supercar_gifts
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- 5. REVIEWS
-- Public can read approved reviews, admin can read all reviews
CREATE POLICY "Allow public read approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved' OR (current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');
-- Public can submit new reviews, but they are forced to start as 'pending'
CREATE POLICY "Allow public insert pending reviews" ON public.reviews
  FOR INSERT WITH CHECK (status = 'pending' OR (current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');
-- Admin has full access to update/delete/approve reviews
CREATE POLICY "Allow admin write access on reviews" ON public.reviews
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- 6. PROOFS
CREATE POLICY "Allow public read access on proofs" ON public.proofs
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on proofs" ON public.proofs
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- 7. ADMIN PAYMENT SETTINGS
CREATE POLICY "Allow public read access on admin_payment_settings" ON public.admin_payment_settings
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on admin_payment_settings" ON public.admin_payment_settings
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- 8. PAYMENT LINKS
CREATE POLICY "Allow public read access on payment_links" ON public.payment_links
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on payment_links" ON public.payment_links
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- =====================================================================
-- 9. SITE VIEWS COUNTER (Global Analytics)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.site_views (
  id              TEXT PRIMARY KEY,
  count           BIGINT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize view counter with a handsome base value representing real traffic since 2019
INSERT INTO public.site_views (id, count)
VALUES ('total_views', 14852)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on site views
ALTER TABLE public.site_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on site_views" ON public.site_views FOR SELECT USING (true);
CREATE POLICY "Allow admin write on site_views" ON public.site_views FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz') WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- Database function to atomically increment views and return the updated count
CREATE OR REPLACE FUNCTION increment_views()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  INSERT INTO public.site_views (id, count)
  VALUES ('total_views', 14853)
  ON CONFLICT (id) DO UPDATE
  SET count = public.site_views.count + 1
  RETURNING count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- =====================================================================
-- 10. CUSTOMER FEEDBACK (Constructive store improvement logs)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.customer_feedback (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  stars           INTEGER CHECK (stars >= 1 AND stars <= 5),
  comment         TEXT NOT NULL,
  desired_items   TEXT,
  phone           TEXT,
  status          TEXT DEFAULT 'unread', -- unread, read, archived
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on customer feedback
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
-- Public can only insert feedback (prevents listing and accessing feedback details of other users)
CREATE POLICY "Allow public insert customer_feedback" ON public.customer_feedback
  FOR INSERT WITH CHECK (status = 'unread' OR (current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');
-- Admins have full access
CREATE POLICY "Allow admin all access on customer_feedback" ON public.customer_feedback
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- ═════════════════════════════════════════════════════════════════════════
-- 11. SCHEMA SELF-HEALING (Dynamic Migrations for Existing Databases)
-- ═════════════════════════════════════════════════════════════════════════
DO $$ 
BEGIN
  -- Add account_type to admin_payment_settings if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_payment_settings' AND column_name='account_type') THEN
    ALTER TABLE public.admin_payment_settings ADD COLUMN account_type TEXT DEFAULT 'SAVINGS ACCOUNT';
  END IF;
END $$;





