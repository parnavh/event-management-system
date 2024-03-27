import express from "express";
import { db } from "@/db";
import { eventSchema } from "@/schema";
import { findEvents } from "./find";
import { CustomError } from "@/error";

const router = express.Router();

/**
 * @swagger
 *
 * tags:
 *   name: Events
 *   description: Interacting with events
 *
 *
 * /events:
 *   put:
 *     summary: Create a new Event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventAdd'
 *     responses:
 *       200:
 *         description: Event was created.
 *       400:
 *         description: Invalid Request Parameters
 *       409:
 *         description: Event already exists
 *       500:
 *         description: Internal server error
 *
 *
 * /events/find:
 *   get:
 *     summary: Find events according to date and location
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date to query for
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The latitude of the user
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The longitude of the user
 *       - in: query
 *         name: page
 *         required: false
 *         default: 1
 *         schema:
 *           type: number
 *         description: The page number for results
 *       - in: query
 *         name: pageSize
 *         required: false
 *         default: 10
 *         schema:
 *           type: number
 *         description: The page size for results
 *     responses:
 *       200:
 *         description: Events found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventQueryResponse'
 *       400:
 *         description: Invalid Request Parameters
 *       404:
 *         description: No Events found
 *       500:
 *         description: Internal Server Error
 *
 */

router.put("/", async (req, res, next) => {
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
      throw new CustomError("Event already exists", 409);
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
