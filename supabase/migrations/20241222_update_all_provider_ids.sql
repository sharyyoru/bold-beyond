-- =====================================================
-- UPDATE ALL PROVIDER IDs - Match Supabase with Sanity _id values
-- Run this in Supabase SQL Editor
-- =====================================================

-- Update based on provider names (case-insensitive match)
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOleDL' WHERE provider_name ILIKE '%serenity spa%' OR provider_name ILIKE '%serenity%wellness%';
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOletP' WHERE provider_name ILIKE '%mindbody%' OR provider_name ILIKE '%mind body%';
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOlgaZ' WHERE provider_name ILIKE '%harmony yoga%';
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOlhGd' WHERE provider_name ILIKE '%glow beauty%';
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOlrRb' WHERE provider_name ILIKE '%pure radiance%';
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOluPd' WHERE provider_name ILIKE '%lifebalance%' OR provider_name ILIKE '%life balance%';
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOlyU1' WHERE provider_name ILIKE '%sunrise fitness%';
UPDATE provider_accounts SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOlzfd' WHERE provider_name ILIKE '%eternal youth%';
UPDATE provider_accounts SET sanity_provider_id = 'Frt9xx5VA6r6IgDeloJpCx' WHERE provider_name ILIKE '%nutrilife%';
UPDATE provider_accounts SET sanity_provider_id = 'Frt9xx5VA6r6IgDeloJqzR' WHERE provider_name ILIKE '%peak performance%';
UPDATE provider_accounts SET sanity_provider_id = 'Frt9xx5VA6r6IgDeloJuyv' WHERE provider_name ILIKE '%oasis%';
UPDATE provider_accounts SET sanity_provider_id = 'Frt9xx5VA6r6IgDeloJxlH' WHERE provider_name ILIKE '%nourish kitchen%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFaKf' WHERE provider_name ILIKE '%zen meditation%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFbtB' WHERE provider_name ILIKE '%tranquil touch%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFclT' WHERE provider_name ILIKE '%inner peace%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFdFd' WHERE provider_name ILIKE '%vitality health%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFe1t' WHERE provider_name ILIKE '%sacred space%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFgDc' WHERE provider_name ILIKE '%mindful movement%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFibP' WHERE provider_name ILIKE '%healing hands%';
UPDATE provider_accounts SET sanity_provider_id = 'KHnr3gvBiZnksMpgfzFlTM' WHERE provider_name ILIKE '%calm waters%';

-- Verify the updates
SELECT id, provider_name, email, sanity_provider_id FROM provider_accounts ORDER BY provider_name;
