import { Router, type RequestHandler } from "express";
import { ZodError } from "zod";
import { createAppointmentSchema } from "../contracts/appointment";
import { AppointmentConflictError, AppointmentDomainError } from "../application/create-appointment";
import type { createAppointmentService } from "../application/create-appointment";
import type { AuthenticatedRequest } from "../auth/middleware";

type CreateAppointmentHandler = ReturnType<typeof createAppointmentService>;

function canCreateAppointment(request: AuthenticatedRequest, patientId: string, practitionerId: string): boolean {
  const principal = request.auth;
  if (!principal) return false;
  if (principal.role === "ADMIN") return true;
  if (principal.role === "PATIENT") return principal.sub === patientId;
  return principal.role === "PRACTITIONER" &&
    principal.practitionerId !== null &&
    principal.practitionerId === practitionerId;
}

export function appointmentsRouter(createAppointment: CreateAppointmentHandler, requireAuth: RequestHandler): Router {
  const router = Router();

  router.post("/", requireAuth, async (request, response) => {
    try {
      const input = createAppointmentSchema.parse(request.body);
      const authenticatedRequest = request as AuthenticatedRequest;
      const principal = authenticatedRequest.auth;

      if (!principal || !canCreateAppointment(authenticatedRequest, input.patientId, input.practitionerId)) {
        response.status(403).json({
          error: { code: "FORBIDDEN", message: "Authenticated principal cannot create this appointment." },
        });
        return;
      }

      const appointment = await createAppointment({ ...input, ownerUserId: principal.sub });
      response.status(201).json({ data: appointment });
    } catch (error) {
      if (error instanceof ZodError || error instanceof AppointmentDomainError) {
        response.status(400).json({ error: { code: "VALIDATION_ERROR", message: error.message } });
        return;
      }
      if (error instanceof AppointmentConflictError) {
        response.status(409).json({ error: { code: "APPOINTMENT_CONFLICT", message: error.message } });
        return;
      }
      response.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Unexpected server error." },
      });
    }
  });

  return router;
}
