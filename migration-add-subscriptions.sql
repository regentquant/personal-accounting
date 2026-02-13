-- =============================================
-- MIGRATION: Add Subscriptions Table
-- Run this in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. CREATE SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    cost DECIMAL(15, 2) NOT NULL CHECK (cost > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    next_payment_date DATE NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Tv',
    color VARCHAR(20) NOT NULL DEFAULT '#E50914',
    note TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CREATE INDEXES
-- =============================================
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_next_payment_date ON public.subscriptions(next_payment_date);
CREATE INDEX idx_subscriptions_is_active ON public.subscriptions(is_active);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE RLS POLICIES
-- =============================================
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
    ON public.subscriptions FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- 5. CREATE TRIGGER FOR UPDATED_AT
-- =============================================
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
