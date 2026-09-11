import express, { type Express } from "express";
import type { createAppointmentService } from "../application/create-appointment";
import { appointmentsRouter } from "./appointments-router";

type CreateAppointmentHandler = ReturnType<typeof createAppointmentService>;

export function createHttpApp(
  createAppointment: CreateAppointmentHandler,
): Express {
  const app = express();

  app.use(express.json());
  app.use("/api/appointments", appointmentsRouter(createAppointment));

  return app;
}