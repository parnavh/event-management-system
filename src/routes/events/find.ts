import { db } from "@/db";
import { querySchema } from "@/schema";
import type { NextFunction, Request, Response } from "express";
import { fetchDistance, fetchWeather } from "./util";
import type { z } from "zod";
import type { Event } from "@prisma/client";
import { CustomError } from "@/error";

type Query = z.infer<typeof querySchema>;

async function fetchAdditionalData(user: Query, event: Event) {
  const [weather, distance] = await Promise.all([
    fetchWeather(event.city_name, event.date),
    fetchDistance(
      event.latitude,
      event.longitude,
      user.latitude,
      user.longitude,
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
  next: NextFunction,
) {
  try {
    const query = querySchema.safeParse(req.query);

    if (!query.success) {
      throw new CustomError("Invalid Request Parameters", 400);
    }

    const { data } = query;

    const page = data.page ?? 1;
    const pageSize = data.pageSize ?? 10;

    const roundedLateDate = new Date(
      data.date.getTime() + 15 * 24 * 60 * 60 * 1000,
    );

    const [events, totalEvents] = await Promise.all([
      db.event.findMany({
        where: {
          date: {
            gte: data.date,
            lte: roundedLateDate,
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
            lte: roundedLateDate,
          },
        },
      }),
    ]);

    const promises = events.map((event) => fetchAdditionalData(data, event));

    const results = await Promise.all(promises);

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
