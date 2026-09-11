import {
  AppointmentConflictError,
  createAppointmentService,
} from "./create-appointment";
import type { AppointmentRepository } from "../ports/appointment-repository";

const input = {
  patientId: "patient-demo-001",
  practitionerId: "practitioner-demo-001",
  startAt: "2026-09-11T13:00:00.000Z",
  endAt: "2026-09-11T13:30:00.000Z",
  reason: "Synthetic portfolio appointment",
};

describe("create appointment service", () => {
  it("returns the record created by the repository contract", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn().mockResolvedValue({
        id: "appointment-demo-001",
        ...input,
      }),
    };

    const createAppointment = createAppointmentService(repository);

    await expect(createAppointment(input)).resolves.toEqual({
      id: "appointment-demo-001",
      ...input,
    });
  });

  it("maps repository overlap rejection to a conflict error", async () => {
    const repository: AppointmentRepository = {
      createIfNoOverlap: jest.fn().mockResolvedValue(null),
    };

    const createAppointment = createAppointmentService(repository);

    await expect(createAppointment(input)).rejects.toBeInstanceOf(
      AppointmentConflictError,
    );
  });
});