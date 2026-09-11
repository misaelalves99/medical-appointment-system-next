import {
  AppointmentDomainError,
  assertAppointmentInvariant,
} from "./appointment";

describe("appointment domain invariant", () => {
  it("accepts an interval whose start precedes its end", () => {
    expect(() =>
      assertAppointmentInvariant({
        patientId: "patient-demo-001",
        practitionerId: "practitioner-demo-001",
        startAt: "2026-09-11T13:00:00.000Z",
        endAt: "2026-09-11T13:30:00.000Z",
        reason: "Synthetic portfolio appointment",
      }),
    ).not.toThrow();
  });

  it("rejects start equal to or after end", () => {
    expect(() =>
      assertAppointmentInvariant({
        patientId: "patient-demo-001",
        practitionerId: "practitioner-demo-001",
        startAt: "2026-09-11T13:30:00.000Z",
        endAt: "2026-09-11T13:00:00.000Z",
      }),
    ).toThrow(AppointmentDomainError);
  });
});