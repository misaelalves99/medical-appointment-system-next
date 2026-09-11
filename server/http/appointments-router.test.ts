/** @jest-environment node */

import request from "supertest";
import type { NextFunction, Request, Response } from "express";
import { createHttpApp } from "./app";
import { createAppointmentService } from "../application/create-appointment";
import type { AppointmentRepository } from "../ports/appointment-repository";
import type { AuthenticatedRequest } from "../auth/middleware";

const patientId = "11111111-1111-4111-8111-111111111111";

const validPayload = {
  patientId,
  practitionerId: "practitioner-demo-001",
  startAt: "2026-09-11T13:00:00.000Z",
  endAt: "2026-09-11T13:30:00.000Z",
  reason: "Synthetic portfolio appointment",
};

function patientAuth(request: Request, _response: Response, next: NextFunction) {
  (request as AuthenticatedRequest).auth = {
    sub: patientId,
    role: "PATIENT",
    practitionerId: null,
  };
  next();
}

describe("POST /api/appointments", () => {
  it("returns 401 without an authenticated principal", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
    };
    const app = createHttpApp(createAppointmentService(repository));
    await request(app).post("/api/appointments").send(validPayload).expect(401);
  });

  it("returns 201 for an authorized patient appointment", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn().mockResolvedValue({
        id: "appointment-demo-001",
        ...validPayload,
      }),
    };

    const app = createHttpApp(createAppointmentService(repository), {
      requireAuth: patientAuth,
    });

    await request(app)
      .post("/api/appointments")
      .send(validPayload)
      .expect(201)
      .expect(({ body }) => {
        expect(body.data.id).toBe("appointment-demo-001");
      });
  });

  it("returns 403 when a patient attempts another user's appointment", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
    };

    const app = createHttpApp(createAppointmentService(repository), {
      requireAuth: patientAuth,
    });

    await request(app)
      .post("/api/appointments")
      .send({ ...validPayload, patientId: "22222222-2222-4222-8222-222222222222" })
      .expect(403);

    expect(repository.createIfNoOverlap).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid time interval", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
    };

    const app = createHttpApp(createAppointmentService(repository), {
      requireAuth: patientAuth,
    });

    await request(app)
      .post("/api/appointments")
      .send({
        ...validPayload,
        startAt: "2026-09-11T14:00:00.000Z",
        endAt: "2026-09-11T13:00:00.000Z",
      })
      .expect(400);

    expect(repository.createIfNoOverlap).not.toHaveBeenCalled();
  });

  it("returns 409 when the repository rejects an overlap", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn().mockResolvedValue(null),
    };

    const app = createHttpApp(createAppointmentService(repository), {
      requireAuth: patientAuth,
    });

    await request(app)
      .post("/api/appointments")
      .send(validPayload)
      .expect(409);
  });

  it("returns 500 without leaking an internal exception", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest
        .fn()
        .mockRejectedValue(new Error("synthetic internal failure")),
    };

    const app = createHttpApp(createAppointmentService(repository), {
      requireAuth: patientAuth,
    });

    await request(app)
      .post("/api/appointments")
      .send(validPayload)
      .expect(500)
      .expect({
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected server error.",
        },
      });
  });
});
