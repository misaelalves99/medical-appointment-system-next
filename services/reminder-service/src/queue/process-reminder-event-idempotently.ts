import type { ReminderRequestedEvent } from "../../../../server/domain/outbox-event";
import type { ReminderEventHandler } from "./process-reminder-queue-job";

export interface ProcessedEventStore {
  has(eventId: string): Promise<boolean>;
  markProcessed(eventId: string): Promise<void>;
}

export async function processReminderEventIdempotently(
  event: ReminderRequestedEvent,
  handler: ReminderEventHandler,
  store: ProcessedEventStore,
): Promise<"processed" | "duplicate"> {
  if (await store.has(event.eventId)) return "duplicate";
  await handler.handle(event);
  await store.markProcessed(event.eventId);
  return "processed";
}
