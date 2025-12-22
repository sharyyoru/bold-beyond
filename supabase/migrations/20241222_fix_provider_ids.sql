-- =====================================================
-- FIX PROVIDER IDS - Match Supabase with actual Sanity _id values
-- Run this in Supabase SQL Editor
-- =====================================================

-- Update Serenity Spa & Wellness
UPDATE provider_accounts 
SET sanity_provider_id = 'GOFL2kyVV19G5S1YoOleDL'
WHERE provider_name ILIKE '%serenity%' 
   OR sanity_provider_id = 'serenity-spa-demo'
   OR email ILIKE '%serenity%';

-- Verify the update
SELECT id, provider_name, email, sanity_provider_id 
FROM provider_accounts;

-- =====================================================
-- REFERENCE: All Sanity Provider IDs
-- =====================================================
-- NutriLife Wellness: Frt9xx5VA6r6IgDeloJpCx
-- Peak Performance Coaching: Frt9xx5VA6r6IgDeloJqzR
-- Oasis Relaxation Spa: Frt9xx5VA6r6IgDeloJuyv
-- Nourish Kitchen: Frt9xx5VA6r6IgDeloJxlH
-- Serenity Spa & Wellness: GOFL2kyVV19G5S1YoOleDL
-- MindBody Fitness Studio: GOFL2kyVV19G5S1YoOletP
-- Harmony Yoga Studio: GOFL2kyVV19G5S1YoOlgaZ
-- Glow Beauty Clinic: GOFL2kyVV19G5S1YoOlhGd
-- Pure Radiance Skincare: GOFL2kyVV19G5S1YoOlrRb
-- LifeBalance Coaching: GOFL2kyVV19G5S1YoOluPd
-- Sunrise Fitness Club: GOFL2kyVV19G5S1YoOlyU1
-- Eternal Youth Aesthetics: GOFL2kyVV19G5S1YoOlzfd
-- Zen Meditation Center: KHnr3gvBiZnksMpgfzFaKf
-- Tranquil Touch Massage: KHnr3gvBiZnksMpgfzFbtB
-- Inner Peace Therapy: KHnr3gvBiZnksMpgfzFclT
-- Vitality Health Hub: KHnr3gvBiZnksMpgfzFdFd
-- Sacred Space Yoga: KHnr3gvBiZnksMpgfzFe1t
-- Mindful Movement Studio: KHnr3gvBiZnksMpgfzFgDc
-- Healing Hands Therapy: KHnr3gvBiZnksMpgfzFibP
-- Calm Waters Float Spa: KHnr3gvBiZnksMpgfzFlTM
