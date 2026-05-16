-- SQL to setup Payment Settings and Update Payment Links
-- Run this in your Supabase SQL Editor

-- 1. Create table for global payment settings
CREATE TABLE IF NOT EXISTS public.admin_payment_settings (
  id                  INT PRIMARY KEY DEFAULT 1,
  payee_name          TEXT,
  payee_upi_id        TEXT,
  bank_name           TEXT,
  account_type        TEXT DEFAULT 'SAVINGS ACCOUNT',
  account_holder      TEXT,
  account_number      TEXT,
  ifsc_code           TEXT,
  branch              TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT one_row CHECK (id = 1)
);

-- Insert default row if not exists
INSERT INTO public.admin_payment_settings (id, payee_name, payee_upi_id)
VALUES (1, 'Maddy BGMI Store', 'maddy@upi')
ON CONFLICT (id) DO NOTHING;

-- 2. Update payment_links table to include more details
-- We use ALTER TABLE to add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_links' AND column_name='payee_name') THEN
    ALTER TABLE public.payment_links ADD COLUMN payee_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_links' AND column_name='payee_upi') THEN
    ALTER TABLE public.payment_links ADD COLUMN payee_upi TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_links' AND column_name='bank_details') THEN
    ALTER TABLE public.payment_links ADD COLUMN bank_details JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_links' AND column_name='transaction_id_label') THEN
    ALTER TABLE public.payment_links ADD COLUMN transaction_id_label TEXT;
  END IF;
END $$;

-- 3. Disable RLS for the new table
ALTER TABLE public.admin_payment_settings DISABLE ROW LEVEL SECURITY;
