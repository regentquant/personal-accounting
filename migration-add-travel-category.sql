-- =============================================
-- DATABASE MIGRATION: Add Travel Category
-- =============================================
-- Subject: Add Travel expense category with Plane icon
--
-- Description: Adds a new default expense category for travel-related transactions
-- Icon: Plane (from Lucide React)
-- Color: #4A90E2 (blue)
-- Type: expense
--
-- Run this SQL in your Supabase SQL Editor
-- This migration is idempotent (safe to run multiple times)

INSERT INTO
    public.categories (
        id,
        name,
        icon,
        color,
        type,
        is_default
    )
VALUES (
        'travel',
        'Travel',
        'Plane',
        '#4A90E2',
        'expense',
        TRUE
    ) ON CONFLICT (id) DO NOTHING;

-- Verification query (optional - run to check results)
-- SELECT id, name, icon, color, type, is_default
-- FROM public.categories
-- WHERE id = 'travel';

