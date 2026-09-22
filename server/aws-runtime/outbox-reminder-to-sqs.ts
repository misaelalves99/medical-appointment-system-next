import type { ReminderEventV1, ReminderQueuePort } from "./reminder-queue-port";
import { publishReminderEventToSqs } from "./publish-reminder-event-to-sqs";

export type ExistingReminderOutboxEvent = {
  id: string;
  eventType: string;
  payload: unknown;
  occurredAt: Date | string;
};

type ExistingReminderPayload = {
  appointmentId: string;
  ownerId: string;
};

export function mapExistingOutboxReminderToSqsEvent(
  outbox: ExistingReminderOutboxEvent,
): ReminderEventV1 {
  if (outbox.eventType !== "appointment-reminder-requested-v1") {
    throw new Error("Unsupported outbox reminder event");
  }
  const payload = outbox.payload as Partial<ExistingReminderPayload> | null;
  if (!payload?.appointmentId || !payload.ownerId || !outbox.id) {
    throw new Error("Invalid outbox reminder event");
  }
  const occurredAt =
    outbox.occurredAt instanceof Date ? outbox.occurredAt.toISOString() : outbox.occurredAt;
  return {
    eventId: outbox.id,
    eventType: "appointment-reminder-requested-v1",
    occurredAt,
    appointmentId: payload.appointmentId,
    ownerId: payload.ownerId,
  };
}

export async function publishExistingOutboxReminderToSqs(
  queue: ReminderQueuePort,
  outbox: ExistingReminderOutboxEvent,
) {
  return publishReminderEventToSqs(queue, mapExistingOutboxReminderToSqsEvent(outbox));
}