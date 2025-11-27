import { defineField, defineType } from "sanity";

export default defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Collection Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameAr",
      title: "Collection Name (Arabic)",
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
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "type",
      title: "Collection Type",
      type: "string",
      options: {
        list: [
          { title: "Services", value: "services" },
          { title: "Experts", value: "experts" },
          { title: "Products", value: "products" },
          { title: "Blog Posts", value: "blog" },
        ],
      },
    }),
    defineField({
      name: "services",
      title: "Services in Collection",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      hidden: ({ parent }) => parent?.type !== "services",
    }),
    defineField({
      name: "experts",
      title: "Experts in Collection",
      type: "array",
      of: [{ type: "reference", to: [{ type: "expert" }] }],
      hidden: ({ parent }) => parent?.type !== "experts",
    }),
    defineField({
      name: "products",
      title: "Products in Collection",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      hidden: ({ parent }) => parent?.type !== "products",
    }),
    defineField({
      name: "blogPosts",
      title: "Blog Posts in Collection",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
      hidden: ({ parent }) => parent?.type !== "blog",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
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
      subtitle: "type",
      media: "image",
    },
  },
});
