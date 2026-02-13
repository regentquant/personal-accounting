-- =============================================
-- FIKA APP - SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. ACCOUNTS TABLE
-- =============================================
CREATE TABLE public.accounts (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Wallet',
    color VARCHAR(20) NOT NULL DEFAULT '#C4A484',
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX idx_accounts_user_id ON public.accounts (user_id);

-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================
CREATE TABLE public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    is_default BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. TRANSACTIONS TABLE
-- =============================================
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.accounts (id) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_transactions_user_id ON public.transactions (user_id);

CREATE INDEX idx_transactions_account_id ON public.transactions (account_id);

CREATE INDEX idx_transactions_date ON public.transactions (date DESC);

CREATE INDEX idx_transactions_type ON public.transactions(type);

-- =============================================
-- 4. USER PROFILES TABLE (optional extra info)
-- =============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    currency VARCHAR(10) DEFAULT 'CNY',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. SUBSCRIPTIONS TABLE
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
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

CREATE INDEX idx_subscriptions_next_payment_date ON public.subscriptions(next_payment_date);

CREATE INDEX idx_subscriptions_is_active ON public.subscriptions(is_active);

-- =============================================
-- 6. INSERT DEFAULT CATEGORIES
-- =============================================
INSERT INTO
    public.categories (
        id,
        name,
        icon,
        color,
        type,
        is_default
    )
VALUES
    -- Expense categories
    (
        'food',
        'Food & Dining',
        'UtensilsCrossed',
        '#E6A756',
        'expense',
        TRUE
    ),
    (
        'transport',
        'Transport',
        'Car',
        '#7BA3C4',
        'expense',
        TRUE
    ),
    (
        'shopping',
        'Shopping',
        'ShoppingBag',
        '#A85D5D',
        'expense',
        TRUE
    ),
    (
        'entertainment',
        'Entertainment',
        'Gamepad2',
        '#9B7ED9',
        'expense',
        TRUE
    ),
    (
        'utilities',
        'Utilities',
        'Zap',
        '#5CB8A8',
        'expense',
        TRUE
    ),
    (
        'health',
        'Health',
        'Heart',
        '#E88B8B',
        'expense',
        TRUE
    ),
    (
        'education',
        'Education',
        'GraduationCap',
        '#6B9BD1',
        'expense',
        TRUE
    ),
    (
        'productivity',
        'Productivity',
        'Laptop',
        '#66BB6A',
        'expense',
        TRUE
    ),
    (
        'travel',
        'Travel',
        'Plane',
        '#4A90E2',
        'expense',
        TRUE
    ),
    (
        'other-expense',
        'Other',
        'MoreHorizontal',
        '#C4A484',
        'expense',
        TRUE
    ),
    -- Income categories
    (
        'salary',
        'Salary',
        'Briefcase',
        '#8BA888',
        'income',
        TRUE
    ),
    (
        'freelance',
        'Freelance',
        'Laptop',
        '#7BA3C4',
        'income',
        TRUE
    ),
    (
        'investment',
        'Investment',
        'TrendingUp',
        '#E6A756',
        'income',
        TRUE
    ),
    (
        'gift',
        'Gift',
        'Gift',
        '#D4A5A5',
        'income',
        TRUE
    ),
    (
        'other-income',
        'Other',
        'MoreHorizontal',
        '#C4A484',
        'income',
        TRUE
    );

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY "Users can view own accounts" ON public.accounts FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own accounts" ON public.accounts FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own accounts" ON public.accounts FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own accounts" ON public.accounts FOR DELETE USING (auth.uid () = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid () = user_id);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "Users can insert own profile" ON public.profiles FOR
INSERT
WITH
    CHECK (auth.uid () = id);

CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid () = id);

-- Categories policies (everyone can read defaults, users can manage their own)
CREATE POLICY "Anyone can view default categories" ON public.categories FOR
SELECT USING (
        is_default = TRUE
        OR auth.uid () = user_id
    );

CREATE POLICY "Users can insert own categories" ON public.categories FOR
INSERT
WITH
    CHECK (
        auth.uid () = user_id
        AND is_default = FALSE
    );

CREATE POLICY "Users can update own categories" ON public.categories FOR
UPDATE USING (
    auth.uid () = user_id
    AND is_default = FALSE
);

CREATE POLICY "Users can delete own categories" ON public.categories FOR DELETE USING (
    auth.uid () = user_id
    AND is_default = FALSE
);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions FOR DELETE USING (auth.uid () = user_id);

-- =============================================
-- 8. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default accounts for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, display_name, language, currency)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'en', 'CNY');
    
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
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to run after user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update account balance after transaction
CREATE OR REPLACE FUNCTION public.update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'income' THEN
            UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'income' THEN
            UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Revert old transaction
        IF OLD.type = 'income' THEN
            UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        END IF;
        -- Apply new transaction
        IF NEW.type = 'income' THEN
            UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for automatic balance updates
CREATE TRIGGER on_transaction_change
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_account_balance();