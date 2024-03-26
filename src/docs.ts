import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Management System API Documentation",
      version: "0.1.0",
      description: "API made for GyanGrove",
    },
    servers: [
      {
        url: env.SERVER_URL,
      },
    ],
  },
  apis: ["routes/*.ts"],
};

export const specs = swaggerJSDoc(options);
