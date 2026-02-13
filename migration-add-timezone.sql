-- =============================================
-- DATABASE MIGRATION: Add Timezone Support
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- This adds timezone fields to transactions and profiles tables

-- =============================================
-- Step 1: Add timezone column to profiles table (User's Home Timezone)
-- =============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Shanghai';

-- Update existing profiles to have default timezone
UPDATE public.profiles 
SET timezone = 'Asia/Shanghai' 
WHERE timezone IS NULL;

-- =============================================
-- Step 2: Add timezone fields to transactions table
-- =============================================
-- timezone_id: The timezone where the transaction was created (e.g., 'Asia/Shanghai')
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS timezone_id VARCHAR(50) DEFAULT 'Asia/Shanghai';

-- local_date: The "wall-clock" date as the user saw it when creating the transaction
-- This preserves historical integrity - we show what date it was locally
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS local_date DATE;

-- local_time: Optional - the local time of day if we want finer granularity
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS local_time TIME;

-- =============================================
-- Step 3: Migrate existing data
-- =============================================
-- For existing transactions, copy 'date' to 'local_date' (they were entered as local dates)
UPDATE public.transactions 
SET local_date = date,
    timezone_id = 'Asia/Shanghai'
WHERE local_date IS NULL;

-- =============================================
-- Step 4: Update the trigger function to include timezone in default accounts
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile with default timezone
    INSERT INTO public.profiles (id, display_name, language, currency, timezone)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'language')::VARCHAR, 'en'),
        COALESCE((NEW.raw_user_meta_data->>'currency')::VARCHAR, 'CNY'),
        COALESCE((NEW.raw_user_meta_data->>'timezone')::VARCHAR, 'Asia/Shanghai')
    );
    
    -- Create default accounts
    INSERT INTO public.accounts (user_id, name, icon, color, balance) VALUES
    (NEW.id, 'WeChat', 'MessageCircle', '#07C160', 0),
    (NEW.id, 'Alipay', 'Wallet', '#1677FF', 0),
    (NEW.id, 'PayPal', 'CreditCard', '#003087', 0),
    (NEW.id, 'Venmo', 'Smartphone', '#3D95CE', 0),
    (NEW.id, 'Apple Pay', 'Smartphone', '#000000', 0),
    (NEW.id, 'Google Pay', 'Smartphone', '#4285F4', 0),
    (NEW.id, 'Bank Card', 'CreditCard', '#E6A756', 0),
    (NEW.id, 'Cash', 'Banknote', '#8BA888', 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Step 5: Create index for timezone queries
-- =============================================
CREATE INDEX IF NOT EXISTS idx_transactions_local_date ON public.transactions (local_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_timezone ON public.transactions (timezone_id);

-- =============================================
-- Verification queries (optional - run to check results)
-- =============================================
-- Check profiles have timezone:
-- SELECT id, display_name, timezone FROM public.profiles LIMIT 5;

-- Check transactions have timezone fields:
-- SELECT id, date, local_date, timezone_id, local_time FROM public.transactions LIMIT 5;




