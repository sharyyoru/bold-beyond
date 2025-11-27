import { defineField, defineType } from "sanity";

export default defineType({
  name: "specialization",
  title: "Specialization",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameAr",
      title: "Name (Arabic)",
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
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Lucide icon name (e.g., 'brain', 'heart', 'users')",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Hex color code (e.g., #C9A227)",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
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
      subtitle: "description",
    },
  },
});
