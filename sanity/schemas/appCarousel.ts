import { defineField, defineType } from "sanity";

export default defineType({
  name: "appCarousel",
  title: "App Carousel",
  type: "document",
  fields: [
    defineField({
      name: "slides",
      title: "Carousel Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "titleAr",
              title: "Title (Arabic)",
              type: "string",
            },
            {
              name: "subtitle",
              title: "Subtitle",
              type: "text",
              rows: 2,
            },
            {
              name: "subtitleAr",
              title: "Subtitle (Arabic)",
              type: "text",
              rows: 2,
            },
            {
              name: "ctaText",
              title: "CTA Button Text",
              type: "string",
            },
            {
              name: "ctaTextAr",
              title: "CTA Button Text (Arabic)",
              type: "string",
            },
            {
              name: "ctaLink",
              title: "CTA Link",
              type: "string",
            },
            {
              name: "backgroundImage",
              title: "Background Image (Square)",
              type: "image",
              options: { hotspot: true },
              description: "Square promotional image displayed behind the text",
            },
            {
              name: "gradientFrom",
              title: "Gradient Start Color",
              type: "string",
              options: {
                list: [
                  { title: "Navy", value: "brand-navy" },
                  { title: "Teal", value: "brand-teal" },
                  { title: "Gold", value: "brand-gold" },
                  { title: "Purple", value: "purple-600" },
                  { title: "Pink", value: "pink-500" },
                  { title: "Green", value: "green-500" },
                ],
              },
              initialValue: "brand-navy",
            },
            {
              name: "gradientTo",
              title: "Gradient End Color",
              type: "string",
              options: {
                list: [
                  { title: "Navy", value: "brand-navy" },
                  { title: "Teal", value: "brand-teal" },
                  { title: "Teal Light", value: "brand-teal-light" },
                  { title: "Gold", value: "brand-gold" },
                  { title: "Purple", value: "purple-700" },
                  { title: "Pink", value: "pink-600" },
                  { title: "Green", value: "green-600" },
                ],
              },
              initialValue: "brand-teal",
            },
            {
              name: "duration",
              title: "Display Duration (seconds)",
              type: "number",
              validation: (Rule) => Rule.required().min(2).max(30),
              initialValue: 5,
              description: "How long this slide stays on screen before transitioning",
            },
            {
              name: "isActive",
              title: "Active",
              type: "boolean",
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
              media: "backgroundImage",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "App Carousel Settings",
        subtitle: "Manage header carousel slides",
      };
    },
  },
});
