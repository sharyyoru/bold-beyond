import { defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    // Hero Section
    defineField({
      name: "heroTagline",
      title: "Hero Tagline",
      type: "string",
      description: "Small text above the main headline",
      initialValue: "Your Wellness Journey Starts Here",
    }),
    defineField({
      name: "heroTaglineAr",
      title: "Hero Tagline (Arabic)",
      type: "string",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Bold Steps to a Better You",
    }),
    defineField({
      name: "heroHeadlineAr",
      title: "Hero Headline (Arabic)",
      type: "string",
    }),
    defineField({
      name: "heroHighlightedText",
      title: "Hero Highlighted Text",
      type: "string",
      description: "The part of headline that appears in gold/accent color",
      initialValue: "Better You",
    }),
    defineField({
      name: "heroHighlightedTextAr",
      title: "Hero Highlighted Text (Arabic)",
      type: "string",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescriptionAr",
      title: "Hero Description (Arabic)",
      type: "text",
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Hero Primary CTA Text",
      type: "string",
      initialValue: "Get Started Free",
    }),
    defineField({
      name: "heroPrimaryCtaAr",
      title: "Hero Primary CTA Text (Arabic)",
      type: "string",
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Hero Secondary CTA Text",
      type: "string",
      initialValue: "Browse Experts",
    }),
    defineField({
      name: "heroSecondaryCtaAr",
      title: "Hero Secondary CTA Text (Arabic)",
      type: "string",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),

    // Services Section
    defineField({
      name: "servicesTitle",
      title: "Services Section Title",
      type: "string",
      initialValue: "Comprehensive Wellness Services",
    }),
    defineField({
      name: "servicesTitleAr",
      title: "Services Section Title (Arabic)",
      type: "string",
    }),
    defineField({
      name: "servicesDescription",
      title: "Services Section Description",
      type: "text",
    }),
    defineField({
      name: "servicesDescriptionAr",
      title: "Services Section Description (Arabic)",
      type: "text",
    }),
    defineField({
      name: "featuredServices",
      title: "Featured Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "titleAr", title: "Title (Arabic)", type: "string" },
            { name: "description", title: "Description", type: "text" },
            { name: "descriptionAr", title: "Description (Arabic)", type: "text" },
            {
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Brain", value: "brain" },
                  { title: "Sparkles", value: "sparkles" },
                  { title: "Heart", value: "heart" },
                  { title: "Users", value: "users" },
                  { title: "Star", value: "star" },
                  { title: "Calendar", value: "calendar" },
                ],
              },
            },
            { name: "href", title: "Link URL", type: "string" },
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // Features Section
    defineField({
      name: "featuresTagline",
      title: "Features Tagline",
      type: "string",
      initialValue: "Why Choose Us",
    }),
    defineField({
      name: "featuresTaglineAr",
      title: "Features Tagline (Arabic)",
      type: "string",
    }),
    defineField({
      name: "featuresTitle",
      title: "Features Section Title",
      type: "string",
      initialValue: "Everything You Need for Your Wellness Journey",
    }),
    defineField({
      name: "featuresTitleAr",
      title: "Features Section Title (Arabic)",
      type: "string",
    }),
    defineField({
      name: "featuresDescription",
      title: "Features Description",
      type: "text",
    }),
    defineField({
      name: "featuresDescriptionAr",
      title: "Features Description (Arabic)",
      type: "text",
    }),
    defineField({
      name: "featuresList",
      title: "Features List",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "feature", title: "Feature", type: "string" },
            { name: "featureAr", title: "Feature (Arabic)", type: "string" },
          ],
          preview: {
            select: { title: "feature" },
          },
        },
      ],
    }),
    defineField({
      name: "featuresImage",
      title: "Features Section Image",
      type: "image",
      options: { hotspot: true },
    }),

    // Stats
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Value", type: "string" },
            { name: "label", title: "Label", type: "string" },
            { name: "labelAr", title: "Label (Arabic)", type: "string" },
            {
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Calendar", value: "calendar" },
                  { title: "Users", value: "users" },
                  { title: "Star", value: "star" },
                  { title: "Gift", value: "gift" },
                ],
              },
            },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // Testimonials Section
    defineField({
      name: "testimonialsTitle",
      title: "Testimonials Section Title",
      type: "string",
      initialValue: "What Our Members Say",
    }),
    defineField({
      name: "testimonialsTitleAr",
      title: "Testimonials Section Title (Arabic)",
      type: "string",
    }),
    defineField({
      name: "testimonialsDescription",
      title: "Testimonials Description",
      type: "text",
    }),
    defineField({
      name: "testimonialsDescriptionAr",
      title: "Testimonials Description (Arabic)",
      type: "text",
    }),
    defineField({
      name: "featuredTestimonials",
      title: "Featured Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
      validation: (Rule) => Rule.max(6),
    }),

    // CTA Section
    defineField({
      name: "ctaTitle",
      title: "CTA Section Title",
      type: "string",
      initialValue: "Ready to Start Your Wellness Journey?",
    }),
    defineField({
      name: "ctaTitleAr",
      title: "CTA Section Title (Arabic)",
      type: "string",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA Description",
      type: "text",
    }),
    defineField({
      name: "ctaDescriptionAr",
      title: "CTA Description (Arabic)",
      type: "text",
    }),
    defineField({
      name: "ctaPrimaryButton",
      title: "CTA Primary Button Text",
      type: "string",
      initialValue: "Create Free Account",
    }),
    defineField({
      name: "ctaPrimaryButtonAr",
      title: "CTA Primary Button Text (Arabic)",
      type: "string",
    }),
    defineField({
      name: "ctaSecondaryButton",
      title: "CTA Secondary Button Text",
      type: "string",
      initialValue: "Contact Sales",
    }),
    defineField({
      name: "ctaSecondaryButtonAr",
      title: "CTA Secondary Button Text (Arabic)",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage Content",
        subtitle: "Edit homepage sections",
      };
    },
  },
});
