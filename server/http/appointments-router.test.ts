/** @jest-environment node */

import request from "supertest";
import { createHttpApp } from "./app";
import { createAppointmentService } from "../application/create-appointment";
import type { AppointmentRepository } from "../ports/appointment-repository";

const validPayload = {
  patientId: "patient-demo-001",
  practitionerId: "practitioner-demo-001",
  startAt: "2026-09-11T13:00:00.000Z",
  endAt: "2026-09-11T13:30:00.000Z",
  reason: "Synthetic portfolio appointment",
};

describe("POST /api/appointments", () => {
  it("returns 201 for a valid appointment", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn().mockResolvedValue({
        id: "appointment-demo-001",
        ...validPayload,
      }),
    };

    const app = createHttpApp(createAppointmentService(repository));

    await request(app)
      .post("/api/appointments")
      .send(validPayload)
      .expect(201)
      .expect(({ body }) => {
        expect(body.data.id).toBe("appointment-demo-001");
      });
  });

  it("returns 400 for an invalid time interval", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn(),
    };

    const app = createHttpApp(createAppointmentService(repository));

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

    const app = createHttpApp(createAppointmentService(repository));

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

    const app = createHttpApp(createAppointmentService(repository));

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