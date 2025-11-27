import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clientNameAr",
      title: "Client Name (Arabic)",
      type: "string",
    }),
    defineField({
      name: "clientPhoto",
      title: "Client Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "content",
      title: "Testimonial Content",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentAr",
      title: "Testimonial Content (Arabic)",
      type: "text",
    }),
    defineField({
      name: "service",
      title: "Service Used",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "expert",
      title: "Expert",
      type: "reference",
      to: [{ type: "expert" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "clientName",
      subtitle: "content",
      media: "clientPhoto",
    },
  },
});
