/** @jest-environment node */
import http from "http";
import type { NextFunction, Request, Response } from "express";
import { createHttpApp } from "./app";
import { createAppointmentService } from "../application/create-appointment";
import type { AppointmentRepository } from "../ports/appointment-repository";
import type { AuthenticatedRequest } from "../auth/middleware";

const ownerId = "11111111-1111-4111-8111-111111111111";
const appointment = {
  id: "appointment-sse-http-001",
  patientId: ownerId,
  practitionerId: "practitioner-demo-001",
  ownerUserId: ownerId,
  startAt: "2030-01-02T10:00:00.000Z",
  endAt: "2030-01-02T10:30:00.000Z",
  reason: "Synthetic SSE HTTP proof",
};

function ownerAuth(req: Request, _res: Response, next: NextFunction) {
  (req as AuthenticatedRequest).auth = { sub: ownerId, role: "PATIENT", practitionerId: null };
  next();
}

function openStream(app: ReturnType<typeof createHttpApp>, path: string) {
  return new Promise<{ status: number | undefined; headers: http.IncomingHttpHeaders; firstChunk: string }>((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("HTTP test server address unavailable"));
        return;
      }
      const req = http.get({ hostname: "127.0.0.1", port: address.port, path }, (res) => {
        res.setEncoding("utf8");
        res.once("data", (chunk) => {
          const result = { status: res.statusCode, headers: res.headers, firstChunk: String(chunk) };
          req.destroy();
          res.destroy();
          server.close(() => resolve(result));
        });
      });
      req.on("error", (error) => server.close(() => reject(error)));
    });
  });
}

describe("GET /api/appointments/:id/status-stream", () => {
  it("returns 401 when unauthenticated", async () => {
    const repository: AppointmentRepository = { createIfNoOverlap: jest.fn(), findByIdForPrincipal: jest.fn() };
    const app = createHttpApp(createAppointmentService(repository), { appointmentReadPort: repository });
    const server = app.listen();
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("address unavailable");
    const response = await fetch(`http://127.0.0.1:${address.port}/api/appointments/${appointment.id}/status-stream`);
    expect(response.status).toBe(401);
    expect(repository.findByIdForPrincipal).not.toHaveBeenCalled();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("returns 404 for an authenticated principal without owner-scoped visibility", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
      findByIdForPrincipal: jest.fn().mockResolvedValue(null),
    };
    const app = createHttpApp(createAppointmentService(repository), { requireAuth: ownerAuth, appointmentReadPort: repository });
    const server = app.listen();
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("address unavailable");
    const response = await fetch(`http://127.0.0.1:${address.port}/api/appointments/${appointment.id}/status-stream`);
    expect(response.status).toBe(404);
    expect(repository.findByIdForPrincipal).toHaveBeenCalledWith(appointment.id, ownerId);
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("opens a real SSE response and emits the owner-visible snapshot", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
      findByIdForPrincipal: jest.fn().mockResolvedValue(appointment),
    };
    const app = createHttpApp(createAppointmentService(repository), { requireAuth: ownerAuth, appointmentReadPort: repository });
    const result = await openStream(app, `/api/appointments/${appointment.id}/status-stream`);
    expect(result.status).toBe(200);
    expect(result.headers["content-type"]).toContain("text/event-stream");
    expect(result.headers["cache-control"]).toContain("no-cache");
    expect(result.firstChunk).toContain("event: snapshot");
    expect(result.firstChunk).toContain(appointment.id);
    expect(repository.findByIdForPrincipal).toHaveBeenCalledWith(appointment.id, ownerId);
  });
});
