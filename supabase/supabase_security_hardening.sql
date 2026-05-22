-- =====================================================================
-- MBS BGMI Store - Supabase Security Hardening Migration
-- Enables Row Level Security (RLS) and defines secure access policies
-- =====================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xsuit_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supercar_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public read" ON public.products;
DROP POLICY IF EXISTS "Admin write" ON public.products;

DROP POLICY IF EXISTS "Allow public read" ON public.uc_prices;
DROP POLICY IF EXISTS "Admin write" ON public.uc_prices;

DROP POLICY IF EXISTS "Allow public read" ON public.xsuit_gifts;
DROP POLICY IF EXISTS "Admin write" ON public.xsuit_gifts;

DROP POLICY IF EXISTS "Allow public read" ON public.supercar_gifts;
DROP POLICY IF EXISTS "Admin write" ON public.supercar_gifts;

DROP POLICY IF EXISTS "Allow public read" ON public.proofs;
DROP POLICY IF EXISTS "Admin write" ON public.proofs;

DROP POLICY IF EXISTS "Allow public read approved" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert pending" ON public.reviews;
DROP POLICY IF EXISTS "Admin write" ON public.reviews;

DROP POLICY IF EXISTS "Allow public insert unread" ON public.customer_feedback;
DROP POLICY IF EXISTS "Admin write" ON public.customer_feedback;

DROP POLICY IF EXISTS "Allow public read" ON public.admin_payment_settings;
DROP POLICY IF EXISTS "Admin write" ON public.admin_payment_settings;

DROP POLICY IF EXISTS "Allow public read" ON public.payment_links;
DROP POLICY IF EXISTS "Admin write" ON public.payment_links;

DROP POLICY IF EXISTS "Allow public read" ON public.site_views;
DROP POLICY IF EXISTS "Admin write" ON public.site_views;

-- Helper to check if request contains valid admin token header
-- Usage inside policies: coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'

-- 3. Define policies for Products (Catalog)
CREATE POLICY "Allow public read" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.products
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 4. Define policies for UC Prices (Catalog)
CREATE POLICY "Allow public read" ON public.uc_prices
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.uc_prices
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 5. Define policies for Xsuit Gifts (Catalog)
CREATE POLICY "Allow public read" ON public.xsuit_gifts
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.xsuit_gifts
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 6. Define policies for Supercar Gifts (Catalog)
CREATE POLICY "Allow public read" ON public.supercar_gifts
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.supercar_gifts
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 7. Define policies for Proofs (Deal Screenshots)
CREATE POLICY "Allow public read" ON public.proofs
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.proofs
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 8. Define policies for Reviews (With approval gating)
CREATE POLICY "Allow public read approved" ON public.reviews
  FOR SELECT USING (
    status = 'approved' OR
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

CREATE POLICY "Allow public insert pending" ON public.reviews
  FOR INSERT WITH CHECK (
    status = 'pending'
  );

CREATE POLICY "Admin write" ON public.reviews
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 9. Define policies for Customer Feedback
CREATE POLICY "Allow public insert unread" ON public.customer_feedback
  FOR INSERT WITH CHECK (
    status = 'unread'
  );

CREATE POLICY "Admin write" ON public.customer_feedback
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 10. Define policies for Admin Payment Settings
CREATE POLICY "Allow public read" ON public.admin_payment_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.admin_payment_settings
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 11. Define policies for Payment Links
CREATE POLICY "Allow public read" ON public.payment_links
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.payment_links
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );

-- 12. Define policies for Site Views
CREATE POLICY "Allow public read" ON public.site_views
  FOR SELECT USING (true);

CREATE POLICY "Admin write" ON public.site_views
  FOR ALL USING (
    coalesce(current_setting('request.headers', true)::json->>'x-maddy-admin-token', '') = 'mbs_admin_supabase_token_2026_xyz'
  );
