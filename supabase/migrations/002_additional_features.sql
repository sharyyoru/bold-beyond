-- =============================================
-- DISCOUNTS & PROMO CODES
-- =============================================

CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  applicable_services UUID[] DEFAULT '{}',
  applicable_categories TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discount_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discount_id UUID REFERENCES discounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ACTIVITIES DISCOUNT CODES
-- =============================================

CREATE TABLE IF NOT EXISTS activity_discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  description_ar TEXT,
  reward_type VARCHAR(20) NOT NULL CHECK (reward_type IN ('discount', 'credits', 'free_session')),
  reward_value DECIMAL(10,2),
  required_actions INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PREMIUM SETTINGS
-- =============================================

CREATE TABLE IF NOT EXISTS premium_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default premium settings
INSERT INTO premium_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
  ('platform_fee_percentage', '{"value": 15}', 'payment', 'Platform fee percentage for therapist payouts', false),
  ('booking_advance_days', '{"value": 30}', 'booking', 'Maximum days in advance for booking', true),
  ('cancellation_window_hours', '{"value": 24}', 'booking', 'Hours before session for free cancellation', true),
  ('session_reminder_hours', '{"value": 2}', 'notification', 'Hours before session to send reminder', false),
  ('enable_online_sessions', '{"value": true}', 'feature', 'Enable online video sessions', true),
  ('enable_physical_sessions', '{"value": true}', 'feature', 'Enable in-person sessions', true),
  ('enable_chat', '{"value": true}', 'feature', 'Enable in-app chat', true),
  ('enable_products', '{"value": false}', 'feature', 'Enable product marketplace', true),
  ('default_currency', '{"value": "AED"}', 'general', 'Default currency', true),
  ('default_language', '{"value": "en"}', 'general', 'Default language', true),
  ('supported_languages', '{"value": ["en", "ar"]}', 'general', 'Supported languages', true)
ON CONFLICT (setting_key) DO NOTHING;

-- =============================================
-- CHATBOT CONVERSATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'escalated')),
  escalated_to UUID REFERENCES therapists(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'bot', 'agent')),
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'quick_reply', 'card', 'image')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USER LANGUAGE PREFERENCES
-- =============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en';

-- =============================================
-- ONBOARDING RESPONSES
-- =============================================

CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id VARCHAR(100) NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_onboarding_user_question 
  ON onboarding_responses(user_id, question_id);

-- =============================================
-- TEST RESPONSES
-- =============================================

CREATE TABLE IF NOT EXISTS test_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_name VARCHAR(100) NOT NULL,
  responses JSONB NOT NULL,
  total_score INTEGER,
  risk_flags TEXT[] DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_responses ENABLE ROW LEVEL SECURITY;

-- Discounts policies
CREATE POLICY "Anyone can view active discounts" ON discounts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage discounts" ON discounts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Discount usage policies
CREATE POLICY "Users can view own discount usage" ON discount_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can use discounts" ON discount_usage
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Premium settings policies
CREATE POLICY "Anyone can view public settings" ON premium_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON premium_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Chatbot policies
CREATE POLICY "Users can view own conversations" ON chatbot_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations" ON chatbot_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own messages" ON chatbot_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM chatbot_conversations WHERE id = conversation_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can send messages" ON chatbot_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM chatbot_conversations WHERE id = conversation_id AND user_id = auth.uid())
  );

-- Onboarding responses policies
CREATE POLICY "Users can manage own onboarding responses" ON onboarding_responses
  FOR ALL USING (user_id = auth.uid());

-- Test responses policies
CREATE POLICY "Users can manage own test responses" ON test_responses
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);
CREATE INDEX IF NOT EXISTS idx_discounts_active ON discounts(is_active, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_discount_usage_user ON discount_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user ON chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation ON chatbot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_test_responses_user ON test_responses(user_id);
