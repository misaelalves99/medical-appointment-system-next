import type { ReminderEventV1, ReminderQueuePort } from "./reminder-queue-port";

export type PublishReminderEventResult = {
  eventId: string;
  messageId?: string;
};

export async function publishReminderEventToSqs(
  queue: ReminderQueuePort,
  event: ReminderEventV1,
): Promise<PublishReminderEventResult> {
  const sent = await queue.send(event);
  return { eventId: event.eventId, messageId: sent.messageId };
}