import { defineField, defineType } from "sanity";

export default defineType({
  name: "clinic",
  title: "Clinic",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Clinic Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameAr",
      title: "Clinic Name (Arabic)",
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
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "descriptionAr",
      title: "Description (Arabic)",
      type: "text",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "addressAr",
      title: "Address (Arabic)",
      type: "string",
    }),
    defineField({
      name: "area",
      title: "Area",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      initialValue: "Dubai",
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "object",
      fields: [
        { name: "lat", title: "Latitude", type: "number" },
        { name: "lng", title: "Longitude", type: "number" },
      ],
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "day", title: "Day", type: "string" },
            { name: "open", title: "Open", type: "string" },
            { name: "close", title: "Close", type: "string" },
            { name: "closed", title: "Closed", type: "boolean" },
          ],
        },
      ],
    }),
    defineField({
      name: "services",
      title: "Services Offered",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "experts",
      title: "Experts at this Clinic",
      type: "array",
      of: [{ type: "reference", to: [{ type: "expert" }] }],
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
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
      subtitle: "area",
      media: "logo",
    },
  },
});
