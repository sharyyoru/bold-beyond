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
    if (!sanityToken) {
      return NextResponse.json(
        { error: "Sanity API token not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentId = formData.get("documentId") as string;
    const documentType = formData.get("documentType") as string; // 'service' or 'product'
    const fieldName = formData.get("fieldName") as string; // 'image' for service, 'images' for product

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!documentId) {
      return NextResponse.json({ error: "No document ID provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Sanity
    const asset = await client.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    // Update the document with the new image
    if (documentType === "service") {
      await client
        .patch(documentId)
        .set({
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          },
        })
        .commit();
    } else if (documentType === "product") {
      // For products, we need to add to images array
      const doc = await client.getDocument(documentId);
      const existingImages = doc?.images || [];
      
      await client
        .patch(documentId)
        .set({
          images: [
            ...existingImages,
            {
              _type: "image",
              _key: asset._id,
              asset: {
                _type: "reference",
                _ref: asset._id,
              },
            },
          ],
        })
        .commit();
    }

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
    });
  } catch (error: any) {
    console.error("Sanity upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
