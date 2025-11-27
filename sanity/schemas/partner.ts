import { defineType, defineField } from "sanity";

export default defineType({
  name: "partner",
  title: "Partner Venue",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Venue Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
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
          { title: "Gym & Fitness", value: "gym" },
          { title: "Restaurant & Cafe", value: "restaurant" },
          { title: "Spa & Wellness", value: "spa" },
          { title: "Yoga & Meditation", value: "yoga" },
          { title: "Nutrition & Health", value: "nutrition" },
          { title: "Sports Club", value: "sports" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(150),
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
          ],
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
      ],
    }),
    defineField({
      name: "discountText",
      title: "Discount Offer Text",
      type: "string",
      description: "e.g., '20% off for Beyond+ members'",
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
      title: "Featured Partner",
      type: "boolean",
      initialValue: false,
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
