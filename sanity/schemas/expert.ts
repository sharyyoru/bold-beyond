import { defineType, defineField } from "sanity";

export default defineType({
  name: "expert",
  title: "Expert / Therapist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
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
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Professional Title",
      type: "string",
      description: "e.g., 'Clinical Psychologist', 'Life Coach'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
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
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "video",
      title: "Introduction Video",
      type: "object",
      fields: [
        { name: "url", title: "Video URL", type: "url" },
        { name: "thumbnail", title: "Thumbnail", type: "image" },
      ],
    }),
    defineField({
      name: "specializations",
      title: "Specializations",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "English", value: "english" },
          { title: "Arabic", value: "arabic" },
          { title: "French", value: "french" },
          { title: "Hindi", value: "hindi" },
          { title: "Urdu", value: "urdu" },
          { title: "Spanish", value: "spanish" },
          { title: "Russian", value: "russian" },
        ],
      },
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications & Certifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "degree", title: "Degree/Certification", type: "string" },
            { name: "institution", title: "Institution", type: "string" },
            { name: "year", title: "Year", type: "number" },
          ],
        },
      ],
    }),
    defineField({
      name: "clinicAddress",
      title: "Clinic Address",
      type: "object",
      fields: [
        { name: "line1", title: "Address Line 1", type: "string" },
        { name: "line2", title: "Address Line 2", type: "string" },
        { name: "city", title: "City", type: "string" },
        { name: "emirate", title: "Emirate", type: "string" },
        { name: "mapUrl", title: "Google Maps URL", type: "url" },
      ],
    }),
    defineField({
      name: "services",
      title: "Services Offered",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "service" }],
        },
      ],
    }),
    defineField({
      name: "rating",
      title: "Average Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
      initialValue: 5,
    }),
    defineField({
      name: "reviewCount",
      title: "Number of Reviews",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured Expert",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "title",
      media: "photo",
    },
  },
});
