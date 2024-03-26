import express from "express";
import { db } from "@/db";
import { eventSchema } from "@/schema";
import { findEvents } from "./find";
import { CustomError } from "@/error";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Post to create event");
});

router.post("/", async (req, res, next) => {
  try {
    const data = eventSchema.safeParse(req.body);

    if (!data.success) {
      throw new CustomError("Invalid Request Parameters", 400);
    }

    const event = await db.event.findFirst({
      where: {
        event_name: data.data.event_name,
        city_name: data.data.city_name,
        date: data.data.date,
      },
    });

    if (event) {
      throw new CustomError("Event already exists", 400);
    }

    await db.event.create({
      data: data.data,
    });

    res.status(200).json({ message: "Event created successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/find", findEvents);

export default router;
