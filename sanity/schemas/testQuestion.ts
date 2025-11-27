import { defineField, defineType } from "sanity";

export default defineType({
  name: "testQuestion",
  title: "Test Question",
  type: "document",
  fields: [
    defineField({
      name: "testName",
      title: "Test Name",
      type: "string",
      description: "Name of the assessment/test this question belongs to",
      validation: (Rule) => Rule.required(),
    }),
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
          { title: "Likert Scale", value: "likert" },
          { title: "Yes/No", value: "yesno" },
          { title: "Text", value: "text" },
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
              name: "score",
              title: "Score",
              type: "number",
              initialValue: 0,
            },
            {
              name: "flagRisk",
              title: "Flag as Risk",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: "answer",
              subtitle: "score",
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle: `Score: ${subtitle || 0}`,
              };
            },
          },
        },
      ],
      hidden: ({ parent }) => parent?.type === "text",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Anxiety", value: "anxiety" },
          { title: "Depression", value: "depression" },
          { title: "Stress", value: "stress" },
          { title: "Sleep", value: "sleep" },
          { title: "Relationships", value: "relationships" },
          { title: "General Wellbeing", value: "wellbeing" },
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
      subtitle: "testName",
    },
  },
});
