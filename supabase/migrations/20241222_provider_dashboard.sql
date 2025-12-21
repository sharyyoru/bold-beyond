-- Provider accounts table (links Supabase auth users to Sanity providers)
CREATE TABLE IF NOT EXISTS provider_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  sanity_provider_id VARCHAR(255) NOT NULL, -- Links to Sanity provider document
  provider_name VARCHAR(255) NOT NULL,
  provider_slug VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'owner', -- owner, manager, staff
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table (bookings from users)
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
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled, rescheduled
  notes TEXT,
  provider_notes TEXT,
  rescheduled_from UUID REFERENCES appointments(id),
  cancelled_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider orders table (product purchases)
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
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES provider_orders(id) ON DELETE CASCADE,
  sanity_product_id VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL
);

-- Provider availability/schedule
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES provider_accounts(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  UNIQUE(provider_id, day_of_week)
);

-- Provider blocked dates (holidays, vacations)
CREATE TABLE IF NOT EXISTS provider_blocked_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES provider_accounts(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  reason VARCHAR(255),
  UNIQUE(provider_id, blocked_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON provider_orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON provider_orders(status);
CREATE INDEX IF NOT EXISTS idx_provider_accounts_sanity ON provider_accounts(sanity_provider_id);

-- Enable RLS
ALTER TABLE provider_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_blocked_dates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for provider_accounts
CREATE POLICY "Providers can view their own account"
  ON provider_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can update their own account"
  ON provider_accounts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Providers can view their appointments"
  ON appointments FOR SELECT
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Providers can update their appointments"
  ON appointments FOR UPDATE
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- RLS Policies for provider_orders
CREATE POLICY "Providers can view their orders"
  ON provider_orders FOR SELECT
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Providers can update their orders"
  ON provider_orders FOR UPDATE
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own orders"
  ON provider_orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create orders"
  ON provider_orders FOR INSERT
  WITH CHECK (true);

-- RLS for order_items
CREATE POLICY "View order items through orders"
  ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM provider_orders WHERE provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid())));

CREATE POLICY "Insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- RLS for availability
CREATE POLICY "Providers can manage their availability"
  ON provider_availability FOR ALL
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view availability"
  ON provider_availability FOR SELECT
  USING (true);

-- RLS for blocked dates
CREATE POLICY "Providers can manage their blocked dates"
  ON provider_blocked_dates FOR ALL
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view blocked dates"
  ON provider_blocked_dates FOR SELECT
  USING (true);
