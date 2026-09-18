import { processReminderQueueJob } from "../../services/reminder-service/src/queue/process-reminder-queue-job";

const event = {
  eventId: "evt-stage04-consumer-001",
  eventType: "appointment.reminder.requested.v1" as const,
  occurredAt: "2026-09-18T00:00:00.000Z",
  appointmentId: "appt-stage04-consumer-001",
  scheduledFor: "2026-09-18T01:00:00.000Z",
};

describe("processReminderQueueJob", () => {
  it("delegates the canonical event to the bounded reminder handler", async () => {
    const handle = jest.fn(async () => undefined);
    await processReminderQueueJob({ name: event.eventType, data: event }, { handle });
    expect(handle).toHaveBeenCalledTimes(1);
    expect(handle).toHaveBeenCalledWith(event);
  });

  it("propagates handler failure so BullMQ can retry the job", async () => {
    const handle = jest.fn(async () => { throw new Error("synthetic handler failure"); });
    await expect(processReminderQueueJob({ name: event.eventType, data: event }, { handle }))
      .rejects.toThrow("synthetic handler failure");
  });

  it("rejects unsupported job names before invoking the handler", async () => {
    const handle = jest.fn(async () => undefined);
    await expect(processReminderQueueJob({ name: "unsupported.event", data: event }, { handle }))
      .rejects.toThrow("unsupported reminder event type");
    expect(handle).not.toHaveBeenCalled();
  });
});
