-- =====================================================================
-- BGMI Account Description Maker - Supabase Schema setup
-- Run this script in your Supabase SQL Editor to initialize the database
-- =====================================================================

-- Enable UUID extension if not already done
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BGMI LISTINGS TABLE (Finalized Listings)
CREATE TABLE IF NOT EXISTS public.bgmi_listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id      TEXT UNIQUE NOT NULL,                       -- e.g. BGMI-STOCK-1001
  title           TEXT NOT NULL,                              -- Account Title or Deal Header
  form_data       JSONB NOT NULL,                             -- Full form states
  plain_output    TEXT NOT NULL,                              -- Type 1: Plain Text
  styled_output   TEXT NOT NULL,                              -- Type 2: WhatsApp/Telegram bold-styled Text
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BGMI DRAFTS TABLE (Autosaved Work-in-Progress Forms)
CREATE TABLE IF NOT EXISTS public.bgmi_drafts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT DEFAULT 'Untitled Draft',
  form_data       JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BGMI TEMPLATES TABLE (Reusable Layout Presets)
CREATE TABLE IF NOT EXISTS public.bgmi_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT UNIQUE NOT NULL,                       -- e.g., 'Budget Account Template'
  description     TEXT,
  form_data       JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- =====================================================================

ALTER TABLE public.bgmi_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bgmi_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bgmi_templates ENABLE ROW LEVEL SECURITY;

-- Apply existing admin-token header authentication policy to the new tables
CREATE POLICY "Allow admin access on bgmi_listings" ON public.bgmi_listings
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

CREATE POLICY "Allow admin access on bgmi_drafts" ON public.bgmi_drafts
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

CREATE POLICY "Allow admin access on bgmi_templates" ON public.bgmi_templates
  FOR ALL USING ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz')
  WITH CHECK ((current_setting('request.headers', true)::json->>'x-maddy-admin-token') = 'mbs_admin_supabase_token_2026_xyz');

-- =====================================================================
-- PRE-POPULATE SAMPLE TEMPLATES
-- =====================================================================

INSERT INTO public.bgmi_templates (name, description, form_data)
VALUES 
(
  'Premium Mythic Fashion Template',
  'Pre-configured parameters optimized for high-tier accounts featuring mythics, X-suits, and premium supercars.',
  '{
    "basic": {
      "stockTag": "#NEWSTOCK",
      "postTag": "#NEWPOST",
      "dealTitle": "‼️🔻Premium Deal Of The Day 🔻‼️",
      "highlight": "Bgmi Premium Mythic Fashion Account",
      "price": "45,000",
      "whatsappLink": "https://wa.me/919999999999?text=Interested%20in%20Mythic%20Fashion%20BGMI",
      "loginDetails": "Single Login - Twitter Link (Safe & Guaranteed)",
      "level": "76",
      "proCollector": "55",
      "mythicFashion": "42",
      "ultimateFashion": "4",
      "conquerorDetails": "C1S3 Conqueror Frame & Title",
      "veteranTitle": "Veteran / Overachiever",
      "additionalHighlights": "100+ Premium Sets, Rare Lobby Backgrounds, Max Titles"
    },
    "xsuits": [
      {"name": "Ignis X-Suit", "level": "4", "genderType": "Male", "tags": "Kill Feed Enabled"}
    ],
    "gunLabs": [
      {"name": "M416 Glacier", "level": "7", "effectType": "Loot Crate Maxed", "notes": "On-hit and Kill Feed Maxed"},
      {"name": "M416 Sealed Nether", "level": "6", "effectType": "Kill Broadcast", "notes": "On Hit Enabled"}
    ],
    "outfits": [
      {"name": "Psychophage Mummy Set"},
      {"name": "Godzilla Costume"}
    ],
    "vehicles": [
      {"name": "Aston Martin Valkyrie", "type": "Sports", "upgradeLevel": "3"}
    ],
    "extra": {
      "killFeeds": "14",
      "gunLabsCount": "18",
      "pets": "Falcon Maxed, Buddy Kitty",
      "characters": "Carlo Maxed, Andy Maxed, Victor",
      "notes": "Fastest delivery guaranteed. Full security warranty included."
    }
  }'::jsonb
),
(
  'Budget Account Template',
  'Pre-configured parameters optimized for quick low-range budget listings.',
  '{
    "basic": {
      "stockTag": "#BUDGETSTOCK",
      "postTag": "#NEWPOST",
      "dealTitle": "‼️🔻Budget Deal Of The Day 🔻‼️",
      "highlight": "Bgmi Budget Gun Lab Account",
      "price": "4,500",
      "whatsappLink": "https://wa.me/919999999999?text=Interested%20in%20Budget%20BGMI%20Account",
      "loginDetails": "E-mail Link (Full Access Provided)",
      "level": "55",
      "proCollector": "0",
      "mythicFashion": "2",
      "ultimateFashion": "0",
      "conquerorDetails": "None",
      "veteranTitle": "None",
      "additionalHighlights": "Clean record, high K/D, few weapon skins"
    },
    "xsuits": [],
    "gunLabs": [
      {"name": "M416 Glacier", "level": "1", "effectType": "Basic Appearance", "notes": ""}
    ],
    "outfits": [],
    "vehicles": [],
    "extra": {
      "killFeeds": "1",
      "gunLabsCount": "1",
      "pets": "None",
      "characters": "Victor Maxed",
      "notes": "100% safe budget account, ideal for daily gameplay."
    }
  }'::jsonb
)
ON CONFLICT (name) 
DO UPDATE SET 
  description = EXCLUDED.description,
  form_data = EXCLUDED.form_data,
  updated_at = NOW();
