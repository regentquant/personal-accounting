-- =============================================
-- DATABASE MIGRATION: Add Language Support
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- This adds the 'language' column to the profiles table

-- Step 1: Add language column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';

-- Step 2: Update existing profiles to have default language
UPDATE public.profiles 
SET language = 'en' 
WHERE language IS NULL;

-- Step 3: Update the trigger function to set default language
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile with default language and currency
    INSERT INTO public.profiles (id, display_name, language, currency)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'language')::VARCHAR, 'en'),
        COALESCE((NEW.raw_user_meta_data->>'currency')::VARCHAR, 'CNY')
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

-- Verification query (optional - run to check results)
-- SELECT id, display_name, language, currency, created_at 
-- FROM public.profiles 
-- ORDER BY created_at DESC 
-- LIMIT 10;

