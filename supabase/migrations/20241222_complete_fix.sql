-- =====================================================
-- COMPLETE FIX - ALL MISSING COLUMNS AND POLICIES
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- ==================== PROVIDER_ORDERS TABLE ====================

-- First, check if columns exist before adding them
DO $$ 
BEGIN
  -- Add customer_name if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'customer_name') THEN
    ALTER TABLE provider_orders ADD COLUMN customer_name VARCHAR(255);
  END IF;

  -- Add customer_email if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'customer_email') THEN
    ALTER TABLE provider_orders ADD COLUMN customer_email VARCHAR(255);
  END IF;

  -- Add customer_phone if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'customer_phone') THEN
    ALTER TABLE provider_orders ADD COLUMN customer_phone VARCHAR(50);
  END IF;

  -- Add delivery_address if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'delivery_address') THEN
    ALTER TABLE provider_orders ADD COLUMN delivery_address TEXT;
  END IF;

  -- Add notes if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'notes') THEN
    ALTER TABLE provider_orders ADD COLUMN notes TEXT;
  END IF;

  -- Add items if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'items') THEN
    ALTER TABLE provider_orders ADD COLUMN items JSONB;
  END IF;

  -- Add total if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'total') THEN
    ALTER TABLE provider_orders ADD COLUMN total DECIMAL(10,2);
  END IF;

  -- Add total_amount if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'total_amount') THEN
    ALTER TABLE provider_orders ADD COLUMN total_amount DECIMAL(10,2);
  END IF;

  -- Add provider_name if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'provider_name') THEN
    ALTER TABLE provider_orders ADD COLUMN provider_name VARCHAR(255);
  END IF;

  -- Add sanity_provider_id if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'sanity_provider_id') THEN
    ALTER TABLE provider_orders ADD COLUMN sanity_provider_id VARCHAR(255);
  END IF;

  -- Add paid_at if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'paid_at') THEN
    ALTER TABLE provider_orders ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add stripe_session_id if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'stripe_session_id') THEN
    ALTER TABLE provider_orders ADD COLUMN stripe_session_id VARCHAR(255);
  END IF;

  -- Add payment_id if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'payment_id') THEN
    ALTER TABLE provider_orders ADD COLUMN payment_id VARCHAR(255);
  END IF;

  -- Add cancellation columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'cancelled_at') THEN
    ALTER TABLE provider_orders ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'cancelled_by') THEN
    ALTER TABLE provider_orders ADD COLUMN cancelled_by VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'cancellation_reason') THEN
    ALTER TABLE provider_orders ADD COLUMN cancellation_reason TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'refund_amount') THEN
    ALTER TABLE provider_orders ADD COLUMN refund_amount DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'refund_status') THEN
    ALTER TABLE provider_orders ADD COLUMN refund_status VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'wallet_amount_used') THEN
    ALTER TABLE provider_orders ADD COLUMN wallet_amount_used DECIMAL(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'provider_orders' AND column_name = 'card_amount_paid') THEN
    ALTER TABLE provider_orders ADD COLUMN card_amount_paid DECIMAL(10,2);
  END IF;
END $$;

-- ==================== APPOINTMENTS TABLE ====================

DO $$ 
BEGIN
  -- Add provider_name if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'provider_name') THEN
    ALTER TABLE appointments ADD COLUMN provider_name VARCHAR(255);
  END IF;

  -- Add sanity_provider_id if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'sanity_provider_id') THEN
    ALTER TABLE appointments ADD COLUMN sanity_provider_id VARCHAR(255);
  END IF;

  -- Add cancellation columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'cancelled_at') THEN
    ALTER TABLE appointments ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'cancelled_by') THEN
    ALTER TABLE appointments ADD COLUMN cancelled_by VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'cancellation_reason') THEN
    ALTER TABLE appointments ADD COLUMN cancellation_reason TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'refund_amount') THEN
    ALTER TABLE appointments ADD COLUMN refund_amount DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'refund_status') THEN
    ALTER TABLE appointments ADD COLUMN refund_status VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'wallet_amount_used') THEN
    ALTER TABLE appointments ADD COLUMN wallet_amount_used DECIMAL(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'card_amount_paid') THEN
    ALTER TABLE appointments ADD COLUMN card_amount_paid DECIMAL(10,2);
  END IF;
END $$;

-- ==================== WALLET TABLES ====================

-- User Wallet Balance Table
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'AED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet Transactions Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES user_wallets(id) ON DELETE CASCADE,
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

-- Reschedule Requests Table
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

-- Provider Notifications Table
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
CREATE INDEX IF NOT EXISTS idx_provider_orders_provider ON provider_orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_orders_sanity_provider ON provider_orders(sanity_provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_orders_status ON provider_orders(status);
CREATE INDEX IF NOT EXISTS idx_provider_orders_created ON provider_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_sanity_provider ON appointments(sanity_provider_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reschedule_requests_appointment ON reschedule_requests(appointment_id);
CREATE INDEX IF NOT EXISTS idx_provider_notifications_provider ON provider_notifications(provider_id);

-- ==================== ENABLE RLS ====================

ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_notifications ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES ====================

-- Drop and recreate RLS policies for provider_orders
DROP POLICY IF EXISTS "provider_orders_select_own_user" ON provider_orders;
DROP POLICY IF EXISTS "provider_orders_select_by_session" ON provider_orders;
DROP POLICY IF EXISTS "provider_orders_select_provider" ON provider_orders;
DROP POLICY IF EXISTS "provider_orders_update_provider" ON provider_orders;
DROP POLICY IF EXISTS "provider_orders_insert_all" ON provider_orders;
DROP POLICY IF EXISTS "Users can view own orders" ON provider_orders;
DROP POLICY IF EXISTS "Providers can view their orders" ON provider_orders;

-- Allow everyone to select orders (for admin/partner dashboards via API)
CREATE POLICY "provider_orders_select_all" ON provider_orders
  FOR SELECT USING (true);

-- Allow everyone to insert orders (for checkout)
CREATE POLICY "provider_orders_insert_all" ON provider_orders
  FOR INSERT WITH CHECK (true);

-- Allow updates for order status changes
CREATE POLICY "provider_orders_update_all" ON provider_orders
  FOR UPDATE USING (true);

-- User wallets policies
DROP POLICY IF EXISTS "Users can view own wallet" ON user_wallets;
DROP POLICY IF EXISTS "System can manage wallets" ON user_wallets;

CREATE POLICY "user_wallets_select" ON user_wallets FOR SELECT USING (true);
CREATE POLICY "user_wallets_insert" ON user_wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "user_wallets_update" ON user_wallets FOR UPDATE USING (true);

-- Wallet transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "System can manage transactions" ON wallet_transactions;

CREATE POLICY "wallet_transactions_select" ON wallet_transactions FOR SELECT USING (true);
CREATE POLICY "wallet_transactions_insert" ON wallet_transactions FOR INSERT WITH CHECK (true);

-- Reschedule requests policies
DROP POLICY IF EXISTS "Users can view own reschedule requests" ON reschedule_requests;
DROP POLICY IF EXISTS "Users can update own reschedule requests" ON reschedule_requests;
DROP POLICY IF EXISTS "Providers can manage reschedule requests" ON reschedule_requests;

CREATE POLICY "reschedule_requests_select" ON reschedule_requests FOR SELECT USING (true);
CREATE POLICY "reschedule_requests_insert" ON reschedule_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "reschedule_requests_update" ON reschedule_requests FOR UPDATE USING (true);

-- Provider notifications policies
DROP POLICY IF EXISTS "Providers can view own notifications" ON provider_notifications;
DROP POLICY IF EXISTS "Providers can update own notifications" ON provider_notifications;
DROP POLICY IF EXISTS "System can manage provider notifications" ON provider_notifications;

CREATE POLICY "provider_notifications_select" ON provider_notifications FOR SELECT USING (true);
CREATE POLICY "provider_notifications_insert" ON provider_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "provider_notifications_update" ON provider_notifications FOR UPDATE USING (true);

-- ==================== VERIFY ====================

SELECT 'Schema updated successfully!' as status;

-- Show provider_orders columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'provider_orders'
ORDER BY ordinal_position;
