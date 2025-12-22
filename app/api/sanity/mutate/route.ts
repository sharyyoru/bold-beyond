import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityToken = process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hgmgl6bw",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: sanityToken,
  useCdn: false,
  apiVersion: "2024-01-01",
});

export async function POST(request: NextRequest) {
  try {
    // Check if token is available
    if (!sanityToken) {
      console.error("Sanity API token not configured");
      return NextResponse.json(
        { error: "Sanity API token not configured. Please add SANITY_API_TOKEN to environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { action, data, documentId } = body;

    console.log("Sanity mutation request:", { action, documentId, dataType: data?._type });

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    let result;

    switch (action) {
      case "create":
        result = await client.create(data);
        break;
      
      case "update":
        if (!documentId) {
          return NextResponse.json({ error: "Document ID required for update" }, { status: 400 });
        }
        result = await client.patch(documentId).set(data).commit();
        break;
      
      case "delete":
        if (!documentId) {
          return NextResponse.json({ error: "Document ID required for delete" }, { status: 400 });
        }
        result = await client.delete(documentId);
        break;

      case "fetch":
        const { query, params } = data;
        result = await client.fetch(query, params || {});
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Sanity mutation error:", error);
    return NextResponse.json(
      { error: error.message || "Mutation failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const providerId = searchParams.get("providerId");

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const result = await client.fetch(query, { providerId });
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Sanity fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Fetch failed" },
      { status: 500 }
    );
  }
}
