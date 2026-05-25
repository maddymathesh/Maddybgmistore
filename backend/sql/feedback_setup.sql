-- MBSx BGMI Store - Create Customer Feedback Table
-- Copy and paste this script directly into your Supabase SQL Editor and run it.

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

-- Disable Row Level Security (RLS) so any public visitor can submit their constructive feedback
ALTER TABLE public.customer_feedback DISABLE ROW LEVEL SECURITY;
