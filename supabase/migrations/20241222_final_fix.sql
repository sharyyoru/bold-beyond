-- =====================================================
-- FINAL FIX - Correct SQL syntax (no IF NOT EXISTS for policies)
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- ==================== PROVIDER_ORDERS TABLE ====================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'customer_name') THEN
    ALTER TABLE provider_orders ADD COLUMN customer_name VARCHAR(255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'customer_email') THEN
    ALTER TABLE provider_orders ADD COLUMN customer_email VARCHAR(255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'customer_phone') THEN
    ALTER TABLE provider_orders ADD COLUMN customer_phone VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'delivery_address') THEN
    ALTER TABLE provider_orders ADD COLUMN delivery_address TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'notes') THEN
    ALTER TABLE provider_orders ADD COLUMN notes TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'items') THEN
    ALTER TABLE provider_orders ADD COLUMN items JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'total') THEN
    ALTER TABLE provider_orders ADD COLUMN total DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'total_amount') THEN
    ALTER TABLE provider_orders ADD COLUMN total_amount DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'provider_name') THEN
    ALTER TABLE provider_orders ADD COLUMN provider_name VARCHAR(255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'sanity_provider_id') THEN
    ALTER TABLE provider_orders ADD COLUMN sanity_provider_id VARCHAR(255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'paid_at') THEN
    ALTER TABLE provider_orders ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'stripe_session_id') THEN
    ALTER TABLE provider_orders ADD COLUMN stripe_session_id VARCHAR(255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'payment_id') THEN
    ALTER TABLE provider_orders ADD COLUMN payment_id VARCHAR(255);
  END IF;
END $$;

-- ==================== WALLET TABLES ====================

CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'AED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  wallet_id UUID,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  reference_id TEXT,
  reference_type TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reschedule_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL,
  provider_id UUID,
  user_id UUID NOT NULL,
  original_date DATE NOT NULL,
  original_time TIME NOT NULL,
  proposed_date DATE NOT NULL,
  proposed_time TIME NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  user_response_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id TEXT,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== INDEXES ====================

CREATE INDEX IF NOT EXISTS idx_provider_orders_user ON provider_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_orders_sanity_provider ON provider_orders(sanity_provider_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON wallet_transactions(user_id);

-- ==================== RLS ====================

ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_notifications ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES (DROP THEN CREATE) ====================

-- User wallets
DROP POLICY IF EXISTS "allow_all_select" ON user_wallets;
DROP POLICY IF EXISTS "allow_all_insert" ON user_wallets;
DROP POLICY IF EXISTS "allow_all_update" ON user_wallets;
DROP POLICY IF EXISTS "user_wallets_select" ON user_wallets;
DROP POLICY IF EXISTS "user_wallets_insert" ON user_wallets;
DROP POLICY IF EXISTS "user_wallets_update" ON user_wallets;

CREATE POLICY "user_wallets_all_select" ON user_wallets FOR SELECT USING (true);
CREATE POLICY "user_wallets_all_insert" ON user_wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "user_wallets_all_update" ON user_wallets FOR UPDATE USING (true);

-- Wallet transactions
DROP POLICY IF EXISTS "allow_all_select" ON wallet_transactions;
DROP POLICY IF EXISTS "allow_all_insert" ON wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_select" ON wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_insert" ON wallet_transactions;

CREATE POLICY "wallet_tx_all_select" ON wallet_transactions FOR SELECT USING (true);
CREATE POLICY "wallet_tx_all_insert" ON wallet_transactions FOR INSERT WITH CHECK (true);

-- Reschedule requests
DROP POLICY IF EXISTS "allow_all_select" ON reschedule_requests;
DROP POLICY IF EXISTS "allow_all_insert" ON reschedule_requests;
DROP POLICY IF EXISTS "allow_all_update" ON reschedule_requests;
DROP POLICY IF EXISTS "reschedule_requests_select" ON reschedule_requests;
DROP POLICY IF EXISTS "reschedule_requests_insert" ON reschedule_requests;
DROP POLICY IF EXISTS "reschedule_requests_update" ON reschedule_requests;

CREATE POLICY "reschedule_all_select" ON reschedule_requests FOR SELECT USING (true);
CREATE POLICY "reschedule_all_insert" ON reschedule_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "reschedule_all_update" ON reschedule_requests FOR UPDATE USING (true);

-- Provider notifications
DROP POLICY IF EXISTS "allow_all_select" ON provider_notifications;
DROP POLICY IF EXISTS "allow_all_insert" ON provider_notifications;
DROP POLICY IF EXISTS "allow_all_update" ON provider_notifications;
DROP POLICY IF EXISTS "provider_notifications_select" ON provider_notifications;
DROP POLICY IF EXISTS "provider_notifications_insert" ON provider_notifications;
DROP POLICY IF EXISTS "provider_notifications_update" ON provider_notifications;

CREATE POLICY "provider_notif_all_select" ON provider_notifications FOR SELECT USING (true);
CREATE POLICY "provider_notif_all_insert" ON provider_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "provider_notif_all_update" ON provider_notifications FOR UPDATE USING (true);

-- ==================== VERIFY ====================

SELECT 'Schema updated successfully!' as status;

-- Check provider_accounts to see what sanity_provider_id values exist
SELECT id, provider_name, email, sanity_provider_id FROM provider_accounts;
