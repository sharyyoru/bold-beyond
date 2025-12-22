-- ============================================
-- COMPREHENSIVE RLS FIX
-- This fixes infinite recursion and access issues
-- ============================================

-- ============================================
-- PART 1: FIX PROFILES TABLE RLS
-- Drop ALL policies on profiles to eliminate recursion
-- ============================================

DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Create simple non-recursive policies for profiles
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- PART 2: FIX ADMIN_ACCOUNTS TABLE RLS
-- The recursive policy was checking admin_accounts from admin_accounts
-- ============================================

-- Drop all policies on admin_accounts
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
        RAISE NOTICE 'Dropped admin_accounts policy: %', pol.policyname;
    END LOOP;
END $$;

-- Simple policy: anyone authenticated can SELECT admin_accounts
-- This allows the login check to work
CREATE POLICY "admin_accounts_select_all"
  ON admin_accounts FOR SELECT
  USING (true);

-- Only allow INSERT/UPDATE/DELETE via service role (backend)
CREATE POLICY "admin_accounts_manage_service_role"
  ON admin_accounts FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- PART 3: ENSURE ADMIN USER EXISTS
-- ============================================

-- Make sure wilson@mutant.ae exists in admin_accounts
INSERT INTO admin_accounts (email, full_name, role, is_active, password_changed)
VALUES ('wilson@mutant.ae', 'Wilson', 'super_admin', true, true)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  password_changed = true,
  updated_at = NOW();

-- ============================================
-- PART 4: FIX APPOINTMENTS RLS FOR PARTNERS
-- Partners need to see appointments by sanity_provider_id too
-- ============================================

-- Drop existing appointment policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'appointments'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON appointments', pol.policyname);
        RAISE NOTICE 'Dropped appointments policy: %', pol.policyname;
    END LOOP;
END $$;

-- Anyone can insert appointments (for booking)
CREATE POLICY "appointments_insert_all"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Users can see their own appointments
CREATE POLICY "appointments_select_own"
  ON appointments FOR SELECT
  USING (user_id = auth.uid());

-- Providers can see appointments for their provider account (by provider_id OR sanity_provider_id)
CREATE POLICY "appointments_select_provider"
  ON appointments FOR SELECT
  USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
    OR
    sanity_provider_id IN (SELECT sanity_provider_id FROM provider_accounts WHERE user_id = auth.uid())
  );

-- Providers can update their appointments
CREATE POLICY "appointments_update_provider"
  ON appointments FOR UPDATE
  USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
    OR
    sanity_provider_id IN (SELECT sanity_provider_id FROM provider_accounts WHERE user_id = auth.uid())
  );

-- ============================================
-- PART 5: VERIFY - List all policies
-- ============================================

SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'admin_accounts', 'appointments')
ORDER BY tablename, policyname;
