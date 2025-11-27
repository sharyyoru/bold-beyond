import { defineField, defineType } from "sanity";

export default defineType({
  name: "onboardingQuestion",
  title: "Onboarding Question",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "questionAr",
      title: "Question (Arabic)",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "Question Type",
      type: "string",
      options: {
        list: [
          { title: "Single Choice", value: "single" },
          { title: "Multiple Choice", value: "multiple" },
          { title: "Text Input", value: "text" },
          { title: "Scale (1-10)", value: "scale" },
        ],
      },
      initialValue: "single",
    }),
    defineField({
      name: "answers",
      title: "Answer Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "answer",
              title: "Answer",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answerAr",
              title: "Answer (Arabic)",
              type: "string",
            },
            {
              name: "collection",
              title: "Maps to Collection",
              type: "reference",
              to: [{ type: "collection" }],
            },
            {
              name: "tags",
              title: "Tags",
              type: "array",
              of: [{ type: "string" }],
            },
            {
              name: "score",
              title: "Score Value",
              type: "number",
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              title: "answer",
              subtitle: "answerAr",
            },
          },
        },
      ],
      hidden: ({ parent }) => parent?.type === "text" || parent?.type === "scale",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Goals", value: "goals" },
          { title: "Preferences", value: "preferences" },
          { title: "History", value: "history" },
          { title: "Lifestyle", value: "lifestyle" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "required",
      title: "Required",
      type: "boolean",
      initialValue: true,
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
      title: "question",
      subtitle: "category",
    },
  },
});
