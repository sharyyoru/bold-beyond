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

  // Testimonials
  allTestimonials: `*[_type == "testimonial" && featured == true] | order(publishedAt desc) {
    _id,
    clientName,
    clientNameAr,
    clientPhoto,
    rating,
    content,
    contentAr,
    service-> { title },
    expert-> { name }
  }`,

  // FAQ
  allFaqs: `*[_type == "faq" && isActive == true] | order(order asc) {
    _id,
    question,
    questionAr,
    answer,
    answerAr,
    category
  }`,

  faqsByCategory: `*[_type == "faq" && isActive == true && category == $category] | order(order asc) {
    _id,
    question,
    questionAr,
    answer,
    answerAr,
    category
  }`,

  // Clinics
  allClinics: `*[_type == "clinic" && isActive == true] | order(name asc) {
    _id,
    name,
    nameAr,
    slug,
    logo,
    description,
    descriptionAr,
    address,
    area,
    phone,
    featured
  }`,

  clinicBySlug: `*[_type == "clinic" && slug.current == $slug][0] {
    _id,
    name,
    nameAr,
    slug,
    logo,
    images,
    description,
    descriptionAr,
    address,
    addressAr,
    area,
    city,
    coordinates,
    phone,
    email,
    website,
    openingHours,
    amenities,
    "services": services[]-> { _id, title, slug },
    "experts": experts[]-> { _id, name, slug, photo, title }
  }`,

  // Products
  allProducts: `*[_type == "product" && isActive == true] | order(featured desc, name asc) {
    _id,
    name,
    nameAr,
    slug,
    images,
    category,
    price,
    salePrice,
    featured
  }`,

  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    nameAr,
    slug,
    description,
    descriptionAr,
    images,
    category,
    price,
    salePrice,
    sku,
    stock,
    features,
    "relatedServices": relatedServices[]-> { _id, title, slug }
  }`,

  // Collections
  allCollections: `*[_type == "collection" && isActive == true] | order(order asc) {
    _id,
    name,
    nameAr,
    slug,
    description,
    image,
    type
  }`,

  collectionBySlug: `*[_type == "collection" && slug.current == $slug][0] {
    _id,
    name,
    nameAr,
    slug,
    description,
    descriptionAr,
    image,
    type,
    "services": services[]-> { _id, title, slug, description, icon },
    "experts": experts[]-> { _id, name, slug, photo, title },
    "products": products[]-> { _id, name, slug, images, price },
    "blogPosts": blogPosts[]-> { _id, title, slug, excerpt, featuredImage }
  }`,

  // Specializations
  allSpecializations: `*[_type == "specialization" && isActive == true] | order(order asc) {
    _id,
    name,
    nameAr,
    slug,
    description,
    icon,
    color
  }`,

  // Onboarding Questions
  onboardingQuestions: `*[_type == "onboardingQuestion" && isActive == true] | order(order asc) {
    _id,
    question,
    questionAr,
    type,
    answers[] {
      answer,
      answerAr,
      collection-> { _id, slug },
      tags,
      score
    },
    category,
    required
  }`,

  // Test Questions
  testQuestions: `*[_type == "testQuestion" && isActive == true && testName == $testName] | order(order asc) {
    _id,
    question,
    questionAr,
    type,
    answers[] {
      answer,
      answerAr,
      score,
      flagRisk
    },
    category
  }`,

  allTestNames: `*[_type == "testQuestion" && isActive == true] {
    testName
  } | unique`,

  // Homepage
  homepage: `*[_type == "homepage"][0] {
    heroTagline,
    heroTaglineAr,
    heroHeadline,
    heroHeadlineAr,
    heroHighlightedText,
    heroHighlightedTextAr,
    heroDescription,
    heroDescriptionAr,
    heroPrimaryCta,
    heroPrimaryCtaAr,
    heroSecondaryCta,
    heroSecondaryCtaAr,
    heroImage,
    servicesTitle,
    servicesTitleAr,
    servicesDescription,
    servicesDescriptionAr,
    featuredServices,
    featuresTagline,
    featuresTaglineAr,
    featuresTitle,
    featuresTitleAr,
    featuresDescription,
    featuresDescriptionAr,
    featuresList,
    featuresImage,
    stats,
    testimonialsTitle,
    testimonialsTitleAr,
    testimonialsDescription,
    testimonialsDescriptionAr,
    featuredTestimonials[]-> {
      _id,
      clientName,
      clientNameAr,
      clientPhoto,
      rating,
      content,
      contentAr
    },
    ctaTitle,
    ctaTitleAr,
    ctaDescription,
    ctaDescriptionAr,
    ctaPrimaryButton,
    ctaPrimaryButtonAr,
    ctaSecondaryButton,
    ctaSecondaryButtonAr
  }`,
};

// Fetch helper
export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  return sanityClient.fetch(query, params);
}
