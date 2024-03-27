import express from "express";
import cors from "cors";
import { env } from "@/env";
import eventsRouter from "@/routes/events";
import errorHandler from "@/middleware";
import swaggerUI from "swagger-ui-express";
import { specs } from "@/docs";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/events", eventsRouter);

app.get("/curl", (_, res) => {
  res.send(`View interactive demo at ${env.SERVER_URL}\n\nOr use the following curl command:\n\ncurl -X 'GET' \
  '${env.SERVER_URL}/events/find?date=2024-03-15&latitude=40.7128&longitude=-74.0060&page=1&pageSize=10' \
  -H 'accept: application/json'`);
});

app.use((_, res) => {
  res.redirect("/docs");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
