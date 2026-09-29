import { defineCollection, z } from "astro:content";

// YAML parses unquoted dates (e.g. 2026-10-15, as written by Decap CMS) into
// Date objects. Normalize them back to YYYY-MM-DD strings.
const dateString = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const calendarCollection = defineCollection({
  type: "data",
  schema: z.object({
    events: z.array(
      z.object({
        startDate: dateString,
        endDate: dateString.optional(),
        title: z.string(),
        type: z.string(),
        description: z.string().optional(),
        price: z.string().optional(),
        spots: z.number().optional(),
      }),
    ),
  }),
});

export const collections = {
  calendar: calendarCollection,
};
