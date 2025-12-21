/**
 * Seed Ratings Script
 * 
 * This script adds random ratings and review counts to products and services
 * in the Sanity database for testing purposes.
 * 
 * Run with: npx ts-node scripts/seed-ratings.ts
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "hgmgl6bw",
  dataset: "production",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

// Generate a random rating between 3.5 and 5.0 (realistic good ratings)
function generateRating(): number {
  return Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
}

// Generate a random review count between 5 and 150
function generateReviewCount(): number {
  return Math.floor(5 + Math.random() * 145);
}

async function seedRatings() {
  console.log("🌟 Starting to seed ratings...\n");

  try {
    // Fetch all products
    const products = await client.fetch(`*[_type == "product"]{ _id, name }`);
    console.log(`Found ${products.length} products`);

    // Update products with ratings
    for (const product of products) {
      const rating = generateRating();
      const reviewCount = generateReviewCount();
      
      await client
        .patch(product._id)
        .set({ rating, reviewCount })
        .commit();
      
      console.log(`  ✓ ${product.name}: ${rating}⭐ (${reviewCount} reviews)`);
    }

    // Fetch all services
    const services = await client.fetch(`*[_type == "service"]{ _id, title }`);
    console.log(`\nFound ${services.length} services`);

    // Update services with ratings
    for (const service of services) {
      const rating = generateRating();
      const reviewCount = generateReviewCount();
      
      await client
        .patch(service._id)
        .set({ rating, reviewCount })
        .commit();
      
      console.log(`  ✓ ${service.title}: ${rating}⭐ (${reviewCount} reviews)`);
    }

    // Fetch all providers
    const providers = await client.fetch(`*[_type == "provider"]{ _id, name }`);
    console.log(`\nFound ${providers.length} providers`);

    // Update providers with ratings
    for (const provider of providers) {
      const rating = generateRating();
      const reviewCount = generateReviewCount();
      
      await client
        .patch(provider._id)
        .set({ rating, reviewCount })
        .commit();
      
      console.log(`  ✓ ${provider.name}: ${rating}⭐ (${reviewCount} reviews)`);
    }

    console.log("\n✅ Successfully seeded all ratings!");
    console.log("\nRating Distribution:");
    console.log("  - Products: Random ratings between 3.5-5.0");
    console.log("  - Services: Random ratings between 3.5-5.0");
    console.log("  - Providers: Random ratings between 3.5-5.0");
    console.log("  - Review counts: Random between 5-150");

  } catch (error) {
    console.error("❌ Error seeding ratings:", error);
    process.exit(1);
  }
}

// Run the seed function
seedRatings();
