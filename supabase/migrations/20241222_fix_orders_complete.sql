-- =====================================================
-- FIX ORDERS TABLE - COMPLETE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add missing columns to provider_orders
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS items JSONB;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS total DECIMAL(10,2);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_provider_orders_user ON provider_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_orders_provider ON provider_orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_orders_sanity_provider ON provider_orders(sanity_provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_orders_status ON provider_orders(status);
CREATE INDEX IF NOT EXISTS idx_provider_orders_created ON provider_orders(created_at DESC);

-- Drop existing RLS policies on provider_orders
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'provider_orders'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON provider_orders', pol.policyname);
  END LOOP;
END $$;

-- Create new RLS policies for provider_orders
-- Users can view their own orders
CREATE POLICY "provider_orders_select_own_user"
  ON provider_orders FOR SELECT
  USING (user_id = auth.uid());

-- Allow viewing orders by stripe session (for success page)
CREATE POLICY "provider_orders_select_by_session"
  ON provider_orders FOR SELECT
  USING (stripe_session_id IS NOT NULL);

-- Providers can view orders for their services
CREATE POLICY "provider_orders_select_provider"
  ON provider_orders FOR SELECT
  USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
    OR sanity_provider_id IN (SELECT sanity_provider_id FROM provider_accounts WHERE user_id = auth.uid())
  );

-- Providers can update their orders
CREATE POLICY "provider_orders_update_provider"
  ON provider_orders FOR UPDATE
  USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
    OR sanity_provider_id IN (SELECT sanity_provider_id FROM provider_accounts WHERE user_id = auth.uid())
  );

-- Anyone can insert orders (for checkout)
CREATE POLICY "provider_orders_insert_all"
  ON provider_orders FOR INSERT
  WITH CHECK (true);

-- Check current orders in the database
SELECT id, order_number, user_id, provider_id, sanity_provider_id, provider_name, 
       customer_name, status, payment_status, total_amount, created_at
FROM provider_orders
ORDER BY created_at DESC
LIMIT 10;

-- Check provider_accounts to verify sanity_provider_id values
SELECT id, provider_name, email, sanity_provider_id
FROM provider_accounts;

SELECT 'Orders table updated successfully' as status;
