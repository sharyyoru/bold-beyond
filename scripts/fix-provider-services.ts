import { createClient } from '@sanity/client';

const SANITY_WRITE_TOKEN = process.env.SANITY_API_TOKEN || '';

const client = createClient({
  projectId: 'hgmgl6bw',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function fixProviderServices() {
  console.log('🔧 Fixing provider services distribution...\n');

  try {
    // Get all providers
    const providers = await client.fetch(`*[_type == "provider"] { _id, name, category }`);
    console.log(`Found ${providers.length} providers\n`);

    // Get all services with their provider references
    const services = await client.fetch(`*[_type == "service"] { _id, title, category, provider }`);
    console.log(`Found ${services.length} services\n`);

    // Count services per provider
    const serviceCountByProvider: Record<string, number> = {};
    const servicesWithoutProvider: any[] = [];
    
    for (const service of services) {
      if (service.provider?._ref) {
        serviceCountByProvider[service.provider._ref] = (serviceCountByProvider[service.provider._ref] || 0) + 1;
      } else {
        servicesWithoutProvider.push(service);
      }
    }

    // Find providers with less than 3 services
    const providersNeedingServices: any[] = [];
    for (const provider of providers) {
      const count = serviceCountByProvider[provider._id] || 0;
      if (count < 3) {
        providersNeedingServices.push({ ...provider, currentCount: count, needed: 3 - count });
      }
    }

    console.log(`Providers needing more services: ${providersNeedingServices.length}`);
    for (const p of providersNeedingServices) {
      console.log(`  - ${p.name}: has ${p.currentCount}, needs ${p.needed} more`);
    }

    if (providersNeedingServices.length === 0) {
      console.log('\n✅ All providers have at least 3 services!');
      return;
    }

    // Category mappings for service assignment
    const categoryMappings: Record<string, string[]> = {
      spa: ['spa', 'massage', 'beauty', 'wellness'],
      fitness: ['fitness', 'yoga', 'wellness'],
      therapy: ['therapy', 'coaching', 'wellness'],
      wellness: ['wellness', 'spa', 'fitness', 'therapy', 'meditation', 'yoga'],
      beauty: ['beauty', 'spa', 'skincare'],
      nutrition: ['nutrition', 'wellness', 'coaching'],
      yoga: ['yoga', 'meditation', 'fitness', 'wellness'],
      meditation: ['meditation', 'yoga', 'wellness', 'therapy'],
      coaching: ['coaching', 'therapy', 'wellness'],
    };

    // Services to potentially reassign (those from providers with many services)
    const providersWithMany = providers.filter((p: any) => (serviceCountByProvider[p._id] || 0) > 5);
    
    // Get services from providers with many services that can be reassigned
    const reassignableServices: any[] = [];
    for (const service of services) {
      if (service.provider?._ref) {
        const providerServiceCount = serviceCountByProvider[service.provider._ref] || 0;
        if (providerServiceCount > 4) {
          reassignableServices.push(service);
        }
      }
    }

    console.log(`\nReassignable services: ${reassignableServices.length}`);
    console.log(`Services without provider: ${servicesWithoutProvider.length}`);

    // Assign services to providers needing them
    let assignmentsCount = 0;
    
    for (const provider of providersNeedingServices) {
      const compatibleCategories = categoryMappings[provider.category] || [provider.category];
      
      // First, try to assign services without a provider
      for (let i = 0; i < servicesWithoutProvider.length && provider.needed > 0; i++) {
        const service = servicesWithoutProvider[i];
        if (compatibleCategories.includes(service.category)) {
          console.log(`\n  Assigning "${service.title}" to "${provider.name}"`);
          await client.patch(service._id).set({
            provider: { _type: 'reference', _ref: provider._id }
          }).commit();
          provider.needed--;
          assignmentsCount++;
          servicesWithoutProvider.splice(i, 1);
          i--;
        }
      }

      // Then, reassign from providers with many services
      for (let i = 0; i < reassignableServices.length && provider.needed > 0; i++) {
        const service = reassignableServices[i];
        if (compatibleCategories.includes(service.category)) {
          // Check if source provider still has more than 3 after reassignment
          const sourceCount = serviceCountByProvider[service.provider._ref] || 0;
          if (sourceCount > 3) {
            console.log(`\n  Reassigning "${service.title}" to "${provider.name}"`);
            await client.patch(service._id).set({
              provider: { _type: 'reference', _ref: provider._id }
            }).commit();
            
            serviceCountByProvider[service.provider._ref]--;
            serviceCountByProvider[provider._id] = (serviceCountByProvider[provider._id] || 0) + 1;
            provider.needed--;
            assignmentsCount++;
            reassignableServices.splice(i, 1);
            i--;
          }
        }
      }
    }

    console.log(`\n✅ Made ${assignmentsCount} service assignments`);

    // Final count
    console.log('\n📊 Final service distribution:');
    for (const provider of providers) {
      const count = serviceCountByProvider[provider._id] || 0;
      const status = count >= 3 ? '✅' : '⚠️';
      console.log(`  ${status} ${provider.name}: ${count} services`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

fixProviderServices();
