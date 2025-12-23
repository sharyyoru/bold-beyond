-- Service Reviews table
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
  is_verified BOOLEAN DEFAULT true, -- Verified if linked to appointment
  status VARCHAR(50) DEFAULT 'published', -- published, pending, hidden
  provider_response TEXT,
  provider_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON service_reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON service_reviews(sanity_service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON service_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_appointment ON service_reviews(appointment_id);

-- Enable RLS
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published reviews"
  ON service_reviews FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can create reviews"
  ON service_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON service_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view all their reviews"
  ON service_reviews FOR SELECT
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Providers can respond to reviews"
  ON service_reviews FOR UPDATE
  USING (provider_id IN (SELECT id FROM provider_accounts WHERE user_id = auth.uid()));

-- Add review_requested flag to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS review_requested BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS review_submitted BOOLEAN DEFAULT false;
