-- Admin System Tables

-- Admin accounts table
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  is_active BOOLEAN DEFAULT true,
  temp_password TEXT, -- Temporary password that must be changed on first login
  password_changed BOOLEAN DEFAULT false,
  created_by UUID REFERENCES admin_accounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Insert initial super admin (wilson@mutant.ae)
-- This will be linked when they first log in
INSERT INTO admin_accounts (email, full_name, role, password_changed)
VALUES ('wilson@mutant.ae', 'Wilson', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Provider availability schedule
CREATE TABLE IF NOT EXISTS provider_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_accounts(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  is_open BOOLEAN DEFAULT true,
  open_time TIME,
  close_time TIME,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, day_of_week)
);

-- Provider service durations (how long each service takes)
CREATE TABLE IF NOT EXISTS service_durations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_accounts(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL, -- Sanity service ID
  service_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  buffer_minutes INTEGER DEFAULT 15, -- Buffer time between appointments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, service_id)
);

-- Booking slots (for tracking booked time slots)
CREATE TABLE IF NOT EXISTS booking_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_accounts(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'blocked', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, slot_date, start_time)
);

-- Reviews table (for admin review management)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  user_email TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('product', 'service', 'provider')),
  item_id TEXT NOT NULL, -- Sanity ID
  item_name TEXT NOT NULL,
  provider_id UUID REFERENCES provider_accounts(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  admin_response TEXT,
  responded_by UUID REFERENCES admin_accounts(id),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_accounts_email ON admin_accounts(email);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_user_id ON admin_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_schedules_provider ON provider_schedules(provider_id);
CREATE INDEX IF NOT EXISTS idx_booking_slots_provider_date ON booking_slots(provider_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Enable RLS
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_accounts
CREATE POLICY "Admins can view all admin accounts" ON admin_accounts
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage admin accounts" ON admin_accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_accounts aa 
      WHERE aa.user_id = auth.uid() AND aa.role = 'super_admin'
    )
  );

-- RLS Policies for provider_schedules
CREATE POLICY "Anyone can view schedules" ON provider_schedules
  FOR SELECT USING (true);

CREATE POLICY "Providers can manage own schedules" ON provider_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM provider_accounts pa 
      WHERE pa.id = provider_id AND pa.user_id = auth.uid()
    )
  );

-- RLS Policies for service_durations
CREATE POLICY "Anyone can view service durations" ON service_durations
  FOR SELECT USING (true);

CREATE POLICY "Providers can manage own durations" ON service_durations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM provider_accounts pa 
      WHERE pa.id = provider_id AND pa.user_id = auth.uid()
    )
  );

-- RLS Policies for booking_slots
CREATE POLICY "Anyone can view slots" ON booking_slots
  FOR SELECT USING (true);

CREATE POLICY "System can manage slots" ON booking_slots
  FOR ALL USING (true);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view published reviews" ON reviews
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_accounts aa 
      WHERE aa.user_id = auth.uid()
    )
  );
