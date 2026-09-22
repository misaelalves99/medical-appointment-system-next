import {
  mapExistingOutboxReminderToSqsEvent,
  publishExistingOutboxReminderToSqs,
} from "./outbox-reminder-to-sqs";
import type { ReminderEventV1, ReminderQueuePort } from "./reminder-queue-port";

describe("existing outbox reminder -> bounded SQS path", () => {
  const outbox = {
    id: "evt-outbox-synthetic-006",
    eventType: "appointment-reminder-requested-v1",
    occurredAt: new Date("2026-09-22T12:00:00.000Z"),
    payload: {
      appointmentId: "appt-synthetic-006",
      ownerId: "owner-synthetic-006",
    },
  };

  it("maps the existing outbox identity into the bounded SQS contract", () => {
    expect(mapExistingOutboxReminderToSqsEvent(outbox)).toEqual({
      eventId: outbox.id,
      eventType: "appointment-reminder-requested-v1",
      occurredAt: "2026-09-22T12:00:00.000Z",
      appointmentId: outbox.payload.appointmentId,
      ownerId: outbox.payload.ownerId,
    });
  });

  it("publishes the mapped outbox event without changing the existing BullMQ path", async () => {
    const seen: ReminderEventV1[] = [];
    const queue: ReminderQueuePort = {
      send: async event => { seen.push(event); return { messageId: "msg-synthetic-006" }; },
    };
    await expect(publishExistingOutboxReminderToSqs(queue, outbox)).resolves.toEqual({
      eventId: outbox.id,
      messageId: "msg-synthetic-006",
    });
    expect(seen[0]?.eventId).toBe(outbox.id);
  });

  it("rejects a different event type before queue publication", async () => {
    const queue: ReminderQueuePort = { send: async () => { throw new Error("must-not-send"); } };
    await expect(publishExistingOutboxReminderToSqs(queue, { ...outbox, eventType: "other-v1" }))
      .rejects.toThrow("Unsupported outbox reminder event");
  });
});