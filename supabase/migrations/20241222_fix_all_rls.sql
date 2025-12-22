-- =====================================================
-- COMPREHENSIVE RLS FIX FOR ALL TABLES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop all existing policies on provider_orders dynamically
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

-- Drop all existing policies on order_items dynamically
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'order_items'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON order_items', pol.policyname);
  END LOOP;
END $$;

-- Drop all existing policies on admin_accounts dynamically
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'admin_accounts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON admin_accounts', pol.policyname);
  END LOOP;
END $$;

-- =====================================================
-- PROVIDER_ORDERS - Simple non-recursive policies
-- =====================================================

-- Allow anyone to insert orders (for checkout)
CREATE POLICY "provider_orders_insert_all"
  ON provider_orders FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own orders
CREATE POLICY "provider_orders_select_own"
  ON provider_orders FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to view orders by stripe_session_id (for success page before auth)
CREATE POLICY "provider_orders_select_by_session"
  ON provider_orders FOR SELECT
  USING (stripe_session_id IS NOT NULL);

-- Allow providers to view orders for their services
CREATE POLICY "provider_orders_select_provider"
  ON provider_orders FOR SELECT
  USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
    OR
    sanity_provider_id IN (SELECT sanity_provider_id FROM provider_accounts WHERE user_id = auth.uid())
  );

-- Allow providers to update their orders
CREATE POLICY "provider_orders_update_provider"
  ON provider_orders FOR UPDATE
  USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
    OR
    sanity_provider_id IN (SELECT sanity_provider_id FROM provider_accounts WHERE user_id = auth.uid())
  );

-- =====================================================
-- ORDER_ITEMS - Simple policies
-- =====================================================

CREATE POLICY "order_items_insert_all"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_items_select_all"
  ON order_items FOR SELECT
  USING (true);

-- =====================================================
-- ADMIN_ACCOUNTS - Allow authenticated users to read
-- =====================================================

-- All authenticated users can read admin_accounts (needed for login check)
CREATE POLICY "admin_accounts_select_authenticated"
  ON admin_accounts FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "admin_accounts_insert_admin"
  ON admin_accounts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_accounts 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

CREATE POLICY "admin_accounts_update_self"
  ON admin_accounts FOR UPDATE
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "admin_accounts_delete_super"
  ON admin_accounts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_accounts 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

-- =====================================================
-- Ensure admin user exists and is properly configured
-- =====================================================

INSERT INTO admin_accounts (email, full_name, role, is_active, password_changed)
VALUES ('wilson@mutant.ae', 'Wilson', 'super_admin', true, true)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  password_changed = true;

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 'RLS Policies Fixed Successfully' as status;
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('provider_orders', 'order_items', 'admin_accounts', 'appointments', 'profiles')
ORDER BY tablename, policyname;
