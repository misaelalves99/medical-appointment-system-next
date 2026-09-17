import { createReminderRequestedEvent } from "../../server/domain/outbox-event";

describe("createReminderRequestedEvent", () => {
  it("creates the privacy-minimal versioned reminder event", () => {
    const event = createReminderRequestedEvent({
      eventId: "evt-1",
      occurredAt: new Date("2026-09-17T12:00:00.000Z"),
      appointmentId: "apt-1",
      scheduledFor: new Date("2026-09-18T12:00:00.000Z"),
    });

    expect(event).toEqual({
      eventId: "evt-1",
      eventType: "appointment.reminder.requested.v1",
      occurredAt: "2026-09-17T12:00:00.000Z",
      appointmentId: "apt-1",
      scheduledFor: "2026-09-18T12:00:00.000Z",
    });
    expect(Object.keys(event).sort()).toEqual(
      ["appointmentId","eventId","eventType","occurredAt","scheduledFor"].sort(),
    );
  });
});
