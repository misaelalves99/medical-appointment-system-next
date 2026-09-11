import { Router } from "express";
import { ZodError } from "zod";
import { createAppointmentSchema } from "../contracts/appointment";
import {
  AppointmentConflictError,
  AppointmentDomainError,
} from "../application/create-appointment";
import type { createAppointmentService } from "../application/create-appointment";

type CreateAppointmentHandler = ReturnType<typeof createAppointmentService>;

export function appointmentsRouter(
  createAppointment: CreateAppointmentHandler,
): Router {
  const router = Router();

  router.post("/", async (request, response) => {
    try {
      const input = createAppointmentSchema.parse(request.body);
      const appointment = await createAppointment(input);
      response.status(201).json({ data: appointment });
    } catch (error) {
      if (error instanceof ZodError || error instanceof AppointmentDomainError) {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: error.message,
          },
        });
        return;
      }

      if (error instanceof AppointmentConflictError) {
        response.status(409).json({
          error: {
            code: "APPOINTMENT_CONFLICT",
            message: error.message,
          },
        });
        return;
      }

      response.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected server error.",
        },
      });
    }
  });

  return router;
}