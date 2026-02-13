-- =============================================
-- DATABASE MIGRATION: Add Personal Equity Support
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- This adds the exclude_from_equity field to accounts

-- Step 1: Add exclude_from_equity column to accounts table
ALTER TABLE public.accounts
ADD COLUMN IF NOT EXISTS exclude_from_equity BOOLEAN DEFAULT FALSE;

-- Step 2: Update existing accounts to have default value
UPDATE public.accounts 
SET exclude_from_equity = FALSE 
WHERE exclude_from_equity IS NULL;

-- Step 3: Create index for faster equity calculations
CREATE INDEX IF NOT EXISTS idx_accounts_exclude_from_equity ON public.accounts (exclude_from_equity);

-- =============================================
-- Verification query (optional)
-- =============================================
-- SELECT id, name, balance, exclude_from_equity FROM public.accounts LIMIT 10;




