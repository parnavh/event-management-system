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

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     EventAdd:
 *       type: object
 *       description: Object Schema for adding events
 *       properties:
 *         event_name:
 *           type: string
 *           description: The name of the event
 *         city_name:
 *           type: string
 *           description: The name of the city
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         latitude:
 *           type: number
 *           description: The latitude of the event
 *         longitude:
 *           type: number
 *           description: The longitude of the event
 *
 *     EventQuery:
 *       type: object
 *       description: Object Schema while querying
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: The date to query for events
 *         latitude:
 *           type: number
 *           description: The latitude of the user
 *         longitude:
 *           type: number
 *           description: The longitude of the user
 *         page:
 *           type: number
 *           default: 1
 *           description: The page number for results
 *         pageSize:
 *           type: number
 *           default: 10
 *           description: The number of results per page
 */
