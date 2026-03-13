-- Create partner_applications table
CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  service_category TEXT NOT NULL,
  description TEXT NOT NULL,
  experience TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_partner_applications_status ON partner_applications(status);
CREATE INDEX IF NOT EXISTS idx_partner_applications_created_at ON partner_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_applications_email ON partner_applications(email);

-- Enable RLS
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (adjust based on your auth setup)
CREATE POLICY "Allow all operations for authenticated users" ON partner_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);
