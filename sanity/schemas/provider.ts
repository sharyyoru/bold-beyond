import { defineField, defineType } from "sanity";

export default defineType({
  name: "provider",
  title: "Provider",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Provider Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameAr",
      title: "Provider Name (Arabic)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Holistic Wellness", value: "holistic-wellness" },
          { title: "Meditation & Mindfulness", value: "meditation" },
          { title: "Spa & Beauty", value: "spa-beauty" },
          { title: "Fitness & Yoga", value: "fitness-yoga" },
          { title: "Therapy & Counseling", value: "therapy" },
          { title: "Nutrition & Health", value: "nutrition" },
          { title: "Coaching", value: "coaching" },
          { title: "Alternative Medicine", value: "alternative" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "shortDescriptionAr",
      title: "Short Description (Arabic)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        { name: "address", title: "Address", type: "string" },
        { name: "area", title: "Area", type: "string" },
        { name: "city", title: "City", type: "string", initialValue: "Dubai" },
        { name: "distance", title: "Distance (km)", type: "string" },
        { name: "mapUrl", title: "Google Maps URL", type: "url" },
        {
          name: "coordinates",
          title: "Coordinates",
          type: "geopoint",
        },
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      fields: [
        { name: "phone", title: "Phone", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "website", title: "Website", type: "url" },
        { name: "instagram", title: "Instagram", type: "string" },
        { name: "whatsapp", title: "WhatsApp", type: "string" },
      ],
    }),
    defineField({
      name: "averageSessionDuration",
      title: "Average Session Duration",
      type: "string",
      description: "e.g., '45 - 60 mins'",
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "object",
      fields: [
        { name: "min", title: "Minimum Price (AED)", type: "number" },
        { name: "max", title: "Maximum Price (AED)", type: "number" },
      ],
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "discountText",
      title: "Discount Offer Text",
      type: "string",
      description: "e.g., '15% off on selected items using B&B Premium'",
    }),
    defineField({
      name: "amenities",
      title: "Amenities & Features",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "days",
              title: "Days",
              type: "string",
              description: "e.g., 'Mon-Fri' or 'Saturday'",
            },
            { name: "hours", title: "Hours", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Provider",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "logo",
    },
  },
});
