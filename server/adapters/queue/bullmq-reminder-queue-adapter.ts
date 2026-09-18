import type { JobsOptions, Queue } from "bullmq";
import type { ReminderRequestedEvent } from "../../domain/outbox-event";
import type { ReminderQueuePort } from "../../application/publish-reminder-outbox-event";

export const REMINDER_QUEUE_NAME = "appointment-reminders";

export class BullMqReminderQueueAdapter implements ReminderQueuePort {
  constructor(private readonly queue: Pick<Queue, "add">) {}

  async enqueue(event: ReminderRequestedEvent): Promise<void> {
    const options: JobsOptions = {
      jobId: event.eventId,
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: true,
    };
    await this.queue.add(event.eventType, event, options);
  }
}
