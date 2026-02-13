-- =============================================
-- DATABASE MIGRATION: Add Productivity Category
-- =============================================
-- Subject: Add Productivity expense category with Laptop icon
--
-- Description: Adds a new default expense category for productivity-related transactions
-- Icon: Laptop (from Lucide React)
-- Color: #66BB6A (green)
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
        'productivity',
        'Productivity',
        'Laptop',
        '#66BB6A',
        'expense',
        TRUE
    ) ON CONFLICT (id) DO NOTHING;

-- Verification query (optional - run to check results)
-- SELECT id, name, icon, color, type, is_default
-- FROM public.categories
-- WHERE id = 'productivity';