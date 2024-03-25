import express from "express";
import cors from "cors";
import { env } from "@/env";
import eventsRouter from "@/routes/events";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.use("/events", eventsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
