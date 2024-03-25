import express from "express";
import { db } from "@/db";
import { eventSchema } from "@/schema";
import { findEvents } from "./find";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Post to create event");
});

router.post("/", async (req, res) => {
  const data = eventSchema.safeParse(req.body);

  if (!data.success) {
    throw new Error(data.error.message);
  }

  const event = await db.event.findFirst({
    where: {
      event_name: data.data.event_name,
      city_name: data.data.city_name,
      date: data.data.date,
    },
  });

  if (event) {
    throw new Error("Event already exists");
  }

  await db.event.create({
    data: data.data,
  });

  res.status(200).json({ message: "Event created successfully" });
});

router.get("/find", findEvents);

export default router;
