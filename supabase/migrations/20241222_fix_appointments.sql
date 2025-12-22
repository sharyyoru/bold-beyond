-- Add sanity_provider_id column to appointments table for direct Sanity provider reference
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS sanity_provider_id VARCHAR(255);

-- Make provider_id nullable since we might not have a provider_accounts record
ALTER TABLE appointments ALTER COLUMN provider_id DROP NOT NULL;

-- Add index for sanity_provider_id lookups
CREATE INDEX IF NOT EXISTS idx_appointments_sanity_provider ON appointments(sanity_provider_id);

-- Same for provider_orders
ALTER TABLE provider_orders ADD COLUMN IF NOT EXISTS sanity_provider_id VARCHAR(255);
ALTER TABLE provider_orders ALTER COLUMN provider_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_sanity_provider ON provider_orders(sanity_provider_id);
