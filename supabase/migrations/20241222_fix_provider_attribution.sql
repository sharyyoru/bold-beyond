-- =====================================================
-- FIX PROVIDER ATTRIBUTION IN APPOINTMENTS
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add provider_name column to appointments if it doesn't exist
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);

-- Check if provider_accounts has sanity_provider_id set for Serenity Spa
-- First, let's see what providers exist
SELECT id, provider_name, email, sanity_provider_id FROM provider_accounts;

-- Get the Sanity provider IDs from a sample appointment (if any exist)
SELECT DISTINCT sanity_provider_id, service_name FROM appointments WHERE sanity_provider_id IS NOT NULL;

-- Update the existing appointment to link to Serenity Spa & Wellness
-- First, find the Serenity Spa provider account
UPDATE appointments a
SET provider_name = pa.provider_name,
    provider_id = pa.id
FROM provider_accounts pa
WHERE pa.provider_name ILIKE '%Serenity%'
AND a.provider_name IS NULL;

-- If Serenity Spa doesn't have a sanity_provider_id set, we need to set it
-- You'll need to replace 'YOUR_SANITY_PROVIDER_ID' with the actual ID from Sanity
-- UPDATE provider_accounts 
-- SET sanity_provider_id = 'YOUR_SANITY_PROVIDER_ID'
-- WHERE provider_name ILIKE '%Serenity%';

-- Show current state
SELECT 
  a.id,
  a.customer_name,
  a.service_name,
  a.sanity_provider_id as appt_sanity_id,
  a.provider_name as appt_provider_name,
  a.provider_id,
  pa.provider_name as linked_provider
FROM appointments a
LEFT JOIN provider_accounts pa ON a.provider_id = pa.id
ORDER BY a.created_at DESC;
