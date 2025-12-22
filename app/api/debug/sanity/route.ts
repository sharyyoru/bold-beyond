import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hgmgl6bw",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2024-01-01",
});

// Debug endpoint to check Sanity provider IDs
export async function GET(request: NextRequest) {
  try {
    // Fetch all providers from Sanity
    const providers = await client.fetch(`*[_type == "provider"] { _id, name, slug }`);
    
    // Fetch all services with their provider references
    const services = await client.fetch(`*[_type == "service"] { _id, title, "providerId": provider._ref, "providerName": provider->name }`);
    
    // Fetch all products with their provider references
    const products = await client.fetch(`*[_type == "product"] { _id, name, "providerId": provider._ref, "providerName": provider->name }`);

    return NextResponse.json({
      providers,
      services: services.slice(0, 10), // First 10
      products: products.slice(0, 10), // First 10
      summary: {
        totalProviders: providers.length,
        totalServices: services.length,
        totalProducts: products.length,
        uniqueServiceProviders: Array.from(new Set(services.map((s: any) => s.providerId))),
        uniqueProductProviders: Array.from(new Set(products.map((p: any) => p.providerId))),
      }
    });
  } catch (error: any) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
