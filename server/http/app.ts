import express, { Router, type Express, type RequestHandler } from "express";
import type { createAppointmentService } from "../application/create-appointment";
import { appointmentsRouter } from "./appointments-router";

type CreateAppointmentHandler = ReturnType<typeof createAppointmentService>;

const denyUnauthenticated: RequestHandler = (_request, response) => {
  response.status(401).json({
    error: { code: "UNAUTHORIZED", message: "Authentication required." },
  });
};

export interface HttpAuthDependencies {
  router?: Router;
  requireAuth?: RequestHandler;
}

export function createHttpApp(
  createAppointment: CreateAppointmentHandler,
  auth: HttpAuthDependencies = {},
): Express {
  const app = express();

  app.use(express.json());
  if (auth.router) {
    app.use("/api/auth", auth.router);
  }
  app.use(
    "/api/appointments",
    appointmentsRouter(createAppointment, auth.requireAuth ?? denyUnauthenticated),
  );

  return app;
}
