import { appointments, outboxEvents } from "../../server/db/schema";
import { writeAppointmentAndOutbox } from "../../server/adapters/postgres/appointment-outbox-writer";

describe("writeAppointmentAndOutbox", () => {
  it("writes appointment first and outbox second through the same transaction handle", async () => {
    const calls: unknown[] = [];
    const values = jest.fn(async (value: unknown) => {
      calls.push(["values", value]);
      return undefined;
    });
    const insert = jest.fn((table: unknown) => {
      calls.push(["insert", table]);
      return { values };
    });
    const tx = { insert };

    const appointment = { id: "apt-001" } as any;
    const event = {
      eventId: "evt-001",
      eventType: "appointment.reminder.requested.v1",
      occurredAt: new Date("2026-09-17T12:00:00.000Z"),
      appointmentId: "apt-001",
      scheduledFor: new Date("2026-09-18T12:00:00.000Z"),
    };

    await writeAppointmentAndOutbox(tx, appointment, event);

    expect(insert).toHaveBeenNthCalledWith(1, appointments);
    expect(insert).toHaveBeenNthCalledWith(2, outboxEvents);
    expect(calls[1]).toEqual(["values", appointment]);
    expect(calls[3]).toEqual(["values", {
      id: event.eventId,
      eventType: event.eventType,
      aggregateId: event.appointmentId,
      payload: event,
      occurredAt: event.occurredAt,
      publishedAt: null,
    }]);
  });
});
