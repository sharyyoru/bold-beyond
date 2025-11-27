import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ query helpers
export const queries = {
  // Services
  allServices: `*[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    category,
    benefits,
    seoMetadata
  }`,

  serviceBySlug: `*[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    richDescription,
    icon,
    category,
    benefits,
    image,
    seoMetadata,
    "experts": *[_type == "expert" && references(^._id)] {
      _id,
      name,
      slug,
      photo,
      specializations
    }
  }`,

  // Experts
  allExperts: `*[_type == "expert"] | order(name asc) {
    _id,
    name,
    slug,
    photo,
    title,
    specializations,
    languages,
    rating
  }`,

  expertBySlug: `*[_type == "expert" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    photo,
    title,
    bio,
    video,
    specializations,
    languages,
    clinicAddress,
    rating,
    reviewCount,
    "services": services[]-> {
      _id,
      title,
      slug
    }
  }`,

  // Partners
  allPartners: `*[_type == "partner"] | order(name asc) {
    _id,
    name,
    slug,
    logo,
    category,
    shortDescription,
    location
  }`,

  partnerBySlug: `*[_type == "partner" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo,
    gallery,
    description,
    category,
    location,
    mapEmbed,
    discountText
  }`,

  // Blog
  allBlogPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    author-> {
      name,
      photo
    },
    categories
  }`,

  blogPostBySlug: `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    publishedAt,
    readTime,
    author-> {
      name,
      photo,
      bio
    },
    categories,
    seoMetadata
  }`,

  // Wellness Questions
  wellnessQuestions: `*[_type == "wellnessQuestion"] | order(order asc) {
    _id,
    questionText,
    category,
    options[] {
      text,
      value
    },
    advice
  }`,
};

// Fetch helper
export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  return sanityClient.fetch(query, params);
}
