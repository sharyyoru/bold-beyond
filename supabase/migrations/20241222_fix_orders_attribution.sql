-- =====================================================
-- FIX ORDERS ATTRIBUTION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add provider_name column to provider_orders if it doesn't exist
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);

-- Update column if needed
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS sanity_provider_id VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_user ON provider_orders(user_id);

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'provider_orders'
ORDER BY ordinal_position;
