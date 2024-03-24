import { z } from "zod";

export const eventSchema = z.object({
  event_name: z.string(),
  city_name: z.string(),
  date: z.coerce.date(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});
