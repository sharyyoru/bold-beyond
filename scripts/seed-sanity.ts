import { createClient } from '@sanity/client';

// Use the token from .env.local - this token needs "Editor" or "Admin" permissions in Sanity
// Go to sanity.io/manage > Project > API > Tokens > Create new token with "Editor" role
const SANITY_WRITE_TOKEN = process.env.SANITY_API_TOKEN || 'sk0uDGUuctT0ugqGi05GezYtnj052CwCjZi39jRoWnyZssFeR2kA4G9wZcRaIWcEvXDH8AgeKRMO8u41hlMlAEMzcOPVl4ZI8VNbmaKQq1zrxG81akzJPPNW4PSJWkEEVkb37TrOAi7CxPaAXTTNBCmMwyk7TtM5dIgvCbVYfd0hKMbTRNNN';

const client = createClient({
  projectId: 'hgmgl6bw',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Helper to create slug
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Provider categories
const providerCategories = ['spa', 'fitness', 'therapy', 'wellness', 'beauty', 'nutrition', 'yoga', 'meditation'];

// Service categories
const serviceCategories = ['therapy', 'coaching', 'wellness', 'beauty', 'fitness', 'spa', 'nutrition', 'meditation', 'yoga', 'massage'];

// Product categories
const productCategories = ['skincare', 'supplements', 'aromatherapy', 'fitness-gear', 'wellness-tools', 'books', 'nutrition', 'beauty'];

// 20 Providers with diverse offerings
const providers = [
  { name: 'Serenity Spa & Wellness', category: 'spa', description: 'Luxury spa experiences for complete relaxation', rating: 4.9, hasProducts: true, hasServices: true },
  { name: 'MindBody Fitness Studio', category: 'fitness', description: 'Holistic fitness and wellness training', rating: 4.8, hasProducts: true, hasServices: true },
  { name: 'Zen Meditation Center', category: 'meditation', description: 'Ancient meditation practices for modern minds', rating: 4.7, hasProducts: true, hasServices: true },
  { name: 'Harmony Yoga Studio', category: 'yoga', description: 'Traditional and contemporary yoga classes', rating: 4.9, hasProducts: false, hasServices: true },
  { name: 'Glow Beauty Clinic', category: 'beauty', description: 'Premium skincare and beauty treatments', rating: 4.6, hasProducts: true, hasServices: true },
  { name: 'NutriLife Wellness', category: 'nutrition', description: 'Personalized nutrition and diet planning', rating: 4.8, hasProducts: true, hasServices: true },
  { name: 'Tranquil Touch Massage', category: 'spa', description: 'Therapeutic massage and bodywork', rating: 4.9, hasProducts: true, hasServices: true },
  { name: 'Peak Performance Coaching', category: 'coaching', description: 'Elite performance and life coaching', rating: 4.7, hasProducts: false, hasServices: true },
  { name: 'Inner Peace Therapy', category: 'therapy', description: 'Mental health and emotional wellness', rating: 4.8, hasProducts: false, hasServices: true },
  { name: 'Vitality Health Hub', category: 'wellness', description: 'Comprehensive health and wellness services', rating: 4.6, hasProducts: true, hasServices: true },
  { name: 'Sacred Space Yoga', category: 'yoga', description: 'Spiritual yoga and breathwork', rating: 4.8, hasProducts: true, hasServices: true },
  { name: 'Pure Radiance Skincare', category: 'beauty', description: 'Organic and natural skincare treatments', rating: 4.7, hasProducts: true, hasServices: true },
  { name: 'Mindful Movement Studio', category: 'fitness', description: 'Pilates, barre, and mindful fitness', rating: 4.9, hasProducts: false, hasServices: true },
  { name: 'Oasis Relaxation Spa', category: 'spa', description: 'Desert-inspired relaxation experiences', rating: 4.5, hasProducts: true, hasServices: true },
  { name: 'LifeBalance Coaching', category: 'coaching', description: 'Work-life balance and stress management', rating: 4.8, hasProducts: true, hasServices: true },
  { name: 'Healing Hands Therapy', category: 'therapy', description: 'Physical and emotional healing therapies', rating: 4.9, hasProducts: false, hasServices: true },
  { name: 'Nourish Kitchen', category: 'nutrition', description: 'Healthy meal planning and cooking classes', rating: 4.7, hasProducts: true, hasServices: true },
  { name: 'Calm Waters Float Spa', category: 'spa', description: 'Flotation therapy and sensory experiences', rating: 4.6, hasProducts: true, hasServices: true },
  { name: 'Sunrise Fitness Club', category: 'fitness', description: 'Early morning fitness and bootcamps', rating: 4.8, hasProducts: true, hasServices: true },
  { name: 'Eternal Youth Aesthetics', category: 'beauty', description: 'Advanced anti-aging treatments', rating: 4.7, hasProducts: true, hasServices: true },
];

// 60 Services with variety
const services = [
  // Therapy services (10)
  { title: 'Cognitive Behavioral Therapy Session', category: 'therapy', price: 150, duration: 60, description: 'One-on-one CBT session to address thought patterns', rating: 4.9 },
  { title: 'Couples Counseling', category: 'therapy', price: 200, duration: 90, description: 'Relationship therapy for couples seeking better communication', rating: 4.8 },
  { title: 'Anxiety Management Therapy', category: 'therapy', price: 140, duration: 60, description: 'Specialized therapy for anxiety disorders', rating: 4.7 },
  { title: 'Grief Counseling Session', category: 'therapy', price: 130, duration: 60, description: 'Compassionate support through loss and grief', rating: 4.9 },
  { title: 'EMDR Trauma Therapy', category: 'therapy', price: 180, duration: 75, description: 'Eye movement desensitization for trauma healing', rating: 4.8 },
  { title: 'Family Therapy Session', category: 'therapy', price: 220, duration: 90, description: 'Healing family dynamics and relationships', rating: 4.6 },
  { title: 'Stress Management Consultation', category: 'therapy', price: 120, duration: 45, description: 'Learn effective stress coping strategies', rating: 4.7 },
  { title: 'Depression Support Therapy', category: 'therapy', price: 150, duration: 60, description: 'Professional support for depression recovery', rating: 4.8 },
  { title: 'Mindfulness-Based Therapy', category: 'therapy', price: 135, duration: 60, description: 'Combining mindfulness with therapeutic techniques', rating: 4.9 },
  { title: 'Art Therapy Session', category: 'therapy', price: 110, duration: 60, description: 'Express and heal through creative art', rating: 4.7 },
  
  // Coaching services (8)
  { title: 'Executive Life Coaching', category: 'coaching', price: 250, duration: 60, description: 'Premium coaching for executives and leaders', rating: 4.9 },
  { title: 'Career Transition Coaching', category: 'coaching', price: 180, duration: 60, description: 'Navigate career changes with confidence', rating: 4.8 },
  { title: 'Health & Wellness Coaching', category: 'coaching', price: 120, duration: 45, description: 'Achieve your health goals with expert guidance', rating: 4.7 },
  { title: 'Relationship Coaching', category: 'coaching', price: 160, duration: 60, description: 'Build stronger personal relationships', rating: 4.6 },
  { title: 'Confidence Building Workshop', category: 'coaching', price: 90, duration: 90, description: 'Group workshop to boost self-confidence', rating: 4.8 },
  { title: 'Goal Setting Masterclass', category: 'coaching', price: 75, duration: 120, description: 'Learn to set and achieve meaningful goals', rating: 4.7 },
  { title: 'Productivity Coaching', category: 'coaching', price: 140, duration: 60, description: 'Optimize your time and energy', rating: 4.8 },
  { title: 'Public Speaking Coaching', category: 'coaching', price: 200, duration: 90, description: 'Master the art of public speaking', rating: 4.9 },
  
  // Spa services (10)
  { title: 'Swedish Relaxation Massage', category: 'spa', price: 120, duration: 60, description: 'Classic massage for total relaxation', rating: 4.9 },
  { title: 'Deep Tissue Massage', category: 'spa', price: 140, duration: 60, description: 'Intense massage for muscle tension relief', rating: 4.8 },
  { title: 'Hot Stone Therapy', category: 'spa', price: 160, duration: 75, description: 'Heated stones for deep relaxation', rating: 4.9 },
  { title: 'Aromatherapy Massage', category: 'spa', price: 130, duration: 60, description: 'Essential oils combined with massage', rating: 4.7 },
  { title: 'Thai Yoga Massage', category: 'spa', price: 150, duration: 90, description: 'Ancient Thai stretching and massage', rating: 4.8 },
  { title: 'Couples Spa Package', category: 'spa', price: 350, duration: 120, description: 'Romantic spa experience for two', rating: 4.9 },
  { title: 'Detox Body Wrap', category: 'spa', price: 110, duration: 60, description: 'Cleansing wrap for skin rejuvenation', rating: 4.6 },
  { title: 'Flotation Therapy', category: 'spa', price: 95, duration: 60, description: 'Sensory deprivation for deep relaxation', rating: 4.8 },
  { title: 'Hydrotherapy Session', category: 'spa', price: 85, duration: 45, description: 'Water-based healing therapy', rating: 4.7 },
  { title: 'Full Day Spa Retreat', category: 'spa', price: 450, duration: 360, description: 'Complete day of pampering and relaxation', rating: 4.9 },
  
  // Yoga services (8)
  { title: 'Vinyasa Flow Class', category: 'yoga', price: 25, duration: 60, description: 'Dynamic flowing yoga practice', rating: 4.8 },
  { title: 'Restorative Yoga Session', category: 'yoga', price: 30, duration: 75, description: 'Gentle poses for deep relaxation', rating: 4.9 },
  { title: 'Hot Yoga Class', category: 'yoga', price: 35, duration: 60, description: 'Yoga in heated environment for detox', rating: 4.7 },
  { title: 'Yin Yoga Deep Stretch', category: 'yoga', price: 28, duration: 75, description: 'Long-held poses for flexibility', rating: 4.8 },
  { title: 'Prenatal Yoga', category: 'yoga', price: 32, duration: 60, description: 'Safe yoga practice for expecting mothers', rating: 4.9 },
  { title: 'Private Yoga Session', category: 'yoga', price: 120, duration: 60, description: 'One-on-one customized yoga practice', rating: 4.9 },
  { title: 'Yoga Nidra Sleep Session', category: 'yoga', price: 25, duration: 45, description: 'Guided yogic sleep for deep rest', rating: 4.8 },
  { title: 'Kundalini Awakening Class', category: 'yoga', price: 35, duration: 90, description: 'Spiritual yoga with breathwork', rating: 4.7 },
  
  // Meditation services (6)
  { title: 'Guided Meditation Session', category: 'meditation', price: 40, duration: 45, description: 'Expert-led meditation practice', rating: 4.9 },
  { title: 'Sound Bath Healing', category: 'meditation', price: 55, duration: 60, description: 'Immersive sound healing experience', rating: 4.8 },
  { title: 'Breathwork Workshop', category: 'meditation', price: 60, duration: 90, description: 'Transformative breathing techniques', rating: 4.9 },
  { title: 'Mindfulness Retreat (Half Day)', category: 'meditation', price: 150, duration: 240, description: 'Intensive mindfulness immersion', rating: 4.8 },
  { title: 'Chakra Balancing Meditation', category: 'meditation', price: 65, duration: 60, description: 'Energy center alignment practice', rating: 4.7 },
  { title: 'Walking Meditation Class', category: 'meditation', price: 30, duration: 45, description: 'Mindful movement in nature', rating: 4.6 },
  
  // Fitness services (8)
  { title: 'Personal Training Session', category: 'fitness', price: 80, duration: 60, description: 'Custom workout with certified trainer', rating: 4.9 },
  { title: 'HIIT Bootcamp Class', category: 'fitness', price: 25, duration: 45, description: 'High intensity interval training', rating: 4.8 },
  { title: 'Strength Training Program', category: 'fitness', price: 200, duration: 60, description: '4-week progressive strength program', rating: 4.7 },
  { title: 'Pilates Mat Class', category: 'fitness', price: 30, duration: 55, description: 'Core-focused pilates workout', rating: 4.8 },
  { title: 'Barre Fitness Class', category: 'fitness', price: 28, duration: 55, description: 'Ballet-inspired toning workout', rating: 4.9 },
  { title: 'Functional Fitness Assessment', category: 'fitness', price: 100, duration: 90, description: 'Comprehensive fitness evaluation', rating: 4.7 },
  { title: 'Group Spin Class', category: 'fitness', price: 22, duration: 45, description: 'High-energy indoor cycling', rating: 4.8 },
  { title: 'Boxing Fitness Session', category: 'fitness', price: 35, duration: 60, description: 'Boxing-inspired cardio workout', rating: 4.8 },
  
  // Beauty services (6)
  { title: 'Signature Facial Treatment', category: 'beauty', price: 120, duration: 60, description: 'Customized facial for your skin type', rating: 4.8 },
  { title: 'Anti-Aging Facial', category: 'beauty', price: 180, duration: 75, description: 'Advanced treatment for youthful skin', rating: 4.9 },
  { title: 'Acne Treatment Facial', category: 'beauty', price: 140, duration: 60, description: 'Deep cleansing for problem skin', rating: 4.7 },
  { title: 'Microdermabrasion', category: 'beauty', price: 150, duration: 45, description: 'Skin resurfacing treatment', rating: 4.8 },
  { title: 'LED Light Therapy', category: 'beauty', price: 90, duration: 30, description: 'Light-based skin rejuvenation', rating: 4.6 },
  { title: 'Hydrating Skin Treatment', category: 'beauty', price: 130, duration: 60, description: 'Deep hydration for dry skin', rating: 4.8 },
  
  // Nutrition services (4)
  { title: 'Nutrition Consultation', category: 'nutrition', price: 100, duration: 60, description: 'Personalized diet analysis and plan', rating: 4.9 },
  { title: 'Meal Planning Session', category: 'nutrition', price: 80, duration: 45, description: 'Weekly meal plan creation', rating: 4.8 },
  { title: 'Detox Program Consultation', category: 'nutrition', price: 120, duration: 60, description: 'Guided cleanse and detox planning', rating: 4.7 },
  { title: 'Healthy Cooking Class', category: 'nutrition', price: 75, duration: 120, description: 'Learn to cook nutritious meals', rating: 4.9 },
];

// 45 Products with variety
const products = [
  // Skincare (10)
  { name: 'Hydrating Face Serum', category: 'skincare', price: 65, salePrice: 55, description: 'Intensive hydration with hyaluronic acid', stock: 50 },
  { name: 'Vitamin C Brightening Cream', category: 'skincare', price: 48, salePrice: null, description: 'Brighten and even skin tone', stock: 75 },
  { name: 'Retinol Night Cream', category: 'skincare', price: 72, salePrice: 60, description: 'Anti-aging overnight treatment', stock: 40 },
  { name: 'Gentle Foaming Cleanser', category: 'skincare', price: 28, salePrice: null, description: 'Daily gentle face wash', stock: 100 },
  { name: 'Exfoliating Face Scrub', category: 'skincare', price: 35, salePrice: 28, description: 'Weekly deep exfoliation', stock: 60 },
  { name: 'Nourishing Face Oil', category: 'skincare', price: 55, salePrice: null, description: 'Organic blend of facial oils', stock: 45 },
  { name: 'Eye Repair Cream', category: 'skincare', price: 58, salePrice: 48, description: 'Reduce dark circles and puffiness', stock: 55 },
  { name: 'SPF 50 Daily Sunscreen', category: 'skincare', price: 32, salePrice: null, description: 'Lightweight daily sun protection', stock: 80 },
  { name: 'Clay Purifying Mask', category: 'skincare', price: 38, salePrice: 32, description: 'Deep pore cleansing mask', stock: 65 },
  { name: 'Overnight Recovery Mask', category: 'skincare', price: 45, salePrice: null, description: 'Wake up with refreshed skin', stock: 50 },
  
  // Supplements (10)
  { name: 'Daily Multivitamin Complex', category: 'supplements', price: 35, salePrice: null, description: 'Complete daily nutrition support', stock: 200 },
  { name: 'Omega-3 Fish Oil Capsules', category: 'supplements', price: 28, salePrice: 22, description: 'Heart and brain health support', stock: 150 },
  { name: 'Vitamin D3 + K2 Drops', category: 'supplements', price: 25, salePrice: null, description: 'Immune and bone support', stock: 120 },
  { name: 'Magnesium Sleep Complex', category: 'supplements', price: 32, salePrice: 26, description: 'Natural sleep and relaxation support', stock: 100 },
  { name: 'Probiotic Gut Health', category: 'supplements', price: 42, salePrice: null, description: '50 billion CFU digestive support', stock: 90 },
  { name: 'Collagen Peptides Powder', category: 'supplements', price: 48, salePrice: 40, description: 'Skin, hair, and joint support', stock: 75 },
  { name: 'Ashwagandha Stress Relief', category: 'supplements', price: 30, salePrice: null, description: 'Adaptogenic stress support', stock: 110 },
  { name: 'B-Complex Energy Boost', category: 'supplements', price: 22, salePrice: 18, description: 'Natural energy and focus', stock: 130 },
  { name: 'Turmeric Curcumin Capsules', category: 'supplements', price: 35, salePrice: null, description: 'Anti-inflammatory support', stock: 95 },
  { name: 'Iron + Vitamin C', category: 'supplements', price: 20, salePrice: 16, description: 'Enhanced iron absorption', stock: 85 },
  
  // Aromatherapy (8)
  { name: 'Lavender Essential Oil', category: 'aromatherapy', price: 18, salePrice: null, description: 'Pure lavender for relaxation', stock: 200 },
  { name: 'Eucalyptus Essential Oil', category: 'aromatherapy', price: 16, salePrice: 12, description: 'Refreshing and clearing', stock: 180 },
  { name: 'Aromatherapy Diffuser', category: 'aromatherapy', price: 45, salePrice: 38, description: 'Ultrasonic essential oil diffuser', stock: 60 },
  { name: 'Sleep Blend Oil Set', category: 'aromatherapy', price: 38, salePrice: null, description: '3 oils for better sleep', stock: 70 },
  { name: 'Stress Relief Candle', category: 'aromatherapy', price: 28, salePrice: 22, description: 'Calming scented soy candle', stock: 100 },
  { name: 'Peppermint Roll-On', category: 'aromatherapy', price: 15, salePrice: null, description: 'Portable headache relief', stock: 120 },
  { name: 'Room Spray Trio', category: 'aromatherapy', price: 32, salePrice: 26, description: 'Refresh, calm, and energize', stock: 80 },
  { name: 'Bath Bomb Collection', category: 'aromatherapy', price: 25, salePrice: null, description: '6 aromatherapy bath bombs', stock: 90 },
  
  // Fitness Gear (7)
  { name: 'Premium Yoga Mat', category: 'fitness-gear', price: 68, salePrice: 55, description: 'Extra thick non-slip mat', stock: 80 },
  { name: 'Resistance Bands Set', category: 'fitness-gear', price: 35, salePrice: null, description: '5 levels of resistance', stock: 120 },
  { name: 'Foam Roller Recovery', category: 'fitness-gear', price: 42, salePrice: 35, description: 'Deep tissue muscle relief', stock: 70 },
  { name: 'Meditation Cushion', category: 'fitness-gear', price: 55, salePrice: null, description: 'Ergonomic sitting cushion', stock: 50 },
  { name: 'Yoga Block Set (2)', category: 'fitness-gear', price: 28, salePrice: 22, description: 'Cork yoga support blocks', stock: 100 },
  { name: 'Massage Ball Set', category: 'fitness-gear', price: 25, salePrice: null, description: 'Trigger point release balls', stock: 90 },
  { name: 'Yoga Strap', category: 'fitness-gear', price: 18, salePrice: 14, description: 'Stretching and pose assistance', stock: 150 },
  
  // Wellness Tools (5)
  { name: 'Acupressure Mat & Pillow', category: 'wellness-tools', price: 48, salePrice: 40, description: 'Stimulate pressure points', stock: 60 },
  { name: 'Jade Face Roller', category: 'wellness-tools', price: 35, salePrice: null, description: 'Reduce puffiness and tension', stock: 80 },
  { name: 'Gua Sha Stone Set', category: 'wellness-tools', price: 28, salePrice: 22, description: 'Traditional facial massage', stock: 90 },
  { name: 'Digital Sleep Tracker', category: 'wellness-tools', price: 89, salePrice: 75, description: 'Monitor sleep quality', stock: 40 },
  { name: 'Light Therapy Lamp', category: 'wellness-tools', price: 65, salePrice: null, description: 'SAD and mood improvement', stock: 35 },
  
  // Books (5)
  { name: 'The Mindful Way', category: 'books', price: 22, salePrice: 18, description: 'Guide to mindful living', stock: 100 },
  { name: 'Nutrition Fundamentals', category: 'books', price: 28, salePrice: null, description: 'Complete nutrition guide', stock: 80 },
  { name: 'Yoga for Everyone', category: 'books', price: 25, salePrice: 20, description: 'Beginner to advanced poses', stock: 90 },
  { name: 'Sleep Better Tonight', category: 'books', price: 20, salePrice: null, description: 'Science-backed sleep tips', stock: 75 },
  { name: 'Stress-Free Living', category: 'books', price: 24, salePrice: 19, description: 'Practical stress management', stock: 85 },
];

async function seedSanity() {
  console.log('🌱 Starting Sanity seed...\n');

  try {
    // Create providers first
    console.log('📦 Creating providers...');
    const createdProviders: Record<string, string> = {};
    
    for (const provider of providers) {
      const doc = {
        _type: 'provider',
        name: provider.name,
        slug: { _type: 'slug', current: slugify(provider.name) },
        category: provider.category,
        shortDescription: provider.description,
        longDescription: `${provider.description}. We are committed to providing exceptional wellness experiences that transform lives. Our team of certified professionals brings years of expertise to every session.`,
        rating: provider.rating,
        reviewCount: Math.floor(Math.random() * 200) + 50,
        location: {
          area: ['Downtown', 'Marina', 'Palm Jumeirah', 'Business Bay', 'JBR'][Math.floor(Math.random() * 5)],
          distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
        },
        contactInfo: {
          phone: `+971 4 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
          email: `contact@${slugify(provider.name)}.com`,
          whatsapp: `+971 50 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
        },
        averageSessionDuration: ['30 min', '45 min', '60 min', '90 min'][Math.floor(Math.random() * 4)],
        priceRange: {
          min: Math.floor(Math.random() * 50) + 25,
          max: Math.floor(Math.random() * 200) + 100,
        },
        discountText: Math.random() > 0.5 ? `${Math.floor(Math.random() * 20) + 10}% OFF First Visit` : null,
        amenities: ['WiFi', 'Parking', 'Locker Room', 'Shower', 'Towels', 'Refreshments'].slice(0, Math.floor(Math.random() * 4) + 2),
        openingHours: [
          { day: 'Monday - Friday', hours: '8:00 AM - 9:00 PM' },
          { day: 'Saturday', hours: '9:00 AM - 7:00 PM' },
          { day: 'Sunday', hours: '10:00 AM - 6:00 PM' },
        ],
        featured: Math.random() > 0.7,
        isActive: true,
      };

      const result = await client.create(doc);
      createdProviders[provider.name] = result._id;
      console.log(`  ✓ ${provider.name}`);
    }

    console.log(`\n✅ Created ${providers.length} providers\n`);

    // Create services with provider references
    console.log('🛠️ Creating services...');
    let serviceCount = 0;
    
    for (const service of services) {
      // Find matching providers for this service category
      const matchingProviders = providers.filter(p => 
        p.hasServices && (
          p.category === service.category || 
          (service.category === 'spa' && ['spa', 'wellness'].includes(p.category)) ||
          (service.category === 'yoga' && ['yoga', 'fitness', 'wellness'].includes(p.category)) ||
          (service.category === 'meditation' && ['meditation', 'yoga', 'wellness'].includes(p.category)) ||
          (service.category === 'fitness' && ['fitness', 'wellness'].includes(p.category)) ||
          (service.category === 'therapy' && ['therapy', 'wellness'].includes(p.category)) ||
          (service.category === 'coaching' && ['coaching', 'therapy'].includes(p.category)) ||
          (service.category === 'beauty' && ['beauty', 'spa'].includes(p.category)) ||
          (service.category === 'nutrition' && ['nutrition', 'wellness'].includes(p.category))
        )
      );

      const selectedProvider = matchingProviders[Math.floor(Math.random() * matchingProviders.length)];
      
      const doc = {
        _type: 'service',
        title: service.title,
        slug: { _type: 'slug', current: slugify(service.title) },
        description: service.description,
        category: service.category,
        basePrice: service.price,
        duration: service.duration,
        rating: service.rating,
        reviewCount: Math.floor(Math.random() * 150) + 20,
        serviceType: ['in-person', 'online', 'both'][Math.floor(Math.random() * 3)],
        isActive: true,
        order: serviceCount,
        provider: selectedProvider ? { _type: 'reference', _ref: createdProviders[selectedProvider.name] } : undefined,
      };

      await client.create(doc);
      serviceCount++;
      console.log(`  ✓ ${service.title}`);
    }

    console.log(`\n✅ Created ${serviceCount} services\n`);

    // Create products with provider references
    console.log('🛍️ Creating products...');
    let productCount = 0;
    
    for (const product of products) {
      // Find matching providers for this product category
      const matchingProviders = providers.filter(p => 
        p.hasProducts && (
          (product.category === 'skincare' && ['beauty', 'spa', 'wellness'].includes(p.category)) ||
          (product.category === 'supplements' && ['nutrition', 'wellness', 'fitness'].includes(p.category)) ||
          (product.category === 'aromatherapy' && ['spa', 'wellness', 'meditation'].includes(p.category)) ||
          (product.category === 'fitness-gear' && ['fitness', 'yoga', 'wellness'].includes(p.category)) ||
          (product.category === 'wellness-tools' && ['wellness', 'spa', 'beauty'].includes(p.category)) ||
          (product.category === 'books' && ['coaching', 'therapy', 'wellness'].includes(p.category))
        )
      );

      const selectedProvider = matchingProviders[Math.floor(Math.random() * matchingProviders.length)];
      
      const doc = {
        _type: 'product',
        name: product.name,
        slug: { _type: 'slug', current: slugify(product.name) },
        description: product.description,
        category: product.category,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        discountPercentage: product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : null,
        featured: Math.random() > 0.7,
        isActive: true,
        provider: selectedProvider ? { _type: 'reference', _ref: createdProviders[selectedProvider.name] } : undefined,
      };

      await client.create(doc);
      productCount++;
      console.log(`  ✓ ${product.name}`);
    }

    console.log(`\n✅ Created ${productCount} products\n`);
    console.log('🎉 Seed completed successfully!');
    console.log(`   - ${providers.length} Providers`);
    console.log(`   - ${serviceCount} Services`);
    console.log(`   - ${productCount} Products`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Run the seed
seedSanity();
