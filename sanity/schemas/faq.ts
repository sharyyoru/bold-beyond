import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
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
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answerAr",
      title: "Answer (Arabic)",
      type: "text",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Booking", value: "booking" },
          { title: "Payment", value: "payment" },
          { title: "Services", value: "services" },
          { title: "Account", value: "account" },
          { title: "Cancellation", value: "cancellation" },
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
      subtitle: "category",
    },
  },
});
