import {
  BullMqReminderQueueAdapter,
  REMINDER_QUEUE_NAME,
} from "../../server/adapters/queue/bullmq-reminder-queue-adapter";

const event = {
  eventId: "evt-stage04-002",
  eventType: "appointment.reminder.requested.v1" as const,
  occurredAt: "2026-09-17T20:00:00.000Z",
  appointmentId: "appt-stage04-002",
  scheduledFor: "2026-09-18T20:00:00.000Z",
};

describe("BullMqReminderQueueAdapter", () => {
  it("enqueues the canonical event with eventId job id and bounded retry policy", async () => {
    const add = jest.fn(async () => ({ id: event.eventId }));
    const adapter = new BullMqReminderQueueAdapter({ add } as any);

    await adapter.enqueue(event);

    expect(REMINDER_QUEUE_NAME).toBe("appointment-reminders");
    expect(add).toHaveBeenCalledWith(
      event.eventType,
      event,
      expect.objectContaining({
        jobId: event.eventId,
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      }),
    );
  });

  it("propagates enqueue failure to preserve the outbox acknowledgement boundary", async () => {
    const add = jest.fn(async () => { throw new Error("redis unavailable"); });
    const adapter = new BullMqReminderQueueAdapter({ add } as any);

    await expect(adapter.enqueue(event)).rejects.toThrow("redis unavailable");
  });
});
