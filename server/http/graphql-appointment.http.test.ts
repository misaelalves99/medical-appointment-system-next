/** @jest-environment node */
import request from "supertest";
import type { NextFunction, Request, Response } from "express";
import { createHttpApp } from "./app";
import { createAppointmentService } from "../application/create-appointment";
import type { AppointmentRepository } from "../ports/appointment-repository";
import type { AuthenticatedRequest } from "../auth/middleware";

const ownerId = "11111111-1111-4111-8111-111111111111";
const appointment = {
  id: "appointment-graphql-http-001",
  patientId: ownerId,
  practitionerId: "practitioner-demo-001",
  ownerUserId: ownerId,
  startAt: "2030-01-02T10:00:00.000Z",
  endAt: "2030-01-02T10:30:00.000Z",
  reason: "Synthetic HTTP GraphQL proof",
};

function ownerAuth(req: Request, _res: Response, next: NextFunction) {
  (req as AuthenticatedRequest).auth = { sub: ownerId, role: "PATIENT", practitionerId: null };
  next();
}

describe("POST /graphql", () => {
  it("returns 401 when unauthenticated", async () => {
    const repository: AppointmentRepository = { createIfNoOverlap: jest.fn(), findByIdForPrincipal: jest.fn() };
    await request(createHttpApp(createAppointmentService(repository), { appointmentReadPort: repository }))
      .post("/graphql").send({ query: "{ appointment(id: \"x\") { id } }" }).expect(401);
    expect(repository.findByIdForPrincipal).not.toHaveBeenCalled();
  });

  it("returns the owner-visible appointment through the mounted endpoint", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
      findByIdForPrincipal: jest.fn().mockResolvedValue(appointment),
    };
    const app = createHttpApp(createAppointmentService(repository), {
      requireAuth: ownerAuth,
      appointmentReadPort: repository,
    });
    const response = await request(app).post("/graphql").send({
      query: "query($id: ID!) { appointment(id: $id) { id ownerUserId } }",
      variables: { id: appointment.id },
    }).expect(200);
    expect(repository.findByIdForPrincipal).toHaveBeenCalledWith(appointment.id, ownerId);
    expect(response.body).toEqual({ data: { appointment: { id: appointment.id, ownerUserId: ownerId } } });
  });

  it("returns null when the owner-scoped repository read denies visibility", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
      findByIdForPrincipal: jest.fn().mockResolvedValue(null),
    };
    const app = createHttpApp(createAppointmentService(repository), {
      requireAuth: ownerAuth,
      appointmentReadPort: repository,
    });
    const response = await request(app).post("/graphql")
      .send({ query: "{ appointment(id: \"hidden\") { id } }" }).expect(200);
    expect(response.body).toEqual({ data: { appointment: null } });
  });
});
