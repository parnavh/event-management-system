import { db } from "@/db";
import { querySchema } from "@/schema";
import type { NextFunction, Request, Response } from "express";
import { fetchDistance, fetchWeather } from "./util";
import type { z } from "zod";
import type { Event } from "@prisma/client";
import { CustomError } from "@/error";

type Query = z.infer<typeof querySchema>;

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       description: Event returned when finding events
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
 *         weather:
 *           type: string
 *           description: Weather at the event (Using external API)
 *         distance_km:
 *           type: string
 *           description: Distance between the user and the event in km
 *
 *
 *     EventQueryResponse:
 *       type: object
 *       description: Response Recieved when querying for events
 *       properties:
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Event'
 *         page:
 *           type: number
 *           default: 1
 *         pageSize:
 *           type: number
 *           default: 10
 *         totalEvents:
 *           type: number
 *           default: 200
 *         totalPages:
 *           type: number
 *           default: 20
 */

async function fetchAdditionalData(user: Query, event: Event) {
  const [weather, distance] = await Promise.all([
    fetchWeather(event.city_name, event.date),
    fetchDistance(
      event.latitude,
      event.longitude,
      user.latitude,
      user.longitude
    ),
  ]);
  return {
    event_name: event.event_name,
    city_name: event.city_name,
    date: event.date.toISOString().split("T")[0],
    weather: weather.weather,
    distance_km: distance.distance,
  };
}

export async function findEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = querySchema.safeParse(req.query);

    if (!query.success) {
      throw new CustomError("Invalid Request Parameters", 400);
    }

    const { data } = query;

    const page = data.page ?? 1;
    const pageSize = data.pageSize ?? 10;

    const lateDate = new Date(data.date.getTime() + 15 * 24 * 60 * 60 * 1000);

    const [events, totalEvents] = await Promise.all([
      db.event.findMany({
        where: {
          date: {
            gte: data.date,
            lte: lateDate,
          },
        },
        orderBy: {
          date: "asc",
        },
        take: pageSize,
        skip: pageSize * (page - 1),
      }),
      db.event.count({
        where: {
          date: {
            gte: data.date,
            lte: lateDate,
          },
        },
      }),
    ]);

    const promises = events.map((event) => fetchAdditionalData(data, event));

    const results = await Promise.all(promises);

    if (results.length === 0) {
      throw new CustomError("No events found", 404);
    }

    res.status(200).json({
      events: results,
      page,
      pageSize,
      totalEvents,
      totalPages: Math.ceil(totalEvents / pageSize),
    });
  } catch (err) {
    next(err);
  }
}
