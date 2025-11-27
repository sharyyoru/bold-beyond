import { defineType, defineField } from "sanity";

export default defineType({
  name: "wellnessQuestion",
  title: "Wellness Question",
  type: "document",
  fields: [
    defineField({
      name: "questionText",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Physical Health", value: "physical" },
          { title: "Mental Health", value: "mental" },
          { title: "Sleep Quality", value: "sleep" },
          { title: "Diet & Nutrition", value: "diet" },
          { title: "Social Connection", value: "social" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "options",
      title: "Answer Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "text",
              title: "Answer Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "value",
              title: "Score Value",
              type: "number",
              description: "1-5 scale (1 = poor, 5 = excellent)",
              validation: (Rule) => Rule.required().min(1).max(5),
            },
            {
              name: "emoji",
              title: "Emoji",
              type: "string",
            },
          ],
          preview: {
            select: {
              title: "text",
              value: "value",
            },
            prepare({ title, value }) {
              return {
                title,
                subtitle: `Score: ${value}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(3).max(5),
    }),
    defineField({
      name: "advice",
      title: "Advice Content",
      type: "object",
      description: "Advice shown based on user's answer",
      fields: [
        {
          name: "low",
          title: "Advice for Low Score (1-2)",
          type: "text",
          rows: 2,
        },
        {
          name: "medium",
          title: "Advice for Medium Score (3)",
          type: "text",
          rows: 2,
        },
        {
          name: "high",
          title: "Advice for High Score (4-5)",
          type: "text",
          rows: 2,
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "questionText",
      subtitle: "category",
    },
  },
});
