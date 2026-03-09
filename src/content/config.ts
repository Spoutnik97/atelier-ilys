import { defineCollection, z } from "astro:content";

const calendarCollection = defineCollection({
  type: "data",
  schema: z.object({
    events: z.array(
      z.object({
        startDate: z.string(),
        endDate: z.string().optional(),
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
