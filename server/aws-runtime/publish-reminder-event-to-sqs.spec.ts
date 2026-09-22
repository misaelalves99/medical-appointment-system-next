import { publishReminderEventToSqs } from "./publish-reminder-event-to-sqs";
import type { ReminderEventV1, ReminderQueuePort } from "./reminder-queue-port";

describe("publishReminderEventToSqs", () => {
  const event: ReminderEventV1 = {
    eventId: "evt-synthetic-005",
    eventType: "appointment-reminder-requested-v1",
    occurredAt: "2026-09-22T12:00:00.000Z",
    appointmentId: "appt-synthetic-005",
    ownerId: "owner-synthetic-005",
  };

  it("publishes through the bounded queue port and returns correlation identity", async () => {
    const seen: ReminderEventV1[] = [];
    const queue: ReminderQueuePort = {
      send: async value => {
        seen.push(value);
        return { messageId: "msg-synthetic-005" };
      },
    };
    await expect(publishReminderEventToSqs(queue, event)).resolves.toEqual({
      eventId: event.eventId,
      messageId: "msg-synthetic-005",
    });
    expect(seen).toEqual([event]);
  });

  it("does not acknowledge publication when the queue boundary fails", async () => {
    const queue: ReminderQueuePort = {
      send: async () => { throw new Error("synthetic-publish-failure"); },
    };
    await expect(publishReminderEventToSqs(queue, event)).rejects.toThrow("synthetic-publish-failure");
  });
});