import { PrismaClient } from "@prisma/client";
import { eventSchema } from "./schema";
import { z } from "zod";

type eventType = z.infer<typeof eventSchema>;

export const db = new PrismaClient().$extends({
  model: {
    event: {
      async create(data: eventType) {
        const point = `POINT(${data.longitude} ${data.latitude})`;

        await db.$queryRaw`
          INSERT INTO "Event" (event_name, city_name, date, latitude, longitude, coords)
          VALUES (${data.event_name}, ${data.city_name}, ${data.date}, ${data.latitude}, ${data.longitude}, ST_GeomFromText(${point}, 4326))
          `;

        return data;
      },
    },
  },
});
