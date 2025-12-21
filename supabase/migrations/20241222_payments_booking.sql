-- Add payment fields to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'expired', 'failed'));
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service_id TEXT;

-- Add payment fields to provider_orders table
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'));
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status ON appointments(payment_status);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_provider_orders_payment_status ON provider_orders(payment_status);

-- Update status check constraint to include pending_payment
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check 
  CHECK (status IN ('pending_payment', 'pending', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'));
