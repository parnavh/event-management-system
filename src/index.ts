import express from "express";
import cors from "cors";
import { env } from "./env";
import { db } from "./db";
import { eventSchema } from "./schema";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.post("/event", async (req, res) => {
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
