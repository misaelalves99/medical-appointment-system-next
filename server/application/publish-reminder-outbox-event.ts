import type { ReminderRequestedEvent } from "../domain/outbox-event";

export interface ReminderQueuePort {
  enqueue(event: ReminderRequestedEvent): Promise<void>;
}

export interface OutboxPublicationPort {
  markPublished(eventId: string): Promise<void>;
}

export async function publishReminderOutboxEvent(
  event: ReminderRequestedEvent,
  queue: ReminderQueuePort,
  outbox: OutboxPublicationPort,
): Promise<void> {
  await queue.enqueue(event);
  await outbox.markPublished(event.eventId);
}
