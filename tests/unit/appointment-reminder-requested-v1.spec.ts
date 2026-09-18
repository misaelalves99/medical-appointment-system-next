import {
  APPOINTMENT_REMINDER_REQUESTED_V1,
  assertAppointmentReminderRequestedV1,
  isAppointmentReminderRequestedV1,
} from "../../server/contracts/events/appointment-reminder-requested-v1";

const valid = {
  eventId: "evt-1",
  eventType: APPOINTMENT_REMINDER_REQUESTED_V1,
  occurredAt: "2026-09-18T12:00:00.000Z",
  appointmentId: "appt-1",
  scheduledFor: "2026-09-19T12:00:00.000Z",
};

describe("appointment reminder integration event v1", () => {
  it("accepts the canonical contract", () => expect(isAppointmentReminderRequestedV1(valid)).toBe(true));
  it.each(["eventId","occurredAt","appointmentId","scheduledFor"])("rejects missing %s", (field) => {
    const malformed = { ...valid } as Record<string, unknown>;
    delete malformed[field];
    expect(isAppointmentReminderRequestedV1(malformed)).toBe(false);
  });
  it("rejects unsupported event type", () => expect(isAppointmentReminderRequestedV1({ ...valid, eventType: "appointment.reminder.requested.v2" })).toBe(false));
  it("assertion throws for malformed event", () => expect(() => assertAppointmentReminderRequestedV1({ eventType: APPOINTMENT_REMINDER_REQUESTED_V1 })).toThrow());
});

