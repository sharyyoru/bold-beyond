-- =====================================================
-- WALLET SYSTEM & CANCELLATION/RESCHEDULING
-- Run this in Supabase SQL Editor
-- =====================================================

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
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'appointment_refund',
    'order_refund',
    'appointment_payment',
    'order_payment',
    'manual_credit',
    'manual_debit',
    'promotional_credit'
  )),
  reference_id TEXT,
  reference_type TEXT CHECK (reference_type IN ('appointment', 'order', 'promotion', 'manual')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointment Reschedule Requests Table
CREATE TABLE IF NOT EXISTS reschedule_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES provider_accounts(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_date DATE NOT NULL,
  original_time TIME NOT NULL,
  proposed_date DATE NOT NULL,
  proposed_time TIME NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  user_response_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partner/Provider Notifications Table
CREATE TABLE IF NOT EXISTS provider_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'new_appointment',
    'appointment_cancelled',
    'reschedule_accepted',
    'reschedule_declined',
    'new_order',
    'order_cancelled',
    'review_received',
    'payment_received',
    'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id TEXT,
  reference_type TEXT CHECK (reference_type IN ('appointment', 'order', 'review', 'payment')),
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add cancellation fields to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancelled_by TEXT CHECK (cancelled_by IN ('user', 'provider', 'system'));
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS refund_status TEXT CHECK (refund_status IN ('pending', 'processed', 'failed'));

-- Add cancellation fields to provider_orders
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS cancelled_by TEXT CHECK (cancelled_by IN ('user', 'provider', 'system'));
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2);
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS refund_status TEXT CHECK (refund_status IN ('pending', 'processed', 'failed'));

-- Add wallet payment tracking to appointments and orders
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS wallet_amount_used DECIMAL(10,2) DEFAULT 0;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS card_amount_paid DECIMAL(10,2);
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS wallet_amount_used DECIMAL(10,2) DEFAULT 0;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS card_amount_paid DECIMAL(10,2);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_wallets_user ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_category ON wallet_transactions(category);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created ON wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reschedule_requests_appointment ON reschedule_requests(appointment_id);
CREATE INDEX IF NOT EXISTS idx_reschedule_requests_user ON reschedule_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_reschedule_requests_status ON reschedule_requests(status);
CREATE INDEX IF NOT EXISTS idx_provider_notifications_provider ON provider_notifications(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_notifications_read ON provider_notifications(is_read);

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_wallets
CREATE POLICY "Users can view own wallet" ON user_wallets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage wallets" ON user_wallets
  FOR ALL USING (true);

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view own transactions" ON wallet_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage transactions" ON wallet_transactions
  FOR ALL USING (true);

-- RLS Policies for reschedule_requests
CREATE POLICY "Users can view own reschedule requests" ON reschedule_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own reschedule requests" ON reschedule_requests
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Providers can manage reschedule requests" ON reschedule_requests
  FOR ALL USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
  );

-- RLS Policies for provider_notifications
CREATE POLICY "Providers can view own notifications" ON provider_notifications
  FOR SELECT USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "Providers can update own notifications" ON provider_notifications
  FOR UPDATE USING (
    provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "System can manage provider notifications" ON provider_notifications
  FOR ALL USING (true);

-- Function to get or create user wallet
CREATE OR REPLACE FUNCTION get_or_create_wallet(p_user_id UUID)
RETURNS user_wallets AS $$
DECLARE
  wallet user_wallets;
BEGIN
  SELECT * INTO wallet FROM user_wallets WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO user_wallets (user_id, balance)
    VALUES (p_user_id, 0)
    RETURNING * INTO wallet;
  END IF;
  
  RETURN wallet;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to credit wallet
CREATE OR REPLACE FUNCTION credit_wallet(
  p_user_id UUID,
  p_amount DECIMAL,
  p_category TEXT,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS wallet_transactions AS $$
DECLARE
  wallet user_wallets;
  new_balance DECIMAL;
  transaction wallet_transactions;
BEGIN
  -- Get or create wallet
  SELECT * INTO wallet FROM get_or_create_wallet(p_user_id);
  
  -- Calculate new balance
  new_balance := wallet.balance + p_amount;
  
  -- Update wallet balance
  UPDATE user_wallets SET balance = new_balance, updated_at = NOW()
  WHERE id = wallet.id;
  
  -- Create transaction record
  INSERT INTO wallet_transactions (
    user_id, wallet_id, type, amount, balance_after,
    category, description, reference_id, reference_type, metadata
  ) VALUES (
    p_user_id, wallet.id, 'credit', p_amount, new_balance,
    p_category, p_description, p_reference_id, p_reference_type, p_metadata
  ) RETURNING * INTO transaction;
  
  RETURN transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to debit wallet
CREATE OR REPLACE FUNCTION debit_wallet(
  p_user_id UUID,
  p_amount DECIMAL,
  p_category TEXT,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS wallet_transactions AS $$
DECLARE
  wallet user_wallets;
  new_balance DECIMAL;
  transaction wallet_transactions;
BEGIN
  -- Get wallet
  SELECT * INTO wallet FROM user_wallets WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;
  
  IF wallet.balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient wallet balance';
  END IF;
  
  -- Calculate new balance
  new_balance := wallet.balance - p_amount;
  
  -- Update wallet balance
  UPDATE user_wallets SET balance = new_balance, updated_at = NOW()
  WHERE id = wallet.id;
  
  -- Create transaction record
  INSERT INTO wallet_transactions (
    user_id, wallet_id, type, amount, balance_after,
    category, description, reference_id, reference_type, metadata
  ) VALUES (
    p_user_id, wallet.id, 'debit', p_amount, new_balance,
    p_category, p_description, p_reference_id, p_reference_type, p_metadata
  ) RETURNING * INTO transaction;
  
  RETURN transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify tables created
SELECT 'Wallet system tables created successfully' as status;
