-- Fix infinite recursion in profiles RLS policy
-- The issue occurs when a policy references another table that has a policy referencing back

-- First, drop any existing problematic policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

-- Create simple, non-recursive policies
-- Use auth.uid() directly without subqueries to other tables

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

-- Also add a policy for service role to bypass RLS
CREATE POLICY "service_role_all"
  ON profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant admin access to wilson@mutant.ae
-- The admin login uses admin_accounts table, so insert there
INSERT INTO admin_accounts (email, full_name, role, is_active, password_changed)
VALUES ('wilson@mutant.ae', 'Wilson', 'super_admin', true, true)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  password_changed = true,
  updated_at = NOW();
