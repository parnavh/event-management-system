import express from "express";
import cors from "cors";
import "@/env";
import eventsRouter from "@/routes/events";
import errorHandler from "@/middleware";
import swaggerUI from "swagger-ui-express";
import { specs } from "@/docs";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/events", eventsRouter);

app.use((_, res, __) => {
  res.redirect("/docs");
})

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
