/**
 * Seed Provider Accounts
 * 
 * Run this script after running the SQL migrations.
 * This creates demo provider accounts that can log into the partner dashboard.
 * 
 * Usage: npx ts-node scripts/seed-providers.ts
 * 
 * Note: You need to manually create the auth users in Supabase first,
 * or run this after setting up the database with the SQL migration.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gtcypwxtubzzpeuzhevw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Demo provider accounts to create
const demoProviders = [
  {
    email: 'serenity@demo.com',
    password: 'demo123456',
    provider_name: 'Serenity Spa & Wellness',
    provider_slug: 'serenity-spa-wellness',
    sanity_provider_id: 'serenity-spa-demo',
  },
  {
    email: 'mindbody@demo.com',
    password: 'demo123456',
    provider_name: 'MindBody Fitness Studio',
    provider_slug: 'mindbody-fitness-studio',
    sanity_provider_id: 'mindbody-fitness-demo',
  },
  {
    email: 'zenmed@demo.com',
    password: 'demo123456',
    provider_name: 'Zen Meditation Center',
    provider_slug: 'zen-meditation-center',
    sanity_provider_id: 'zen-meditation-demo',
  },
];

async function seedProviders() {
  console.log('🌱 Seeding provider accounts...\n');

  if (!supabaseServiceKey) {
    console.log('⚠️  No SUPABASE_SERVICE_ROLE_KEY found.');
    console.log('');
    console.log('To create demo providers manually:');
    console.log('');
    console.log('1. Go to Supabase Dashboard > Authentication > Users');
    console.log('2. Create these users:');
    demoProviders.forEach(p => {
      console.log(`   - Email: ${p.email}, Password: ${p.password}`);
    });
    console.log('');
    console.log('3. Then run this SQL in the SQL Editor:');
    console.log('');
    console.log('-- Replace USER_ID with actual user IDs from step 2');
    demoProviders.forEach((p, i) => {
      console.log(`
INSERT INTO provider_accounts (user_id, sanity_provider_id, provider_name, provider_slug, email)
VALUES ('USER_ID_${i + 1}', '${p.sanity_provider_id}', '${p.provider_name}', '${p.provider_slug}', '${p.email}');`);
    });
    console.log('');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  for (const provider of demoProviders) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: provider.email,
        password: provider.password,
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`  ⚠️  User ${provider.email} already exists`);
          // Get existing user
          const { data: users } = await supabase.auth.admin.listUsers();
          const existingUser = users?.users.find(u => u.email === provider.email);
          if (existingUser) {
            // Check if provider account exists
            const { data: existing } = await supabase
              .from('provider_accounts')
              .select('id')
              .eq('user_id', existingUser.id)
              .single();

            if (!existing) {
              // Create provider account
              await supabase.from('provider_accounts').insert({
                user_id: existingUser.id,
                sanity_provider_id: provider.sanity_provider_id,
                provider_name: provider.provider_name,
                provider_slug: provider.provider_slug,
                email: provider.email,
              });
              console.log(`  ✓ Created provider account for ${provider.provider_name}`);
            }
          }
          continue;
        }
        throw authError;
      }

      if (authData.user) {
        // Create provider account
        const { error: providerError } = await supabase.from('provider_accounts').insert({
          user_id: authData.user.id,
          sanity_provider_id: provider.sanity_provider_id,
          provider_name: provider.provider_name,
          provider_slug: provider.provider_slug,
          email: provider.email,
        });

        if (providerError) throw providerError;

        console.log(`  ✓ ${provider.provider_name} (${provider.email})`);
      }
    } catch (error: any) {
      console.error(`  ❌ Error creating ${provider.email}:`, error.message);
    }
  }

  // Create sample appointments
  console.log('\n📅 Creating sample appointments...');
  
  const { data: providers } = await supabase
    .from('provider_accounts')
    .select('id, provider_name');

  if (providers && providers.length > 0) {
    const sampleAppointments = [
      {
        provider_id: providers[0].id,
        sanity_service_id: 'service-1',
        service_name: 'Swedish Relaxation Massage',
        service_price: 120,
        customer_name: 'Sarah Johnson',
        customer_email: 'sarah@example.com',
        customer_phone: '+971 50 123 4567',
        appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointment_time: '10:00',
        duration_minutes: 60,
        status: 'pending',
      },
      {
        provider_id: providers[0].id,
        sanity_service_id: 'service-2',
        service_name: 'Deep Tissue Massage',
        service_price: 140,
        customer_name: 'Michael Chen',
        customer_email: 'michael@example.com',
        customer_phone: '+971 50 234 5678',
        appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointment_time: '14:00',
        duration_minutes: 60,
        status: 'confirmed',
      },
      {
        provider_id: providers[0].id,
        sanity_service_id: 'service-3',
        service_name: 'Hot Stone Therapy',
        service_price: 160,
        customer_name: 'Emma Wilson',
        customer_email: 'emma@example.com',
        customer_phone: '+971 50 345 6789',
        appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointment_time: '11:00',
        duration_minutes: 75,
        status: 'pending',
      },
    ];

    for (const apt of sampleAppointments) {
      try {
        await supabase.from('appointments').insert(apt);
        console.log(`  ✓ Appointment: ${apt.customer_name} - ${apt.service_name}`);
      } catch (error: any) {
        console.log(`  ⚠️  ${error.message}`);
      }
    }
  }

  // Create sample orders
  console.log('\n🛍️ Creating sample orders...');
  
  if (providers && providers.length > 0) {
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    
    try {
      const { data: order } = await supabase.from('provider_orders').insert({
        order_number: orderNumber,
        provider_id: providers[0].id,
        customer_name: 'Alex Thompson',
        customer_email: 'alex@example.com',
        customer_phone: '+971 50 456 7890',
        customer_address: 'Marina Walk, Dubai',
        subtotal: 150,
        discount: 0,
        shipping: 15,
        total: 165,
        status: 'pending',
        payment_status: 'paid',
      }).select().single();

      if (order) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          sanity_product_id: 'product-1',
          product_name: 'Hydrating Face Serum',
          product_price: 85,
          quantity: 1,
          total: 85,
        });
        await supabase.from('order_items').insert({
          order_id: order.id,
          sanity_product_id: 'product-2',
          product_name: 'Vitamin C Brightening Cream',
          product_price: 65,
          quantity: 1,
          total: 65,
        });
        console.log(`  ✓ Order: #${orderNumber} - Alex Thompson`);
      }
    } catch (error: any) {
      console.log(`  ⚠️  ${error.message}`);
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log('\nDemo Login Credentials:');
  demoProviders.forEach(p => {
    console.log(`  ${p.provider_name}`);
    console.log(`    Email: ${p.email}`);
    console.log(`    Password: ${p.password}`);
  });
}

seedProviders();
