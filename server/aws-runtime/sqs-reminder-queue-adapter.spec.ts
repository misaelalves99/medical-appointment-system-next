import { BoundedSqsReminderQueueAdapter, type SqsSendInput } from "./sqs-reminder-queue-adapter";
import type { ReminderEventV1 } from "./reminder-queue-port";

describe("BoundedSqsReminderQueueAdapter", () => {
  const event: ReminderEventV1 = {
    eventId: "evt-synthetic-001",
    eventType: "appointment-reminder-requested-v1",
    occurredAt: "2026-09-22T12:00:00.000Z",
    appointmentId: "appt-synthetic-001",
    ownerId: "owner-synthetic-001",
  };

  it("maps the bounded event contract to an SQS send input without network access", async () => {
    const sent: SqsSendInput[] = [];
    const adapter = new BoundedSqsReminderQueueAdapter(
      { send: async input => { sent.push(input); return { MessageId: "msg-local-001" }; } },
      "https://sqs.local.invalid/123/reminders.fifo",
    );
    await expect(adapter.send(event)).resolves.toEqual({ messageId: "msg-local-001" });
    expect(sent).toEqual([{
      QueueUrl: "https://sqs.local.invalid/123/reminders.fifo",
      MessageBody: JSON.stringify(event),
      MessageDeduplicationId: event.eventId,
      MessageGroupId: event.appointmentId,
    }]);
  });

  it("propagates sender failure so the caller can retain retry responsibility", async () => {
    const adapter = new BoundedSqsReminderQueueAdapter(
      { send: async () => { throw new Error("synthetic-sqs-failure"); } },
      "https://sqs.local.invalid/123/reminders.fifo",
    );
    await expect(adapter.send(event)).rejects.toThrow("synthetic-sqs-failure");
  });

  it("rejects incomplete identity before attempting a send", async () => {
    let calls = 0;
    const adapter = new BoundedSqsReminderQueueAdapter(
      { send: async () => { calls++; return {}; } },
      "https://sqs.local.invalid/123/reminders.fifo",
    );
    await expect(adapter.send({ ...event, eventId: "" })).rejects.toThrow("Invalid reminder event identity");
    expect(calls).toBe(0);
  });
});