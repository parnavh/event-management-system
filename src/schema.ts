import { z } from "zod";

export const eventSchema = z.object({
  event_name: z.string().min(1),
  city_name: z.string().min(1),
  date: z.coerce.date(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export const querySchema = z.object({
  date: z.coerce.date(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).optional(),
});
