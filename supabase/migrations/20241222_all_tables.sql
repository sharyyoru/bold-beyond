-- =====================================================
-- BOLD & BEYOND - Complete Database Setup
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- 1. FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('provider', 'service', 'product')),
  item_id VARCHAR(255) NOT NULL,
  item_slug VARCHAR(255),
  item_name VARCHAR(255),
  item_image_url TEXT,
  item_category VARCHAR(100),
  item_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item_type ON favorites(item_type);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add their own favorites" ON favorites;
CREATE POLICY "Users can add their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- 2. PROVIDER ACCOUNTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS provider_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  sanity_provider_id VARCHAR(255) NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  provider_slug VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'owner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_accounts_sanity ON provider_accounts(sanity_provider_id);

ALTER TABLE provider_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can view their own account" ON provider_accounts;
CREATE POLICY "Providers can view their own account" ON provider_accounts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Providers can update their own account" ON provider_accounts;
CREATE POLICY "Providers can update their own account" ON provider_accounts FOR UPDATE USING (auth.uid() = user_id);

-- 3. APPOINTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES provider_accounts(id) ON DELETE CASCADE,
  sanity_service_id VARCHAR(255) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_price DECIMAL(10,2),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  provider_notes TEXT,
  rescheduled_from UUID REFERENCES appointments(id),
  cancelled_reason TEXT,
  review_requested BOOLEAN DEFAULT false,
  review_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can view their appointments" ON appointments;
CREATE POLICY "Providers can view their appointments" ON appointments FOR SELECT 
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Providers can update their appointments" ON appointments;
CREATE POLICY "Providers can update their appointments" ON appointments FOR UPDATE 
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
CREATE POLICY "Users can view their own appointments" ON appointments FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (true);

-- 4. PROVIDER ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS provider_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES provider_accounts(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_provider ON provider_orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON provider_orders(status);

ALTER TABLE provider_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can view their orders" ON provider_orders;
CREATE POLICY "Providers can view their orders" ON provider_orders FOR SELECT 
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Providers can update their orders" ON provider_orders;
CREATE POLICY "Providers can update their orders" ON provider_orders FOR UPDATE 
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view their own orders" ON provider_orders;
CREATE POLICY "Users can view their own orders" ON provider_orders FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can create orders" ON provider_orders;
CREATE POLICY "Anyone can create orders" ON provider_orders FOR INSERT WITH CHECK (true);

-- 5. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES provider_orders(id) ON DELETE CASCADE,
  sanity_product_id VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View order items through orders" ON order_items;
CREATE POLICY "View order items through orders" ON order_items FOR SELECT 
  USING (order_id IN (SELECT id FROM provider_orders WHERE provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Insert order items" ON order_items;
CREATE POLICY "Insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- 6. SERVICE REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS service_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES provider_accounts(id) ON DELETE CASCADE,
  sanity_service_id VARCHAR(255) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_rating INTEGER NOT NULL CHECK (service_rating >= 1 AND service_rating <= 5),
  professional_rating INTEGER CHECK (professional_rating >= 1 AND professional_rating <= 5),
  review_text TEXT,
  reviewer_name VARCHAR(255),
  is_anonymous BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'published',
  provider_response TEXT,
  provider_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_provider ON service_reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON service_reviews(sanity_service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON service_reviews(user_id);

ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published reviews" ON service_reviews;
CREATE POLICY "Anyone can view published reviews" ON service_reviews FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Users can create reviews" ON service_reviews;
CREATE POLICY "Users can create reviews" ON service_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON service_reviews;
CREATE POLICY "Users can update their own reviews" ON service_reviews FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- DONE! All tables created successfully.
-- =====================================================
