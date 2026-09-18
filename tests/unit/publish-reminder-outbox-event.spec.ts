import { publishReminderOutboxEvent } from "../../server/application/publish-reminder-outbox-event";

const event = {
  eventId: "evt-stage04-001",
  eventType: "appointment.reminder.requested.v1" as const,
  occurredAt: "2026-09-17T20:00:00.000Z",
  appointmentId: "appt-stage04-001",
  scheduledFor: "2026-09-18T20:00:00.000Z",
};

describe("publishReminderOutboxEvent", () => {
  it("marks the outbox event published only after enqueue succeeds", async () => {
    const order: string[] = [];
    const queue = { enqueue: jest.fn(async () => { order.push("enqueue"); }) };
    const outbox = { markPublished: jest.fn(async () => { order.push("markPublished"); }) };

    await publishReminderOutboxEvent(event, queue, outbox);

    expect(order).toEqual(["enqueue", "markPublished"]);
    expect(queue.enqueue).toHaveBeenCalledWith(event);
    expect(outbox.markPublished).toHaveBeenCalledWith(event.eventId);
  });

  it("does not mark the outbox event published when enqueue fails", async () => {
    const queue = { enqueue: jest.fn(async () => { throw new Error("queue unavailable"); }) };
    const outbox = { markPublished: jest.fn(async () => undefined) };

    await expect(publishReminderOutboxEvent(event, queue, outbox)).rejects.toThrow("queue unavailable");
    expect(outbox.markPublished).not.toHaveBeenCalled();
  });
});
