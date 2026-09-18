import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "../auth/middleware";
import type { AppointmentDto } from "../contracts/appointment";

export interface AppointmentStatusReadPort {
  findByIdForPrincipal(id: string, principalId: string): Promise<AppointmentDto | null>;
}

export function createAppointmentStatusStreamHandler(
  readPort: AppointmentStatusReadPort,
  heartbeatMs = 15000,
): RequestHandler {
  return async (request, response) => {
    const principal = (request as AuthenticatedRequest).auth;
    if (!principal) {
      response.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required." } });
      return;
    }

    const appointmentId = request.params.id;
    if (typeof appointmentId !== "string") {
      response.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid appointment id." } });
      return;
    }

    const appointment = await readPort.findByIdForPrincipal(appointmentId, principal.sub);
    if (!appointment) {
      response.status(404).json({ error: { code: "NOT_FOUND", message: "Appointment not found." } });
      return;
    }

    response.status(200);
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders();

    response.write(`event: snapshot\ndata: ${JSON.stringify({ appointment })}\n\n`);

    const heartbeat = setInterval(() => {
      response.write(": heartbeat\n\n");
    }, heartbeatMs);

    request.on("close", () => {
      clearInterval(heartbeat);
      response.end();
    });
  };
}

