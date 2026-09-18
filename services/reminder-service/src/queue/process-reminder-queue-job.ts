import { assertAppointmentReminderRequestedV1 } from "../../../../server/contracts/events/appointment-reminder-requested-v1";
import type { ReminderRequestedEvent } from "../../../../server/domain/outbox-event";

export interface ReminderEventHandler {
  handle(event: ReminderRequestedEvent): Promise<void>;
}

export async function processReminderQueueJob(
  job: { name: string; data: ReminderRequestedEvent },
  handler: ReminderEventHandler,
): Promise<void> {
  assertAppointmentReminderRequestedV1(job.data);
  if (job.name !== "appointment.reminder.requested.v1") {
    throw new Error(`unsupported reminder event type: ${job.name}`);
  }
  if (job.data.eventType !== "appointment.reminder.requested.v1") {
    throw new Error(`invalid reminder payload event type: ${job.data.eventType}`);
  }
  await handler.handle(job.data);
}
